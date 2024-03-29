import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
import { LoadEvent, Page } from 'puppeteer';
import db, { Chart, sequelize, Music, Album, Artist } from '../models';
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

const MIN_MATCH_SCORE = 7.5;
const BUCKET_NAME = 'cherrychart.resources';

export const waitor = {
    waitUntil : <LoadEvent> "networkidle2"
}

export async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless : true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    return { browser, page };
}

async function fetchAlbumInfo({ page, site, albumId }): Promise<any>{
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
        const albumInfoExist = await Album.findOne({
            where : {
                id: row.album_id
            }
        })
        const [artist] = await Artist.findOrCreate({
            where: {
                artistName: row.artistName,
                site,
            }
        })
        if(!albumInfoExist){
             const albumInfo = await fetchAlbumInfo({ page, site, albumId: row.album_id });
             const { tracks } = albumInfo;

             const [album] = await Album.findOrCreate({
                 where : {
                     albumName: row.albumName,
                     artistName: row.artistName,
                     artistId: artist.id,
                     releaseDate: albumInfo.releaseDate,
                     site,
                 }
             })
        
             for(const element of tracks){
                 const [res] = await Music.findOrCreate({
                     where: {
                         title: element.track,
                         artistName: row.artistName,
                         albumName: row.albumName,
                         lead: element.lead,
                         albumId: album.id,
                         artistId: artist.id
                     }
                 })
                 if(row.title === element.track && element.lead){
                    await Chart.create({
                        rank: row.rank,
                        site,
                        musicId: res.id
                    })
                 }
             }
             await coverDownload({ url : row.image!, music : row, site });
             continue;
        }
        
        
        
        //  이전에 이미 가져왔기 때문에 위의 if문
        //  음원정보는 모두 존재한다는 말이다. 또한 Music도 이미 존재할것이다.
        const [music] = await Music.findOrCreate({
            where: {
                title: row.title,
                artistName: row.artistName,
                albumName: row.albumName,
                albumId: row.album_id,
                artistId: artist.id
            }
        });
        await Chart.create({
            rank: row.rank,
            site,
            musicId: music.id
        })
        continue;

    }
}

export async function fullTextSearch(element : ChartData): Promise<ChartData> {
    try{
        const matchedList:Array<any> = await sequelize.query(`
            SELECT *, match(title, artistName) against( ? ) as score 
            FROM music 
            WHERE match(title, artistName) against( ? ) AND 
                id IN (
                    SELECT musicId
                    FROM charts
                    WHERE site = 'genie'
                )
            ORDER BY score desc
            LIMIT 5;`
        , {
            replacements : [ `${element.title} ${element.artistName}`, `${element.title} ${element.artistName}` ],
            type : sequelize.QueryTypes.SELECT
        });

        if(matchedList.length > 0 ){
            if(matchedList[0].score! > MIN_MATCH_SCORE){
                console.log(`✔ '${element.title} - ${element.artistName}' matched '${matchedList[0].title} - ${matchedList[0].artistName}' `);
                return {
                    ...element,
                    id: matchedList[0].id,
                    title : matchedList[0].title,
                    artistName : matchedList[0].artistName,
                    albumName : matchedList[0].albumName,
                    album_id: matchedList[0].albumId,
                    matched: true
                }
            }else{
                if((element.title.includes(matchedList[0].title) && element.artistName.includes(matchedList[0].artistName))
                ||
                matchedList[0].title.includes(element.title) && matchedList[0].artistName.includes(element.artistName)
                ){
                    console.warn(`💫 '${element.title} - ${element.artistName}' can not matched max score => ${matchedList[0].title} - ${matchedList[0].artistName} : ${matchedList[0].score} `)
                    return {
                        ...element,
                        id: matchedList[0].id,
                        title : matchedList[0].title,
                        artistName : matchedList[0].artistName,
                        albumName : matchedList[0].albumName,
                        album_id: matchedList[0].albumId,
                        matched: true
                    }
                }
                console.error(`❌ '${element.title} - ${element.artistName}' not found `)
                return {
                    ...element,
                };
            }
        }else{
            console.error(`❌ '${element.title} - ${element.artistName}' not found `)
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

export async function uploadS3({ targetPath, outputPath }: { targetPath : string, outputPath: string }){
    const fileContent = fs.readFileSync(targetPath);
    const params = {
        Bucket : 'cherrychart.resources',
        Key : outputPath,
        Body : fileContent
    }
    return new Promise((res, rej) => {
        s3.upload(params, (err, data) => {
            if(err) rej(err);
            res(data);
        })    
    })
}

export async function getObjectS3({ Key }: { Key : string}) {
    return new Promise((res) => {
        s3.getObject({
            Bucket: BUCKET_NAME,
            Key,
        }, (err, data) => {
            if(err) res(null);
            res(data);
        })
    })
}

export async function coverDownload({ url, site, music } : { url : string, site : siteName, music : ChartData }) {
    const targetPath = path.join(__dirname, `../../covers/${music.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`);
    const coverDir = path.join(__dirname, `../../covers`);
    const exist = fs.existsSync(coverDir);

    if(!exist){
        fs.mkdirSync(coverDir);
    }
    if(!fs.existsSync(targetPath)){
        const s3Exist = await getObjectS3({ Key: `${music.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png` });
        if(!s3Exist) {
            await download({ targetPath, url });
            await uploadS3({ 
                targetPath, 
                outputPath: `${music.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`,
            });
            deleteFile({ targetPath });
        }
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