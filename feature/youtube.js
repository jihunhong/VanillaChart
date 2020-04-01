const moment = require('moment');
const colors = require('colors');

const Youtube = require('youtube-node');
const youtube = new Youtube();

const apiKeys = require('../keys.js').apiKeys;
const limit = 10;

const mongoose = require('mongoose');
const db = require('../keys.js').db;

const chartSchema = require('../models/Chart');
const pastChartsSchema  = require('../models/PastCharts.js');

mongoose.connect(
    db.uri, 
    { useNewUrlParser: true,
      useUnifiedTopology: true},
    () => console.log('connected')
)

const search = (music, name) => {
    
    const key = apiKeys.find((v) => name === v.name).key;

    youtube.setKey(key);

    youtube.addParam('regionCode', 'kr');

    return new Promise(function(res, rej){
       
        const query = `${music.artist} ${music.title}`;

        youtube.search(query, limit, function (err, result) {

            if(err) { console.log(err);}

            
            try{
                let response = [];

                ['Official', 'MV', 'M/V'].forEach((con) => {
                    const matchedEl = result.items.find((v) => v.snippet.title.includes(con));
                    response.push(matchedEl);
                })
                // 검색된 결과들중 우선순위를 따져 반환하기 위한 코드

                const topic = result.items.find((v) => v.snippet.channelTitle.includes('- Topic'));
                
                response.push(topic);

                response = response.filter((v) => Boolean(v));

                const video_id = response[0].id.videoId;
                
                console.log(colors.yellow(`${query} - ${video_id}`));
                res(video_id);

            }catch(e){
                console.log(colors.red(`[ youtube.search() 에러] : ${e}`));
                rej(undefined);
            }
        })
    }) 
};

const youtubeMatchingByChartName = async (name) => {
    const collection = mongoose.model('Chart', chartSchema, name);
    const oldCollection   = mongoose.model('Chart', chartSchema, 'old_'+name);

    const chart = await collection.find();
    const old   = await oldCollection.find();

    const result = [];

    for (const current of chart){
        const exist = old.find((past) => current.title === past.title && past.video_id );

        if(exist){
            result.push({...current, video_id : exist.video_id} );

        }else{
            
            const video_id = await search(current, name);
            result.push({...current, video_id : video_id});
        }
        
        // const pastChartsCollection = mongoose.model('PastCharts', pastChartsSchema, 'pastcharts');

        // const document = await pastChartsCollection.findOne({data : {$elemMatch : {title : current.title} }});

        // if(document.data === null){
        //     result.push({current, video_id : 0});
        // }else{
        
        // const row = document.data.find((row) => current.title === row.title && current.artist === row.artist);

        // result.push({...current, video_id : row.video_id});
        // console.log(row.title);
        // }
    }

    return result;
}

(async() => {

    const melonCollection = mongoose.model('Chart', chartSchema, 'melon');
    const genieCollection = mongoose.model('Chart', chartSchema, 'genie');
    const bugsCollection = mongoose.model('Chart', chartSchema, 'bugs');
        
    const melon = await youtubeMatchingByChartName('melon');
    console.log(colors.blue('melon youtube 완료'));

    await melonCollection.remove({});
    await melonCollection.insertMany(melon);
    
    const genie = await youtubeMatchingByChartName('genie');
    console.log(colors.blue('genie youtube 완료'));

    await genieCollection.remove({});
    await genieCollection.insertMany(genie);
    
    const bugs  = await youtubeMatchingByChartName('bugs');
    console.log(colors.blue('bugs youtube 완료'));

    await bugsCollection.remove({});
    await bugsCollection.insertMany(bugs);

    console.log(colors.green(`${moment().format('YYYY-MM-DD')} youtube 완료`))
})();