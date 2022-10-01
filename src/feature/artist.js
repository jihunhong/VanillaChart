const { fn, col, Op } = require("sequelize");
const { Music, Artist, Album, Chart } = require("../models");
const { getObjectS3, launchBrowser, uploadS3 } = require("./crawlUtil");
const { default: trimBackground } = require("./trim-background");
const ARTIST_SEARCH_URL = 'https://www.genie.co.kr/search/searchMain?query=';

(async() => {
    const { browser, page } = await launchBrowser();
    const artistNames = await Album.findAll({
        where: {
            artistId : {
                [Op.eq]: null
            }
        },
        attributes: [
            'id',
            'artistName',
            'site'
        ]
    })
    for(const el of artistNames) {
        const [artist] = await Artist.findOrCreate({
            where: {
                artistName: el.artistName,
                site: el.site
            }
        })
        console.log(`${artist.artistName}, ${artist.site} created!`);
        await Album.update({
            artistId: artist.id
        }, {
            where: {
                id: el.id
            }
        })
        await Music.update({
            artistId: artist.id
        }, {
            where: {
                albumId: el.id
            }
        })
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
    process.exit(1);
})();