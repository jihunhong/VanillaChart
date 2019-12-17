const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const assert = require('assert');

const db = require('../DB.json');

const mongoose = require('mongoose');
mongoose.connect(
    db.uri, 
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10},
    () => console.log('connected')
)

const chartSchema = require('../models/Chart');


class Chart{
    constructor(name, url, parent, title, artist, img){
        this.name     = name;
        this.url      = url;
        this.parent   = parent;
        this.title    = title;
        this.artist   = artist;
        this.img      = img;
        this.standard   = 'genie';
        // 타이틀, 아티스트 데이터를 통합할 기준이 되는 컬렉션 이름 
        // default는 genie 차트에 존자하는 음원의 제목과 아티스트 이름으로 통합한다.
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
                    img: $(img).find('img')[i].attribs.src,
                    video_id: 'none'
                }
                      );
        }

        const chart = array.filter((v) => v.title !== '')

        for( let data of chart ){
            // 음원 데이터의 제목과 아티스트 이름을 모두 같게 하는 코드
            
            if(this.standard === this.name) { break }

            try{
                const query = `${data.title} ${data.artist}`;

                const standard = mongoose.model('Chart', chartSchema, this.standard);

                const result = await standard.aggregate([
                                        {
                                            $match: {
                                                $text : {
                                                    $search: query
                                                }
                                            }
                                        },
                                        {
                                            $project: {
                                                title : 1,
                                                artist: 1,
                                                score:{
                                                    $meta : "textScore"
                                                }
                                            }
                                        },
                                        {
                                            $match: {
                                                score : {$gt : 1.0}
                                            }
                                        }
                ])
                
                const matchedData = result.shift();

                if( matchedData === undefined ) { continue }
                else if ( data.title === matchedData.title && data.artist === matchedData.artist ) { continue }

                console.log(`[${data.title}] => [${matchedData.title}] 변경되었습니다.`)
                console.log(`[${data.artist}] => [${matchedData.artist}] 변경되었습니다.
                `);

                data.title = matchedData.title;
                data.aritst = matchedData.artist;

            }catch(e){
                console.log(data.title);
                console.log(e);
            }
        }
        
        chart.forEach((v, i) => v.rank = i+1);

        try{
            const collection = mongoose.model('Chart', chartSchema, this.name);
            await collection.deleteMany();
            await collection.insertMany(chart);

            console.log(`[${this.name} 저장 완료]`)
        }catch(err){
            console.log(err);
        }
    }

    async saveOldChart(){
          try{
              const existCollection = mongoose.model('Chart', chartSchema, this.name);
              const oldCollection = mongoose.model('Chart', chartSchema, 'old_'+this.name);

              const existChart = await existCollection.find();
              await oldCollection.deleteMany();
              await oldCollection.insertMany(existChart);

              console.log(`[${this.name} 백업 완료]`)

          }catch(err){
              console.log(err);
          }
    }


}

module.exports = Chart