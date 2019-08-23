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
            if(err) { rej(err) }
            count++;

            const json = {'query': q,
                          'date': new Date(),
                          'count': count};
            
            youtubeAPI.push(json);

            fs.writeFileSync( path.join('./youtubeAPI.json')  , JSON.stringify(youtubeAPI, null, 2));
            
            const items = result["items"];
            
            res(items[0]["id"]["videoId"]);
            // 검색결과중 official 이나 뮤직비디오인것 판별 해야함
        })
    }) 
};


async function insertVideoId(){
    for( let music of melon){
        q = `${music.title} ${music.artist}`;
        music.video_id = await searching();
    }
    fs.writeFileSync( path.join('./chart/'+ 'melon' + '.json')  , JSON.stringify(melon, null, 2));
}


insertVideoId();