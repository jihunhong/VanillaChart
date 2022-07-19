import { delay } from "../lib";
import { Album, Sequelize } from "../models";
import { launchBrowser, uploadS3 } from "./crawlUtil";
import trimBackground from "./trim-background";

// 지니 아티스트 검색
const ARTIST_SEARCH_URL = 'https://www.genie.co.kr/search/searchMain?query=';

(async() => { 

    const { browser, page } = await launchBrowser();
 
    try {
        const albums = await Album.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('artistName')), 'artistName']
            ],
            raw: true
        });
        
        for(const album of albums) {
            await page.goto(`${ARTIST_SEARCH_URL}${encodeURI(album.artistName)}`);
            await delay(7000);
            const origin = await page.$eval('span.cover-img img', img => img.getAttribute('src'));
            const src = 'https:' + origin;
            const artistImagePath = await trimBackground({ url: src, artistName: album?.artistName })
            if(artistImagePath) 
                await uploadS3({ targetPath: artistImagePath, outputPath: `artist-profile/${album?.artistName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.jpg` })
            console.log(`${album?.artistName} 아티스트 이미지 저장 성공 ✔️`);
        }

    }catch(err) {
        console.error(err);
    }finally{
        page.close();
        browser.close();
    }

})();