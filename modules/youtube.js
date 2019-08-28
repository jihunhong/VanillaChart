const fs = require('fs');
const path = require('path');
const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKey = require('../apikey');

const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs  = require('../chart/bugs.json');

const youtubeAPI = require('../logs/youtubeAPI.json');


const limit = 3;
youtube.setKey(apiKey);

youtube.addParam('regionCode', 'kr');

function searching(music) {
    let count = youtubeAPI[youtubeAPI.length-1].count;

    return new Promise(function(res, rej){
        const q = `${music.artist} - ${music.title}`;

        youtube.search(q, limit, function (err, result) {
            if(err) { console.log(err); }
            
            count++;


            const json = {'query': q,
                          'title': music.title,
                          'artist': music.artist,
                          'date': new Date(),
                          'count': count};

            
                
            youtubeAPI.push(json);

            fs.writeFileSync( path.join('../logs/youtubeAPI.json')  , JSON.stringify(youtubeAPI, null, 2));
            let responseItems = [];

            try{
                responseItems = result.items.slice(0);

                const officialItem = responseItems.find((v) => 
                    v.snippet.title.includes('MV') || v.snippet.title.includes('M/V') || v.snippet.title.includes('Official') );

                officialItem == undefined ? res(responseItems[0].id.videoId) : res(officialItem.id.videoId);
            }catch(e){
                res('none');
            }
        })
    }) 
};


async function insertVideoId(){
    const iterateSearch = async function(chart, name){
        for(let i=0; i<chart.length; i++){
            const music = chart[i];

            await searching(music).then(function(video_id){
                music.video_id = video_id;
                chart[i] = music;
            });
            
            fs.writeFileSync( path.join('../chart/'+ name + '.json')  , JSON.stringify(chart, null, 2));
            
            console.log(`${music.rank} : ${music.title} 완료`);
        }
        console.log(`============${name} 완료`);
    }

    // await iterateSearch(melon, 'melon');
    await iterateSearch(genie, 'genie');
    // await iterateSearch(bugs, 'bugs');
}

insertVideoId();