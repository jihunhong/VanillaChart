import { waitor } from './crawlUtil';
import { Page } from 'puppeteer';

async function fetchGenieCharts({ page }: { page : Page }){
    const titles = await page.$$eval('.info .title', titles => titles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const artists = await page.$$eval('.info .artist', artists => artists.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const albumtitles = await page.$$eval('.info .albumtitle', albumtitles => albumtitles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const images = await page.$$eval('a.cover img', imageTags => imageTags.map((el) => el!.getAttribute('src')?.replace('//image.genie.co.kr/', 'https://image.genie.co.kr/').replace('140x140.JPG/dims/resize/Q_80,0', '600x600.JPG')));
    // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_140x140.JPG/dims/resize/Q_80,0
    // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_600x600.JPG
    const albumInfoNumbers = await page.$$eval('.albumtitle', anchors => anchors.map((el) => el.getAttribute('onclick')?.replace(/[^0-9]/g,''))) as unknown as Array<string>;

    if(titles.length === artists.length && artists.length === albumtitles.length){
        const charts = Array(titles.length).fill('').map((v, i) => {
            return {
                rank : i + 1,
                title : titles[i],
                artist : artists[i],
                album : albumtitles[i],
                image : images[i],
                album_id: albumInfoNumbers[i]
            }
        })

        return charts
    }else{
        throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`)
    }
}

async function fetchGenieAlbumNumbers({ page }: { page : Page }){
    const albumInfoNumbers = await page.$$eval('.albumtitle', anchors => anchors.map((el) => el.getAttribute('onclick'))) as unknown as Array<string>;
    
    const infoNumbers = albumInfoNumbers.map((el) => {
        return el.replace(/[^0-9]/g,'');
    })
    return infoNumbers;
}

export async function fetchAlbumInfo({ page, albumId }: { page : Page, albumId: string }){
    await page.goto(`https://www.genie.co.kr/detail/albumInfo?axnm=${albumId}`, waitor);
    
    const albumName = await page.$eval('h2.name', el => el.textContent);
    const artist = await page.$eval('a[onclick*="artistInfo"]', el => el.textContent);
    const tracks = await page.$$eval('td > a.title', trackList => trackList.map((el) => el.textContent?.trim()));
    const releaseDate = await page.$eval('li:last-child > span.value', time => time.textContent?.trim());
    // YYYY.MM.DD

    const leadIndex = await page.$$eval('td.info', tracks => Array.from(tracks).findIndex((track) => track.querySelector('span.icon-title')));

    return {
        albumName,
        artist,
        tracks : tracks.map((trackName, index) => {
            return {
                track : trackName?.replace('TITLE\n', ''),
                lead: index === leadIndex
            }
        }),
        releaseDate
    }
}

export async function collectGenieCharts({ page }: { page : Page }){

    await page.goto(`https://www.genie.co.kr/chart/top200`, waitor);
    const untilFifty = await fetchGenieCharts({ page });
    // 1위부터 50위까지

    await page.click(`.rank-page-nav a:not([class=current])`);
    // 다음 페이지 버튼 클릭
    await page.waitFor(3000);
    const temp = await fetchGenieCharts({ page });
    const untilHundred = temp.map((v) => {
        return {
            ...v,
            rank : 50 + v.rank
        }
    })
    // 51위부터 100위까지 페이지에서 같은 함수 실행
    return [...untilFifty, ...untilHundred];
}

export async function collectGenieAlbums({ page }: { page : Page }){
    await page.goto(`https://www.genie.co.kr/chart/top200`, waitor);
    const firstToFifty = await fetchGenieAlbumNumbers({ page });
    // 1위부터 50위까지

    await page.click(`.rank-page-nav a:not([class=current])`);
    // 다음 페이지 버튼 클릭
    await page.waitFor(3000);
    const fiftyToHundered = await fetchGenieAlbumNumbers({ page });
    const totalIds = Array.from(new Set(firstToFifty.concat(fiftyToHundered)));
    // 51위부터 100위까지 페이지에서 같은 함수 실행

    const albumInfos:Array<any> = [];
    for(const id of totalIds){
        const albumInfo = await fetchAlbumInfo({ page, albumId: id});
        albumInfos.push(albumInfo);
    }

    return albumInfos;
}

