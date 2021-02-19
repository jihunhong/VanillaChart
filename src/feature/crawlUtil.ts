import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
import { LoadEvent } from 'puppeteer';
import db, { Chart, sequelize } from '../models';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { response } from 'express';

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
        await Chart.create({
            rank : row.rank,
            title : row.title,
            artist : row.artist,
            album : row.album,
            site,
                // ...row
        })
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

export async function imageDownload({ url, site, music } : { url : string, site : siteName, music : ChartData }) {
    const file = fs.createWriteStream(path.join(__dirname, `../../../covers/${site}/${music.album.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`));
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => file.close());
    });
}

export async function convertChartFormat({ chart } : { chart : Array<ChartData> }){
    return await Promise.all(chart.map(fullTextSearch));
}