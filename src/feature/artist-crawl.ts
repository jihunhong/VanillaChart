import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { Album, Artist, Sequelize } from "../models";
import { getObjectS3, launchBrowser, uploadS3 } from "./crawlUtil";
import trimBackground from "./trim-background";

dotenv.config({ path : path.join(__dirname, '../../.env') });
const s3 = new S3({ accessKeyId: process.env.AWS_ACCES_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
// 지니 아티스트 검색
const ARTIST_SEARCH_URL = 'https://www.genie.co.kr/search/searchMain?query=';

(async() => { 

    const { browser, page } = await launchBrowser();
 
    try {
        const artists = await Artist.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('artistName')), 'artistName'],
                'id'
            ],
            raw: true
        });
        
        for(const artist of artists) {
            const outputPath = `artist-profile/${artist?.id}.jpg`
            const exist = await getObjectS3({ Key: outputPath });
            if(exist) continue;
            await page.goto(`${ARTIST_SEARCH_URL}${encodeURIComponent(artist.artistName)}`);
            const src = await page.evaluate(() => {
                const element = document.querySelector('span.cover-img img')
                if (element) {
                    return 'https:' + element?.getAttribute('src');
                }
                return null;
            })
            if(!src || src.includes('blank_')) {
                console.error(`검색어 : ${artist?.artistName} 결과가 없습니다`);
                continue;
            }
            const artistImagePath = await trimBackground({ url: src, artistName: artist?.artistName })
            if(artistImagePath)
                await uploadS3({ targetPath: artistImagePath, outputPath });
            console.log(`${artist?.artistName} 아티스트 이미지 저장 성공 ✔️`);
        }

    }catch(err) {
        console.error(err);
    }finally{
        page.close();
        browser.close();
    }

})();