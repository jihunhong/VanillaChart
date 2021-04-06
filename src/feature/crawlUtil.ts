import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
import { LoadEvent } from 'puppeteer';
import db, { Chart, sequelize, Music } from '../models';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

db.sequelize.sync()
    .then(() => {
        console.log('sequelize connected');
    })
    .catch((err: Error) => {
        console.error(err);
});

const MIN_MATCH_SCORE = 3;

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

export async function insertChart({ site, chart } : { site : siteName, chart : Array<ChartData> }) {
    for(const row of chart){
        const [res] = await Music.findOrCreate({
            where : {
                title : row.title,
                artist : row.artist,
                album : row.album,
            },
            raw : true
        });
        await Chart.create({
            rank : row.rank,
            site,
            MusicId : res.id
        })
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
                    title : matchedList[0].title,
                    artist : matchedList[0].artist,
                    album : matchedList[0].album,
                    matched: true
                }
            }else{
                console.warn(`💫 '${element.title} - ${element.artist}' can not matched max score => ${matchedList[0].title} - ${matchedList[0].artist} `)
                return {
                    ...element,
                    ...matchedList[0]
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

export async function imageDownload({ url, site, music } : { url : string, site : siteName, music : ChartData }) {
    const targetPath = path.join(__dirname, `../../../covers/${music.album.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`);
    if(!fs.existsSync(targetPath)){
        await download({ targetPath, url });
    }
}

export async function ftsMatchingJob({ chart } : { chart : Array<ChartData> }){
    return await Promise.all(chart.map(fullTextSearch));
}