import { waitor, launchBrowser } from './crawlUtil';
import { Page } from 'puppeteer';

async function fetchMelonCharts({ page }: { page : Page }){

    const titles = await page.$$eval('.rank01', titles => titles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const artists = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.rank02')).map((v) => {
            const artistBlock = Array.from(v.querySelectorAll('span a'));
            return artistBlock.map((anchor) => anchor.textContent).join();
        });
    }) as unknown as Array<string>;
    const albumtitles = await page.$$eval('.rank03', albumtitles => albumtitles.map((el) => el.textContent!.trim())) as unknown as Array<string>;
    const images = await page.$$eval('.image_typeAll > img', imageTags => imageTags.map((el) => el!.getAttribute('src')?.replace('120/quality/80/optimize', '500/sharpen/0x1')));
    // https://cdnimg.melon.co.kr/cm2/album/images/105/54/246/10554246_20210127150136_500.jpg/melon/resize/120/quality/80/optimize
    // https://cdnimg.melon.co.kr/cm2/album/images/105/54/246/10554246_20210127150136_500.jpg/melon/resize/282/sharpen/0x1
    const albumInfoNumbers = await page.$$eval('.wrap > a[href*="AlbumDetail"]', anchors => anchors.map((el) => el.getAttribute('href')?.replace(/[^0-9]/g,''))) as unknown as Array<string>;

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

async function fetchMelonAlbumNumbers({ page }: { page : Page }){
    const albumInfoNumbers = await page.$$eval('.wrap > a[href*="AlbumDetail"]', anchors => anchors.map((el) => el.getAttribute('href'))) as unknown as Array<string>;
    
    const infoNumbers = albumInfoNumbers.map((el) => {
        return el.replace(/[^0-9]/g,'');
    })
    return infoNumbers;
}

async function fetchAlbumInfo({ page, albumId }: { page: Page, albumId: string }){
    await page.goto(`https://www.melon.com/album/detail.htm?albumId=${albumId}`, waitor);
    
    const albumName = await page.$eval('div.song_name', el => el.textContent?.trim().replace('앨범명\n\t\t\t\t\t\t\t\t\t\t', ''));
    const artist = await page.$eval('div.artist', el => el.textContent?.trim());
    const tracks = await page.$$eval('a[href*="playSong"]', trackList => trackList.map((el) => el.textContent));
    const releaseDate = await page.$eval('dl.list > dd', time => time.textContent);
    // YYYY.MM.DD

    const leadIndex = await page.$$eval('div.wrap_song_info', tracks => Array.from(tracks).findIndex((track) => track.querySelector('span.bullet_icons')));

    return {
        albumName,
        artist,
        tracks : tracks.map((trackName, index) => {
            return {
                track : trackName,
                lead: index === leadIndex
            }
        }),
        releaseDate
    }

}

export async function collectMelonCharts({ page }: { page : Page }){
    await page.goto(`https://www.melon.com/chart/`, waitor);
    const untilHundred = await fetchMelonCharts({ page });
    // 1위부터 100위까지

    return untilHundred;
};

export async function collectMelonAlbums({ page }: { page: Page }){
    await page.goto(`https://www.melon.com/chart/`, waitor);
    const ids = await fetchMelonAlbumNumbers({ page });

    const totalIds = Array.from(new Set(ids));
    // 1위부터 100위까지
    
    const albumInfos:Array<any> = [];
    for(const id of totalIds){
        const albumInfo = await fetchAlbumInfo({ page, albumId: id });
        albumInfos.push(albumInfo);
    }

    return albumInfos;
}