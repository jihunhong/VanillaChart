import { waitor } from './crawlUtil';
import { Page } from 'puppeteer';

async function fetchBugs({ page }: { page : Page }){

    const titles = await page.$$eval('p.title', titles => titles.map((el) => el.textContent));
    const artists = await page.$$eval('p.artist', artists => artists.map((el) => el.textContent));
    const albumtitles = await page.$$eval('td[class="left"] > a', albumtitles => albumtitles.map((el) => el.textContent));

    if(titles.length === artists.length && artists.length === albumtitles.length){
        const charts = Array(titles.length).fill().map((v, i) => {
            return {
                rank : i + 1,
                title : titles[i].replace(/\n/g, ''),
                artist : artists[i].replace(/\n/g, ''),
                album : albumtitles[i].replace(/\n/g, '')
            }
        })

        return charts
    }else{
        throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`)
    }
}

export async function collectBugs({ page }: { page : Page }){
    await page.goto(`https://music.bugs.co.kr/chart`, waitor);
    const untilHundred = await fetchBugs({ page });
    // 1위부터 100위까지

    return untilHundred;
}
