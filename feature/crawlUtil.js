const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { Chart } = require('../models');
const db = require('../models');

db.sequelize.sync()
    .then(() => {
        console.log('sequelize connected');
    })
    .catch((err) => {
        console.error(err);
    });

exports.waitor = {
    waitUntil : "networkidle2"
}

exports.launchBrowser = async() => {
    const browser = await puppeteer.launch({
        headless : process.env.NODE_ENV === 'production'
    });
    const page = await browser.newPage();
    return [browser, page];
}

exports.insertChart = async({ site, chart }) => {
    await Promise.all(chart.map(async(row) => {
        try{
            await Chart.create({
                rank : row.rank,
                title : row.title,
                artist : row.artist,
                album : row.album,
                site,
                // ...row
            })
        }catch(err){
            console.error(err);
        }
    }))
}