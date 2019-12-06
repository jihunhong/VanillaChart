const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKeys = require('../apiKeys.json');
const limit = 3;

const mongoose = require('mongoose');
const db = require('../DB.json');

const chartSchema = require('../models/Chart');


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
       
        const query = `${music.artist} - ${music.title}`;

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

        chart.forEach((v) => {
            const exist = old.find((music) => v.title === music.title && music.video_id);

            if(exist){
                v.video_id = exist.video_id;
            }else{
                searching(v, name)
                    .then(res => {
                        const video_id = res;
                        v.video_id = video_id;
                        console.log(`+ ${v.title} 검색 => ${video_id}`);
                    })
            }
        })

        return chart;
    }

        
    const melon = await iterateSearch('melon');
    const genie = await iterateSearch('genie');
    const bugs  = await iterateSearch('bugs');

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
            await collection.deleteMany();
            await collection.insertMany(data)

            console.log(`[${name} youtube.js 완료]`)
        }catch(err){
            console.log(err);
        }
    }
    
    mongoose.disconnect();
} )


