import { S3 } from 'aws-sdk';
import { delay } from "../lib";
import { Album, Sequelize } from "../models";
import { getObjectS3, launchBrowser, uploadS3 } from "./crawlUtil";
import trimBackground from "./trim-background";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path : path.join(__dirname, '../../.env') });
const s3 = new S3({ accessKeyId: process.env.AWS_ACCES_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
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
            const outputPath = `artist-profile/${album?.artistName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.jpg`
            const exist = await getObjectS3({ Key: outputPath });
            if(exist) continue;
            await page.goto(`${ARTIST_SEARCH_URL}${encodeURIComponent(album.artistName)}`);
            const src = await page.evaluate(() => {
                const element = document.querySelector('span.cover-img img')
                if (element) {
                    return 'https:' + element?.getAttribute('src');
                }
                return null;
            })
            if(!src) {
                console.error(`검색어 : ${album?.artistName} 결과가 없습니다`);
                continue;
            }
            const artistImagePath = await trimBackground({ url: src, artistName: album?.artistName })
            if(artistImagePath)
                await uploadS3({ targetPath: artistImagePath, outputPath });
            console.log(`${album?.artistName} 아티스트 이미지 저장 성공 ✔️`);
        }

    }catch(err) {
        console.error(err);
    }finally{
        page.close();
        browser.close();
    }

})();