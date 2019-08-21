const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKey = require('./apikey');

let q = 'i\'m sorry DEAN'
const limit = 10;

youtube.setKey(apiKey);

youtube.addParam('order', 'rating');
youtube.addParam('type', 'video');

youtube.search(q, limit, function(err, result){
    if(err) { console.log(err); return;}

    console.log(JSON.stringify(result, null, 2));

    const items = result["items"];
    for(let i in items){
        var video = items[i];
        var title = video["snippet"]["title"];
        var video_id = video["id"]["videoId"];
        var url = "https://www.youtube.com/watch?v=" + video_id;
        console.log("제목 : " + title);
        console.log("URL : " + url);
        console.log("-----------");
    }

})