import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
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
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    return { browser, page };
}

async function getAlbumInfo({ page, site, albumId }): Promise<any>{
    const func = {
        'melon': getMelonAlbumInfo,
        'genie': getGenieAlbumInfo,
        'bugs': getBugsAlbumInfo
    };

    const targetFunction = func[site];
    return targetFunction({ page, albumId });
}

export async function insertChart({ page, site, chart }: { page: Page, site: siteName, chart: Array<ChartData> }){
    for(const row of chart) {
        if(row.matched){
            // 매칭이 됐다면 앨범정보, 음원 정보 모두 이미 있다는 말이다.
            await Chart.create({
                rank: row.rank,
                site,
                MusicId: row.id
            })
            continue;
        }
        // 매칭이 되지 않은 경우
        const albumInfoExist = await Album.findOne({
            where : {
                id: row.album_id
            }
        })
        if(!albumInfoExist){
             const albumInfo = await getAlbumInfo({ page, site, albumId: row.album_id });
             const { tracks } = albumInfo;

             const album = await Album.findOrCreate({
                 where : {
                     album: row.album,
                     artist: row.artist,
                     releaseDate: albumInfo.releaseDate,
                     site,
                 }
             })
        
             for(const element of tracks){
                 const res = await Music.findOrCreate({
                     where: {
                         title: element.track,
                         artist: row.artist,
                         album: row.album,
                         lead: element.lead,
                         AlbumId: album[0].id
                     }
                 })
                 if(row.title === element.track){
                    await Chart.create({
                        rank: row.rank,
                        site,
                        MusicId: res[0].id
                    })
                 }
             }
             await imageDownload({ url : row.image!, music : row, site });
             continue;
        }
        //  매칭이 되지 않았지만 이미 앨범 정보가 있다면
        //  이전에 이미 가져왔기 때문에 위의 if문
        //  음원정보는 모두 존재한다는 말이다. 또한 Music도 이미 존재할것이다.
        const music = await Music.findOrCreate({
            where: {
                title: row.title,
                artist: row.artist,
                album: row.album,
                AlbumId: row.album_id
            }
        });
        await Chart.create({
            rank: row.rank,
            site,
            MusicId: music[0].id
        })
        continue;

    }
}

export async function fullTextSearch(element : ChartData): Promise<ChartData> {
    try{
        const matchedList:Array<any> = await sequelize.query(`
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
                    id: matchedList[0].id,
                    title : matchedList[0].title,
                    artist : matchedList[0].artist,
                    album : matchedList[0].album,
                    album_id: matchedList[0].AlbumId,
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
                        id: matchedList[0].id,
                        title : matchedList[0].title,
                        artist : matchedList[0].artist,
                        album : matchedList[0].album,
                        album_id: matchedList[0].AlbumId,
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

function deleteFile({ targetPath }) {
    fs.unlinkSync(targetPath);
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
        deleteFile({ targetPath });
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