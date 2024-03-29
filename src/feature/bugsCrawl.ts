import { waitor } from './crawlUtil';
import { Page } from 'puppeteer';

async function fetchBugsCharts({ page }: { page : Page }){

    const titles = await page.$$eval('p.title', titles => titles.map((el) => el.textContent)) as unknown as Array<string>;
    const artists = await page.$$eval('p.artist > a:nth-of-type(1)', artists => artists.map((el) => el.getAttribute('title'))) as unknown as Array<string>;
    const albumtitles = await page.$$eval('td[class="left"] > a', albumtitles => albumtitles.map((el) => el.textContent)) as unknown as Array<string>;
    const images = await page.$$eval('td a img', imageTags => imageTags.map((el) => el!.getAttribute('src')?.replace('/images/50', '/images/500')));
    // "https://image.bugsm.co.kr/album/images/50/40271/4027185.jpg?version=20210128063905.0"
    // "https://image.bugsm.co.kr/album/images/200/40271/4027185.jpg?version=20210128063905.0"
    const albumInfoNumbers = await page.$$eval('td > a.album', anchors => anchors.map((el) => el.getAttribute('href')?.split('?')[0]?.replace(/[^0-9]/g,''))) as unknown as Array<string>;;

    if(titles.length === artists.length && artists.length === albumtitles.length){
        const charts = Array(titles.length).fill('').map((v, i) => {
            return {
                rank : i + 1,
                title : titles[i].replace(/\n/g, ''),
                artistName : artists[i].replace(/\n/g, ''),
                albumName : albumtitles[i].replace(/\n/g, ''),
                image : images[i],
                album_id: albumInfoNumbers[i]
            }
        })

        return charts
    }else{
        throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`)
    }
}

async function fetchBugsAlbumNubers({ page }: { page : Page }){
    const albumInfoNumbers = await page.$$eval('td > a.album', anchors => anchors.map((el) => el.getAttribute('href')?.split('?')[0])) as unknown as Array<string>;;

    const infoNumbers = albumInfoNumbers.map((el) => {
        return el.replace(/[^0-9]/g,'');
    });
    return infoNumbers;
}

export async function fetchAlbumInfo({ page, albumId }: { page : Page, albumId: string }) {
    await page.goto(`https://music.bugs.co.kr/album/${albumId}`);
    
    const albumName = await page.$eval('.innerContainer > h1', el => el.textContent);
    const artistName = await page.$eval('.info td', el => el.textContent);
    const tracks = await page.$$eval('th > p.title', trackList => trackList.map((el) => el.textContent?.trim()));
    const releaseDate = await page.$eval('td > time', time => time.textContent);
    // YYYY.MM.DD

    const leadIndex = await page.$$eval('tr[albumid]', tracks => Array.from(tracks).findIndex((track) => track.querySelector('span.albumTitle')));

    return {
        albumName,
        artistName,
        tracks : tracks.map((trackName, index) => {
            return {
                track : trackName,
                lead: index === leadIndex
            }
        }),
        releaseDate
    }
}

export async function collectBugsCharts({ page }: { page : Page }){
    await page.goto(`https://music.bugs.co.kr/chart`, waitor);
    const untilHundred = await fetchBugsCharts({ page });
    // 1위부터 100위까지

    return untilHundred;
}

export async function collectBugsAlbums({ page }: { page : Page }){
    await page.goto(`https://music.bugs.co.kr/chart`, waitor);
    const ids = await fetchBugsAlbumNubers({ page });

    const totalIds = Array.from(new Set(ids));
    
    const albumInfos:Array<any> = [];
    for(const id of totalIds){
        const albumInfo = await fetchAlbumInfo({ page, albumId : id});
        albumInfos.push(albumInfo);
    }

    return albumInfos;
}