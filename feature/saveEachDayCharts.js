const mongoose = require('mongoose');
const colors = require('colors');
const moment = require("moment");

const currentDate = moment().format('YYYY-MM-DD HH:mm');

const db = require('../keys.js').db;
const options = { 
    useNewUrlParser: true,
    useUnifiedTopology: true
};




const pastChartSchema = require('../models/PastCharts');
const chartSchema = require('../models/Chart');



const pastChartCollection = mongoose.model('pastCharts', pastChartSchema);

(async() => {

    await mongoose.connect(db.uri, 
        options, 
        () => {
            console.log(`${currentDate} : Connected mongo`.yellow)
        }
    );

    const melonCollection = mongoose.model('Chart', chartSchema, 'melon');
    const genieCollection = mongoose.model('Chart', chartSchema, 'genie');
    const bugsCollection = mongoose.model('Chart', chartSchema, 'bugs');
    
    const melonJson = await melonCollection.find({});
    const genieJson = await genieCollection.find({});
    const bugsJson = await bugsCollection.find({});

    try{
    
        const pastDocument = {
            // date : currentDate, (Default)
            chart : {
                melon : melonJson,
                genie : genieJson,
                bugs : bugsJson
            }
        };

        await pastChartCollection.insertMany(pastDocument);
        
        console.log(`${currentDate} : 과거 데이터 저장 완료`.green);

    }catch(e){
        console.log(`${currentDate} : 데이터 저장 실패`.red);
    }finally{
        mongoose.disconnect();
    }
})();



