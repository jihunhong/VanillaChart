const fs = require('fs');
const path = require('path');
const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKey = require('./apikey');

const genie = require('./chart/genie.json');
const melon = require('./chart/melon.json');
const bugs = require('./chart/bugs.json');

let q = '';
const limit = 1;
youtube.setKey(apiKey);

youtube.addParam('order', 'rating');
youtube.addParam('type', 'video');

function searching() {
    let video_id = "";
    
    return new Promise(function(res, rej){
        youtube.search(q, limit, function (err, result) {
            if(err) { rej(err)}
            console.log(result)
            const items = result["items"];
            
            res(items[0]["id"]["videoId"]);
        })
    }) 
};


async function genieToYoutube(){
    for( let music of genie){
        q = `${music.title} ${music.artist}`;
        music.video_id = await searching();
    }
    fs.writeFileSync( path.join('./chart/'+ 'genie' + '.json')  , JSON.stringify(genie, null, 2));
}


genieToYoutube();