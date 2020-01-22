const puppeteer = require('puppeteer');

const mongoose = require('mongoose');

class Playlist{
    constructor(url, id){
        this.id = id;
        this.url = url;
    }

    Builder(obj){
        this.setId(obj.id);
        this.setUrl(obj.url);
    }

    setId(id){
        this.id = id;
    }

    setUrl(url){
        this.url = url;
    }

    async getList(){
        const browser = await puppeteer.launch({headless : true});

        const page = await browser.newPage();

        await page.goto(this.url);
        // 사용자 플레이리스트 url


        const titles = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('td.t_left > div.wrap > .ellipsis > a.fc_gray'));
            return array.map(title => title.textContent);
        })

        const artists = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('td.t_left > div.wrap > #artistName > a.fc_mgray'));
            return array.map(artist => artist.textContent);
        })
        
        await browser.close();

        const chart = titles.map((v, i) => { return {title : v, artist: artists[i]} });

        return chart;
    }
}

module.exports = Playlist;