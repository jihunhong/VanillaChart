import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteName, ChartData} from '../../@types';
import { DirectNavigationOptions, LoadEvent } from 'puppeteer';
puppeteer.use(StealthPlugin());


export const waitor = {
    waitUntil : <LoadEvent> "networkidle2"
}

export async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless : process.env.NODE_ENV === 'production'
    });
    const page = await browser.newPage();
    return [browser, page];
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
    }
}