const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const assert = require('assert');

const mongoose = require('mongoose');
require('dotenv/config');

const chartSchema = require('../models/Chart');

mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10},
    () => console.log('connected')
)

class Chart{
    constructor(name, url, parent, title, artist, img){
        this.name     = name;
        this.url      = url;
        this.parent   = parent;
        this.title    = title;
        this.artist   = artist;
        this.img      = img;
    }

    Builder(obj){
        this.setName(obj.name)
        this.setUrl(obj.url)   
        this.setParent(obj.parent)
        this.setTitle(obj.title)
        this.setArtist(obj.artist)
        this.setImg(obj.img)
    }

    setName(name){
        this.name = name;
    }

    setUrl(url){
        this.url = url;
    }

    setParent(parent){
        this.parent = parent;
    }

    setTitle(title){
        this.title = title;
    }

    setArtist(artist){
        this.artist = artist;
    }

    setImg(img){
        this.img = img;
    }

    async getData(){
        const getHTML = async () =>{
            try {
                return await axios.get(this.url);
            } catch (e) {
                console.error(e);
            }
        }
        const html = await getHTML();
        
        let array = [];
        const $ = cheerio.load(html.data);
        const parent = $(this.parent);

        const title = this.title;
        const artist = this.artist;
        const img = this.img;

        for(let i=0; i < 50; i++){
            array.push(
                {
                    title: $(parent[i]).find(title).text().trim(),
                    artist: $(parent[i]).find(artist).text().trim(),
                    img: $(img).find('img')[i].attribs.src
                }
                      );
        }

        const chart = array.filter((v) => v.title !== '')
        
        chart.forEach((v, i) => v.rank = i+1);

        try{
            const collection = mongoose.model('Chart', chartSchema, this.name);
            await collection.remove();
            await collection.insertMany(chart);

            console.log('get')

            mongoose.disconnect();
        }catch(err){
            console.log(err);
        }
    }

    async saveOldChart(){
          try{
              const existCollection = mongoose.model('Chart', chartSchema, this.name);
              const oldCollection = mongoose.model('Chart', chartSchema, 'old_'+this.name);

              const existChart = await existCollection.find();
              await oldCollection.remove();
              await oldCollection.insertMany(existChart);

              console.log('save')

              mongoose.disconnect();
          }catch(err){
              console.log(err);
          }
    }


}

module.exports = Chart