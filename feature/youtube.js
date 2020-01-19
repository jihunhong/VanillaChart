const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKeys = require('../keys.js').apiKeys;
const limit = 3;

const mongoose = require('mongoose');
const db = require('../keys.js').db;

const chartSchema = require('../models/Chart');
const searchScehma = require('../models/SearchLog');


mongoose.connect(
    db.uri, 
    { useNewUrlParser: true,
      useUnifiedTopology: true},
    () => console.log('connected')
)

const searching = (music, name) => {
    
    const key = apiKeys.find((v) => name === v.name).key;

    youtube.setKey(key);

    youtube.addParam('regionCode', 'kr');

    return new Promise(function(res, rej){
       
        const query = `${music.artist} ${music.title}`;

        youtube.search(query, limit, function (err, result) {

            if(err) { console.log(err);}

            let response = [];
            try{

                response = result.items.slice(0);

                const officialItem = response.find((v) => 
                    ['MV', 'M/V', 'Official'].includes(v.snippet.title) );
                    // 검색된 결과들중 우선순위를 따져 반환하기 위한 코드

                officialItem === undefined ? res(response[0].id.videoId) : res(officialItem.id.videoId);

            }catch(e){
                console.log(`[ youtube.search() 에러] : ${e}`);
                res(undefined);
            }
        })
    }) 
};


const insertVideoId = async () => {

    const iterateSearch = async (name) => {
        const collection = mongoose.model('Chart', chartSchema, name);
        const oldCollection   = mongoose.model('Chart', chartSchema, 'old_'+name);

        const chart = await collection.find();
        const old   = await oldCollection.find();

        for (const [i, v] of chart.entries()){
            const exist = await old.find((music) => v.title === music.title && music.video_id !== 'none');


            if(exist && exist.video_id){
                // 같은 노래가 존재할경우
                v.video_id = exist.video_id;

            }else if( !exist  && v.video_id){
                // 같은노래가 없지만 video_id가 비어있지 않은 경우
                  continue;
            }else{
                const video_id = await searching(v, name);
                const searchCollection = mongoose.model('SearchLog', searchScehma, 'search');
                await searchCollection.insertMany({ 
                                                    query: `${v.title}  ${v.artist}`,
                                                    title: v.title,
                                                    artist: v.artist,
                                                    video_id: video_id,
                                                    result: new Boolean(video_id)
                                                   });
                chart[i].video_id = video_id;
                console.log(`+ ${v.title} 검색 => ${video_id}`);
            }

        }
        return chart;
    }

        
    const melon = await iterateSearch('melon');
    const genie = await iterateSearch('genie');
    const bugs  = await iterateSearch('bugs');

    return [melon, genie, bugs];
}

const youtube_Matching = async() => {
        insertVideoId().then( chart => {
        const melon = chart.shift();
        const genie = chart.shift();
        const bugs  = chart.shift();

        const insertDocument = async(data, name) => {
            try{
                const collection = mongoose.model('Chart', chartSchema, name)
                await collection.remove();
                await collection.insertMany(data)

                console.log(`[${name} youtube.js 완료]`)
            }catch(err){
                console.log(err);
            }
        }

        
        const insertDocuments = async() => {
            await insertDocument(melon, 'melon');
            await insertDocument(genie, 'genie');
            await insertDocument(bugs, 'bugs');
        }

        insertDocuments().then(res => {
            console.log(new Date().toLocaleTimeString() + '[insertDocuments() 완료]');
            mongoose.disconnect();
        })
    })
}
youtube_Matching();