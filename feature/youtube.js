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
const searchLogCollection = require('../models/SearchLog.js');

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

        youtube.search(query, limit, async function (err, result) {

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

                let video_id;

                if(!response[0]){
                    console.log(colors.red('결과가 아예 없네요? ==> ' + query));
                    video_id = 'null';

                }else if(Object.keys(response[0]).includes('id')){
                    const result = response[0].id.videoId;                

                    console.log(colors.green(`${query} - ${result}`));
                    video_id = result;
                }else{
                    consolr.log(colors.red('quota Exceed'))
                    video_id = 'quotaExceed'
                }
                
                await searchLogCollection.insertMany({query, video_id});

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

    const chart = await collection.find();

    const result = [];

    for (const current of chart){
        const exist = await searchLogCollection.findOne({query : `${current.title}  ${current.artist}`})

        if(exist){
            result.push(Object.assign(current, {video_id : exist.video_id}));

        }else{
            
            const video_id = await search(current, name);
            result.push(Object.assign(current, {video_id : video_id}));
        }
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
    process.exit();
})();