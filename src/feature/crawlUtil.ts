import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
import { LoadEvent } from 'puppeteer';
import db, { Chart, sequelize } from '../models';
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
        await imageDownload({ url : row.image!, music : row, site });
    }
}

export async function fullTextSearch(element : ChartData): Promise<ChartData> {
    try{
        const matchedList:Array<ChartData> = await sequelize.query(`
            SELECT *, match(title) against( ? ) as score 
            FROM Charts WHERE match(title) against( ? ) AND site = 'genie' 
            ORDER BY score desc
            LIMIT 5;`
        , {
            replacements : [ element.title, element.title ],
            type : sequelize.QueryTypes.SELECT
        });

        if(matchedList.length > 0 ){
            if(matchedList[0].score! > 7){
                console.log(`✔'${element.title} - ${element.title}' matched '${matchedList[0].title} - ${matchedList[0].artist}' `)
                return {
                    ...element,
                    title : matchedList[0].title,
                    artist : matchedList[0].artist,
                    album : matchedList[0].album,
                }
            }else{
                console.log(`💫'${element.title} - ${element.title}' not found `)
                return element;
            }
        }else{
            console.log(`💫'${element.title} - ${element.title}' not found `)
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

export async function convertChartFormat({ chart } : { chart : Array<ChartData> }){
    return await Promise.all(chart.map(fullTextSearch));
}