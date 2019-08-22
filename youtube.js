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

const searching = function(){

youtube.search(q, limit, function(err, result){
    if(err) { console.log(err); return;}

    console.log(JSON.stringify(result, null, 2));

    const items = result["items"];
    
    for(let i in items){
        let video = items[i];

        let video_id = video["id"]["videoId"];
    }
    return items[0].id.videoId;
})};

genie.forEach(function(el){
    q = el.title + el.artist;
    el.video_id = searching();
})




