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
            if(err) { console.log(err);}
            count++;

            const json = {'query': q,
                          'date': new Date(),
                          'count': count};
            
            youtubeAPI.push(json);

            fs.writeFileSync( path.join('./youtubeAPI.json')  , JSON.stringify(youtubeAPI, null, 2));
            const items = [];

            try{
                items = result["items"];
                res(items[0]["id"]["videoId"]);
            }catch(e){
                res('none');
            }
        })
    }) 
};


function insertVideoId(){
    const iterateSearch = async function(chart, name){
        for( let music of chart){
            q = `${music.title} ${music.artist}`;
            music.video_id = await searching();
        }
        fs.writeFileSync( path.join('./chart/'+ name + '.json')  , JSON.stringify(chart, null, 2));
    }

    iterateSearch(melon, 'melon');
    iterateSearch(genie, 'genie');
    iterateSearch(bugs, 'bugs');
}

insertVideoId();