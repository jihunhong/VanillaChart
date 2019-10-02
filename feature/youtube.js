const fs = require('fs');
const path = require('path');
const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKeys = require('../apiKeys.json');

const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs  = require('../chart/bugs.json');

const youtubeAPI = require('../logs/youtubeAPI.json');


const limit = 3;

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
            let responseItems = [];

            try{
                responseItems = result.items.slice(0);

                const officialItem = responseItems.find((v) => 
                    v.snippet.title.includes('MV') || v.snippet.title.includes('M/V') || v.snippet.title.includes('Official') );

                officialItem == undefined ? res(responseItems[0].id.videoId) : res(officialItem.id.videoId);
            }catch(e){
                res('cdwal5Kw3Fc');
                // shortest video ever
            }
        })
    }) 
};


async function insertVideoId(){
    const iterateSearch = async function(chart, name){
        for(let i=0; i<chart.length; i++){
            const music = chart[i];

            await searching(music, name).then(function(video_id){
                music.video_id = video_id;
                chart[i] = music;
            });
            
            fs.writeFileSync( path.join('../chart/'+ name + '.json')  , JSON.stringify(chart, null, 2));
            
            console.log(`${music.rank} : ${music.title} 완료`);
        }
        console.log(`============${name} 완료`);
    }

    await iterateSearch(melon, 'melon');
    await iterateSearch(genie, 'genie');
    await iterateSearch(bugs, 'bugs');
}

insertVideoId();