import { waitor } from './crawlUtil';
import { Page } from 'puppeteer';

async function fetchMelon({ page }: { page : Page }){

    const titles = await page.$$eval('.rank01', titles => titles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const artists = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.rank02')).map((v) => {
            const artistBlock = Array.from(v.querySelectorAll('span a'));
            return artistBlock.map((anchor) => anchor.textContent).join();
        });
    }) as unknown as Array<string>;
    const albumtitles = await page.$$eval('.rank03', albumtitles => albumtitles.map((el) => el.textContent!.trim())) as unknown as Array<string>;

    if(titles.length === artists.length && artists.length === albumtitles.length){
        const charts = Array(titles.length).fill('').map((v, i) => {
            return {
                rank : i + 1,
                title : titles[i],
                artist : artists[i],
                album : albumtitles[i]
            }
        })

        return charts
    }else{
        throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`)
    }
}

export async function collectMelon({ page }: { page : Page }){
    await page.goto(`https://www.melon.com/chart/`, waitor);
    const untilHundred = await fetchMelon({ page });
    // 1위부터 100위까지

    return untilHundred;
}