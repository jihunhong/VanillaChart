import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData, AlbumData} from '../../@types';
import { LoadEvent, Page } from 'puppeteer';
import db, { Chart, sequelize, Music, Album } from '../models';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { fetchAlbumInfo as getGenieAlbumInfo } from './genieCrawl';
import { fetchAlbumInfo as getMelonAlbumInfo } from './melonCrawl';
import { fetchAlbumInfo as getBugsAlbumInfo } from './bugsCrawl';

dotenv.config({ path : path.join(__dirname, '../../.env') });
const s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCES_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });

puppeteer.use(StealthPlugin());

db.sequelize.sync()
    .then(() => {
        console.log('sequelize connected');
    })
    .catch((err: Error) => {
        console.error(err);
});

const MIN_MATCH_SCORE = 9;

export const waitor = {
    waitUntil : <LoadEvent> "networkidle2"
}

export async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless : process.env.NODE_ENV === 'production'
    });
    const page = await browser.newPage();
    return { browser, page };
}

// export async function albumInsert({ page, site, chart } : { page: Page ,site : siteName, chart : Array<ChartData> }) {
//     for(const row of chart){

//         const albumInfo = await getAlbumInfo({ page, albumId: row.album_id });
        
//         const res = await Album.findAndUpdate({
//             where : {
//                 albumName: albumInfo.albumName,
//                 artist: albumInfo.artist,
//                 releaseDate: albumInfo.releaseDate
//             },
//             raw : true
//         });

//         for(const single of albumInfo.tracks){
//             await Music.findOrCreate({
//                 where : {
//                     title: single.track,
//                     artist: row.artist,
//                     album: row.album,
//                     lead:  single.lead,
//                     AlbumId: res.id
//                 }
//             })
//         }
//     }
// }

async function getAlbumInfo({ page, site, albumId }): Promise<AlbumData>{
    const func = {
        'melon': getMelonAlbumInfo,
        'genie': getGenieAlbumInfo,
        'bugs': getBugsAlbumInfo
    };

    const targetFunction = func[site];
    return targetFunction({ page, albumId });
}

export async function insertChart({ page, site, chart } : { page: Page, site : siteName, chart : Array<ChartData> }) {
    for(const row of chart){
        const exist = await Album.findOne({
            where : {
                id: Number(row.album_id)
            }
        });
        if(exist){
            continue;
        }

        const albumInfo = await getAlbumInfo({ page, site, albumId: row.album_id });
        
        await Album.findOrCreate({
            where: {
                id: Number(row.album_id),
                artist: row.artist,
                album: row.album,
                site,
                releaseDate: albumInfo.releaseDate
            }
        })
        // fts로 이것도 매칭할까..?
        
        for(const music of albumInfo.tracks){
            const res = await Music.findOrCreate({
                where : {
                    title : music.track,
                    artist : row.artist,
                    album : row.album,
                    AlbumId: Number(row.album_id),
                    lead: Boolean(music.lead)
                },
                raw : true
            });
            if(row.title === music.track){
                await Chart.findOrCreate({
                    where: {
                        rank : row.rank,
                        site,
                        MusicId : res[0].id || res[0].dataValues.id,
                    }
                })
            }
        }
        await imageDownload({ url : row.image!, music : row, site });
    }
}

export async function fullTextSearch(element : ChartData): Promise<ChartData> {
    try{
        const matchedList:Array<ChartData> = await sequelize.query(`
            SELECT *, match(title, artist) against( ? ) as score 
            FROM Music 
            WHERE match(title, artist) against( ? ) AND 
                id IN (
                    SELECT MusicId
                    FROM Charts
                    WHERE site = 'genie'
                )
            ORDER BY score desc
            LIMIT 5;`
        , {
            replacements : [ `${element.title} ${element.artist}`, `${element.title} ${element.artist}` ],
            type : sequelize.QueryTypes.SELECT
        });

        if(matchedList.length > 0 ){
            if(matchedList[0].score! > MIN_MATCH_SCORE){
                console.log(`✔ '${element.title} - ${element.artist}' matched '${matchedList[0].title} - ${matchedList[0].artist}' `);
                return {
                    ...element,
                    ...matchedList[0],
                    matched: true
                }
            }else{
                if((element.title.includes(matchedList[0].title) && element.artist.includes(matchedList[0].artist))
                ||
                matchedList[0].title.includes(element.title) && matchedList[0].artist.includes(element.artist)
                ){
                    console.warn(`💫 '${element.title} - ${element.artist}' can not matched max score => ${matchedList[0].title} - ${matchedList[0].artist} : ${matchedList[0].score} `)
                    return {
                        ...element,
                        ...matchedList[0],
                        matched: true
                    }
                }
                console.error(`❌ '${element.title} - ${element.artist}' not found `)
                return {
                    ...element,
                };
            }
        }else{
            console.error(`❌ '${element.title} - ${element.artist}' not found `)
            return element;
        }
    }catch(err){
        console.error(err);
        return element;
    }
}

async function download({ targetPath, url } : { targetPath : string, url : string }){
    const writer = fs.createWriteStream(targetPath);
    const response = await axios({
        url,
        method : 'GET',
        responseType : 'stream'
    });

    response.data.pipe(writer);

    return new Promise((res, rej) => {
        writer.on('finish', res);
        writer.on('error', rej);
    })
}

async function uploadS3({ targetPath, music }: { targetPath : string, music: ChartData }){
    const fileContent = fs.readFileSync(targetPath);
    const params = {
        Bucket : 'cherrychart.resources',
        Key : `${music.album.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`,
        Body : fileContent
    }
    return new Promise((res, rej) => {
        s3.upload(params, (err, data) => {
            if(err) rej(err);
            console.log(`File uploaded Successfully at ${data.Location}`)
            res(data);
        })    
    })
}

export async function imageDownload({ url, site, music } : { url : string, site : siteName, music : ChartData }) {
    const targetPath = path.join(__dirname, `../../covers/${music.album.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`);
    const coverDir = path.join(__dirname, `../../covers`);
    const exist = fs.existsSync(coverDir);

    if(!exist){
        fs.mkdirSync(coverDir);
    }
    if(!fs.existsSync(targetPath)){
        await download({ targetPath, url });
        await uploadS3({ targetPath, music });
    }
}

export async function ftsMatchingJob({ chart } : { chart : Array<ChartData> }){
    const res:Array<ChartData> = [];
    for(const el of chart){
        const mapped = await fullTextSearch(el);
        res.push(mapped);
    }
    return res;
}