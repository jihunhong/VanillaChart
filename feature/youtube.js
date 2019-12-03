const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKeys = require('../apiKeys.json');
const limit = 3;

const mongoose = require('mongoose');
require('dotenv/config');

const chartSchema = require('../models/Chart');


mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true,
      useUnifiedTopology: true},
    () => console.log('connected')
)

const searching = (music, name) => {
    
    const key = apiKeys.find((v) => name === v.name).key;

    youtube.setKey(key);

    youtube.addParam('regionCode', 'kr');

    return new Promise(function(res, rej){
       
        const query = `${music.artist} - ${music.title}`;

        youtube.search(query, limit, function (err, result) {

            if(err) { console.log(err);}

            let response = [];
            response = result.items.slice(0);

            const officialItem = response.find((v) => 
                ['MV', 'M/V', 'Official'].includes(v.snippet.title) );
                // 검색된 결과들중 우선순위를 따져 반환하기 위한 코드

            officialItem === undefined ? res(response[0].id.videoId) : res(officialItem.id.videoId);
            
        })
    }) 
};


const insertVideoId = async () => {
    
    const melon = await iterateSearch('melon');
    const genie = await iterateSearch('genie');
    const bugs  = await iterateSearch('bugs');
    
    const iterateSearch = async (name) => {
        const collection = mongoose.model('Chart', chartSchema, name);
        const oldCollection   = mongoose.model('Chart', chartSchema, 'old_'+name);

        const chart = await collection.find();
        const old   = await oldCollection.find();

        chart.forEach((v) => {
            const exist = old.find((v) => music.title === v.title && v.video_id);

            if(exist){
                v.video_id = exist.video_id;
            }else{
                const video_id = await searching(v, name);
                v.video_id = video_id;
                console.log(`+ ${v.title} 검색 => ${video_id}`);
            }
        })

        return chart;
    }

    return [melon, genie, bugs];
}

insertVideoId().then( chart => {
    const melon = chart.shift();
    const genie = chart.shift();
    const bugs  = chart.shift();

    insertDocuments(melon, 'melon');
    insertDocuments(genie, 'genie');
    insertDocuments(bugs, 'bugs');

    const insertDocuments = async(data, name) => {
        try{
            const collection = mongoose.model('Chart', chartSchema, name)
            await collection.insertMany(data)
        }catch(err){
            console.log(err);
        }
    }
    

} )


