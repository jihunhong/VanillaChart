const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');
 
// Connection URL
const uri = require('../DBInfo.json').uri;

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
        .then(res => {
            client.connect(err => {
                assert.equal(null, err);
                console.log("Connected successfully to server for save new chart data");
               
                const db = client.db("VanillaChart");
                
                insertDocuments(db, function() {client.close();} , res, this.name)
                
               
              });
            
           
            const insertDocuments = function(db, callback, chart, chartName) {
        
                const collection = db.collection(chartName);
                collection.remove({});

                collection.insert( 
                    chart , (err, result) =>{

                  callback();
                });
            }
        });

    }

    saveOldChart(){
        client.connect(err => {
            assert.equal(null, err);
            console.log("Connected successfully to server for save old chart data");
           
            const db = client.db("VanillaChart");
            
            findCollection(db, this.name)
                .then(collection => {
                    insertDocuments(db, function() {client.close();} , collection, this.name)
                })
        
            
           
          });
          
        const findCollection = async(db, chartName) => {
        
            const collection = db.collection(chartName);

            return await collection.find().sort({rank : 1}).toArray();
        }
       
        const insertDocuments = function(db, callback, chart, chartName) {
    
            const collection = db.collection('old_'+chartName);
        
            collection.insert( 
                chart , (err, result) =>{
              assert.equal(err, null);

              callback(result);
            });
        }
    }


}

module.exports = Chart