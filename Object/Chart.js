const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


class Chart{
    constructor(name, url, title, artist, img){
        this.name     = name;
        this.url      = url;
        this.title    = title;
        this.artist   = artist;
        this.img      = img;
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

            const title = this.title;
            const artist = this.artist;
            const img = this.img;

            for(let i=0; i < 50; i++){
                array[i] = {
                    title: $(title)[i].firstChild.data,
                    artist: $(artist)[i].firstChild.data,
                    img: $(img).find('img')[i].attribs.src
                };
            }
        
            const chart = array.filter(function (v) {
                return v.title !== ''; 
            })
            
            chart.forEach(function(el, i){
                el.rank = i+1;
            })

            return chart;
        })
        .then(res => fs.writeFileSync( path.join('../chart/'+ this.name + '.json')  , JSON.stringify(res, null, 2)));

    }



}

module.exports = Chart