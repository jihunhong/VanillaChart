const fs = require('fs');
const path = require('path');
const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKey = require('./apikey');

const genie = require('./chart/genie.json');
const melon = require('./chart/melon.json');
const bugs = require('./chart/bugs.json');

const youtubeAPI = require('./youtubeAPI.json');

let q = '';
const limit = 1;
youtube.setKey(apiKey);

youtube.addParam('order', 'rating');
youtube.addParam('type', 'video');

function searching() {
    let count = youtubeAPI[youtubeAPI.length-1].count;

    return new Promise(function(res, rej){
        youtube.search(q, limit, function (err, result) {
            if(err) { console.log(err); }
            
            count++;

            const json = {'query': q,
                          'date': new Date(),
                          'count': count};

            // if(result["items"] !== null) {json.video_id = result["items"][0]["id"]["videoId"];}
                
            youtubeAPI.push(json);

            fs.writeFileSync( path.join('./youtubeAPI.json')  , JSON.stringify(youtubeAPI, null, 2));
            let responseItems = [];

            try{
                responseItems = result.items.slice(0);
                res(responseItems[0]["id"]["videoId"]);
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
            q = `${music.title} ${music.artist}`;
            music.video_id = await searching();
            chart[i] = music;
            fs.writeFileSync( path.join('./chart/'+ name + '.json')  , JSON.stringify(chart, null, 2));
            console.log(`${music.rank} : ${music.title} 완료`);
        }
        console.log(`============${name} 완료`);
    }

    // await iterateSearch(melon, 'melon');
    await iterateSearch(genie, 'genie');
    // await iterateSearch(bugs, 'bugs');
}

insertVideoId();