const mongoose = require('mongoose');
const db = require('../keys.js').db;

mongoose.connect(
    db.uri, 
    { useNewUrlParser: true,
      useUnifiedTopology: true},
    () => console.log('connected')
)

const moment = require("moment");
const pastChartsSchema = require('../models/PastCharts');
const chartSchema = require('../models/Chart');

const currentDate = moment(new Date()).format();
// moment().format('MMMM Do YYYY, h:mm:ss a'); // 2월 8일 2020, 6:05:11 오후
// moment().format('dddd');                    // 토요일
// moment().format("MMM Do YY");               // 2월 8일 20
// moment().format('YYYY [escaped] YYYY');     // 2020 escaped 2020
// moment().format();                          // 2020-02-08T18:07:38+09:00

const pastChartsCollection = mongoose.model('pastCharts', pastChartsSchema);

(async() => {
    const melonCollection = mongoose.model('Chart', chartSchema, 'melon');
    const genieCollection = mongoose.model('Chart', chartSchema, 'genie');
    const bugsCollection = mongoose.model('Chart', chartSchema, 'bugs');

    const melonJson = await melonCollection.find({});
    const genieJson = await genieCollection.find({});
    const bugsJson = await bugsCollection.find({});

    try{
        await pastChartsCollection.insertMany({data : melonJson});
        await pastChartsCollection.insertMany({data : genieJson});
        await pastChartsCollection.insertMany({data : bugsJson});
        console.log('과거 데이터 저장 완료');
    }catch(e){
        console.log(e);
    }finally{
        mongoose.disconnect();
    }
})();



