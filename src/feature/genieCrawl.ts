import { waitor } from './crawlUtil';
import { Page } from 'puppeteer';

async function fetchGenie({ page }: { page : Page }){
    const titles = await page.$$eval('.info .title', titles => titles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const artists = await page.$$eval('.info .artist', artists => artists.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const albumtitles = await page.$$eval('.info .albumtitle', albumtitles => albumtitles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const images = await page.$$eval('a.cover img', imageTags => imageTags.map((el) => el!.getAttribute('src')?.replace('//image.genie.co.kr/', 'https://image.genie.co.kr/').replace('140x140.JPG/dims/resize/Q_80,0', '600x600.JPG')));
    // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_140x140.JPG/dims/resize/Q_80,0
    // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_600x600.JPG


    if(titles.length === artists.length && artists.length === albumtitles.length){
        const charts = Array(titles.length).fill('').map((v, i) => {
            return {
                rank : i + 1,
                title : titles[i],
                artist : artists[i],
                album : albumtitles[i],
                image : images[i],
            }
        })

        return charts
    }else{
        throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`)
    }
}

export async function collectGenie({ page }: { page : Page }){
    await page.goto(`https://www.genie.co.kr/chart/top200`, waitor);
    const untilFifty = await fetchGenie({ page });
    // 1위부터 50위까지

    await page.click(`.rank-page-nav a:not([class=current])`);
    // 다음 페이지 버튼 클릭
    await page.waitFor(3000);
    const temp = await fetchGenie({ page });
    const untilHundred = temp.map((v) => {
        return {
            ...v,
            rank : 50 + v.rank
        }
    })
    // 51위부터 100위까지 페이지에서 같은 함수 실행
    return [...untilFifty, ...untilHundred];
}
