import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
import { DirectNavigationOptions, LoadEvent } from 'puppeteer';
import prisma from '../config/db';
import {Certificate} from 'crypto';
puppeteer.use(StealthPlugin());


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
        await prisma.charts.create({
            data : {
                rank : row.rank,
                title : row.title,
                artist : row.artist,
                album : row.album,
                site,
                // ...row
            }
        })
    }
}

export async function fullTextSearch(element : ChartData): Promise<ChartData> {
    try{
        const matchedList:Array<ChartData> = await prisma.$queryRaw`SELECT *, match(title) against(${element.title}) as score FROM Charts WHERE match(title) against(${element.title}) AND site = 'genie' limit 5;`;
        if(matchedList.length > 0){
            console.log(`✔'${element.title} - ${element.title}' matched '${matchedList[0].title} - ${matchedList[0].artist}' `)
            return {
                ...element,
                title : matchedList[0].title,
                artist : matchedList[0].artist,
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

export async function convertChartFormat({ chart } : { chart : Array<ChartData> }){
    return await Promise.all(chart.map(fullTextSearch));
}