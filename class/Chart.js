const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

const db = require('../keys.js').db;

const mongoose = require('mongoose');
mongoose.connect(
    db.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    },
    () => console.log('connected')
)

const Log = require('../models/Log');
const chartSchema = require('../models/Chart');


class Chart {
    constructor(name, url, parent, title, artist, img) {
        this.name = name;
        this.url = url;
        this.parent = parent;
        this.title = title;
        this.artist = artist;
        this.img = img;
        this.standard = 'genie';
        // 타이틀, 아티스트 데이터를 통합할 기준이 되는 컬렉션 이름 
        // default는 genie 차트에 존자하는 음원의 제목과 아티스트 이름으로 통합한다.
    }

    Builder(obj) {
        this.setName(obj.name)
        this.setUrl(obj.url)
        this.setParent(obj.parent)
        this.setTitle(obj.title)
        this.setArtist(obj.artist)
        this.setImg(obj.img)
    }

    setName(name) {
        this.name = name;
    }

    setUrl(url) {
        this.url = url;
    }

    setParent(parent) {
        this.parent = parent;
    }

    setTitle(title) {
        this.title = title;
    }

    setArtist(artist) {
        this.artist = artist;
    }

    setImg(img) {
        this.img = img;
    }


    async getData(){

        const args = process.env.NODE_ENV === 'production' ? {args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-server=socks5://127.0.0.1:9050'], headless : true} 
                                                           : { ignoreDefaultArgs: ['--disable-extensions'], headless : true };
        
        const browser = await puppeteer.launch(args);

        const page = await browser.newPage();

        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');

        await page.goto(this.url);
        
        const _this = this;

        const chart = await page.evaluate(({_this}) => {
            const titles = Array.from(document.querySelectorAll(_this.parent), el => el.querySelector(_this.title).textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim());
            const artists = Array.from(document.querySelectorAll(_this.parent), el => el.querySelector(_this.artist).textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim());
            const img = Array.from(document.querySelectorAll(_this.parent), el => el.querySelector(_this.img).src);
            
            return titles.map(function(v, i){
                return {
                            title  : v, 
                            artist : artists[i],
                            img    : img[i]
                        };
            });
        }, {_this});

        await browser.close();

        await this.integrateByFTS(chart);

        chart.forEach((v, i) => v.rank = i + 1);

        try {
            const collection = mongoose.model('Chart', chartSchema, this.name);
            await collection.deleteMany();
            await collection.insertMany(chart);

            await new Log({
                result: true,
                message: `[${this.name} 저장 완료]`
            }).save();

        } catch (err) {

            await new Log({
                result: false,
                message: `${err}`,
            }).save();
        }
    }

    async saveOldChart() {
        try {
            const existCollection = mongoose.model('Chart', chartSchema, this.name);
            const oldCollection = mongoose.model('Chart', chartSchema, 'old_' + this.name);

            const existChart = await existCollection.find();
            await oldCollection.deleteMany();
            await oldCollection.insertMany(existChart);

            await new Log({
                result: true,
                message: `[${this.name} 백업 완료]`
            }).save();

        } catch (err) {
            await new Log({
                result: false,
                message: `${err}`,
            }).save();
        }
    }

    async integrateByFTS(chart){
        for (let [i, v] of chart.entries()) {
            // 음원 데이터의 제목과 아티스트 이름을 모두 같게 하는 코드

            if (this.standard === this.name) {
                break
            }

            try {
                const query = `${v.title}`;

                const standard = mongoose.model('Chart', chartSchema, this.standard);

                const result = await standard.aggregate([{
                        $match: {
                            $text: {
                                $search: query
                            }
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            artist: 1,
                            score: {
                                $meta: "textScore"
                            }
                        }
                    },
                    {
                        $match: {
                            score: {
                                $gt: 1.0
                            }
                        }
                    },
                    {
                        $sort: {
                            score: -1
                        }
                    }
                ])

                const matchedData = result.shift();

                if (matchedData === undefined) {
                    continue
                } else if (v.title === matchedData.title && v.artist === matchedData.artist) {
                    continue
                }

                console.log(`[${v.title}] => [${matchedData.title}] 변경되었습니다.`)
                console.log(`[${v.artist}] => [${matchedData.artist}] 변경되었습니다.
                `);

                chart[i].title = matchedData.title;
                chart[i].artist = matchedData.artist;



            } catch (e) {
                console.log(v.title);
                console.log(e);
            }
        }
    }


}

module.exports = Chart