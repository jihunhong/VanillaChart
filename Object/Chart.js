const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');
 
// Connection URL
const uri = "mongodb+srv://chart:<password>@cluster0-v0qur.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, 
                                     useUnifiedTopology: true });


class Chart{
    constructor(name, url, parent, title, artist, img){
        this.name     = name;
        this.url      = url;
        this.parent   = parent;
        this.title    = title;
        this.artist   = artist;
        this.img      = img;
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

    getData(){
        const old = require(path.join('../chart/'+this.name + '.json' ));
        fs.writeFileSync(path.join('../chart/old_'+this.name + '.json'), JSON.stringify(old, null, 2));

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
            const parent = $(this.parent);

            const title = this.title;
            const artist = this.artist;
            const img = this.img;

            for(let i=0; i < 50; i++){
                array[i] = {
                    title: $(parent[i]).find(title).text().trim(),
                    artist: $(parent[i]).find(artist).text().trim(),
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
        .then(res => 
            fs.writeFileSync( path.join('../chart/'+ this.name + '.json')
                , JSON.stringify(res, null, 2)));

    }

    saveOldChart(){
        client.connect(err => {
            assert.equal(null, err);
            console.log("Connected successfully to server for save old chart data");
           
            const db = client.db("VanillaChart");
            
            findCollection(db, this.name)
                .then(collection => {
                    insertDocuments(db, () => {client.close();} , collection, this.name)
                })
        
            
           
          });
          
        const findCollection = async(db, chartName) => {
        
            const collection = db.collection(chartName);

            return await collection.find().sort({rank : 1}).toArray();
        }
       
        const insertDocuments = function(db, callback, chart, chartName) {
    
            const collection = db.collection(new Date().toUTCString());
        
            collection.insert( 
                chart , (err, result) =>{
              assert.equal(err, null);

              console.log(`Inserted ${result.ops.length} documents into the ${chartName} collection`);
              callback(result);
            });
        }
    }


}

module.exports = Chart