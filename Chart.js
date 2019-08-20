const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


class Chart{
    constructor(name, url, list, title, artist){
        this.name   = name;
        this.url    = url;
        this.list   = list;
        this.title  = title;
        this.artist = artist;
    }

    getData(){
        const getHTML = async () =>{
            try {
                return await axios.get(this.url);
            } catch (e) {
                console.error(e);
            }
        }

        getHTML().then(html => {
            let array = [];
            const $ = cheerio.load(html.data);
            const $musicList = $(this.list);
            const title = this.title;
            const artist = this.artist;

            $musicList.each(function (i, el) {
                array[i] = {
                    title: $(this).find(title).text().trim(),
                    artist: $(this).find(artist).text().trim()
                };
            });
        
            const chart = array.filter(function (v) {
                return v.title !== ''; 
            })
            
            chart.forEach(function(el, i){
                el.rank = i+1;
            })

            return chart;
        })
        .then(res => fs.writeFileSync( path.join('./chart/'+ this.name + '.json')  , JSON.stringify(res, null, 2)));

    }
}

module.exports = Chart