const fs = require('fs');
const path = require('path');
const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKeys = require('../apiKeys.json');

const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs  = require('../chart/bugs.json');

const og = require('../chart/old_genie.json');
const om = require('../chart/old_melon.json');
const ob = require('../chart/old_bugs.json');

const youtubeAPI = require('../logs/youtubeAPI.json');

const limit = 5;

const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');
 
// Connection URL
const uri = require('../DBInfo.json').uri;

const Query = require('../Object/Query.js');

const query = new Query();

const client = new MongoClient(uri, { useNewUrlParser: true, 
                                     useUnifiedTopology: true });

function searching(music, name) {
    
    const currentKey = apiKeys.find((v) => name === v.name);

    youtube.setKey(currentKey.key);

    youtube.addParam('regionCode', 'kr');

    return new Promise(function(res, rej){
        const q = `${music.artist} - ${music.title}`;

        youtube.search(q, limit, function (err, result) {
            
            currentKey.quota++;

            if(err) { console.log(err);}
            

            const json = {'query': q,
                          'title': music.title,
                          'artist': music.artist,
                          'date': new Date()
                         };

            
                
            youtubeAPI.push(json);

            fs.writeFileSync( path.join('../logs/youtubeAPI.json')  , JSON.stringify(youtubeAPI, null, 2));
            fs.writeFileSync( path.join('../apiKeys.json')  , JSON.stringify(apiKeys, null, 2));
            // youtubeAPI를 통해 검색되는 쿼리와 할당량을 확인하기 위한 코드

            
            let responseItems = [];

            try{
                responseItems = result.items.slice(0);

                const officialItem = responseItems.find((v) => 
                    ['MV', 'M/V', 'Official'].includes(v.snippet.title) );
                    // 검색된 결과들중 우선순위를 따져 반환하기 위한 코드


                officialItem === undefined ? res(responseItems[0].id.videoId) : res(officialItem.id.videoId);

            }catch(e){
                res('cdwal5Kw3Fc');
                // shortest video ever
            }
        })
    }) 
};


const insertVideoId = async () => {
    const iterateSearch = async (chart, old, name) => {
        
        let skip = 0

        for(let i=0; i<chart.length; i++){
            const music = chart[i];

            if(old.find((v) => music.title === v.title && v.video_id) !== undefined){
                console.log(`* ${music.title} 스킵`)
                skip++;
                music.video_id = old.find((v) => music.title === v.title).video_id
            }else{
                await searching(music, name).then(function(video_id){
                    music.video_id = video_id;
                    chart[i] = music;
                    console.log(`+ ${music.rank} : ${music.title} 검색`);
                });    
            }
            fs.writeFileSync( path.join('../chart/'+ name + '.json')  , JSON.stringify(chart, null, 2));
        }
        console.log(`\n\n-------------${skip}/50 ${name} 완료----------`);
    }

    await iterateSearch(melon, om ,'melon');
    await iterateSearch(genie, og ,'genie');
    await iterateSearch(bugs,  ob ,'bugs');

    return [melon, genie, bugs];
}

insertVideoId().then( chart => {
    const melon = chart.shift();
    const genie = chart.shift();
    const bugs  = chart.shift();

    client.connect(err => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
       
        const db = client.db("VanillaChart");
        
        query.insertDocuments(db, function() {}, genie, 'genie');
    
        query.insertDocuments(db, function() {}, melon, 'melon');
    
        query.insertDocuments(db, function() {
            client.close();
        }, bugs, 'bugs');
       
      });
      
    

} )


