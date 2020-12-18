const { waitor } = require('./crawlOption');

async function fetchMelon({ page }){

    const titles = await page.$$eval('.rank01', titles => titles.map((el) => el.textContent.trim()));
    const artists = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.rank02')).map((v) => {
            const artistBlock = Array.from(v.querySelectorAll('span a'));
            return artistBlock.map((anchor) => anchor.textContent).join();
        });
    });
    const albumtitles = await page.$$eval('.rank03', albumtitles => albumtitles.map((el) => el.textContent.trim()));

    if(titles.length === artists.length && artists.length === albumtitles.length){
        const charts = Array(titles.length).fill().map((v, i) => {
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

async function collectMelon({ page }){
    await page.goto(`https://www.melon.com/chart/`, waitor);
    const untilHundred = await fetchMelon({ page });
    // 1위부터 100위까지

    return untilHundred;
}

module.exports = { collectMelon };