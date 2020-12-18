const { default : puppeteer } = require('puppeteer-extra');
const StealthPlugin  = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

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