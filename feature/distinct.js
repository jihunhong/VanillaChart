const mongoose = require('mongoose');
const db = require('../keys.js').db;

mongoose.connect(
    db.uri, 
    { useNewUrlParser: true,
      useUnifiedTopology: true},
    () => console.log('connected')
)

const searchSchema = require('../models/SearchLog');

const searchCollection = mongoose.model('SearchLog', searchSchema, 'search');


(async() => {
    const chart = [];
    const titles = await searchCollection.find().distinct('title');

    for( let t of titles){
      const temp = await searchCollection.findOne({title : t});
      chart.push(temp);

      const d = await searchCollection.find().where('title').equals(t);
      console.log(t +' ' + Number(d.length-1) + '개 삭제');
    }

    await searchCollection.remove();
    await searchCollection.insertMany(chart);

})();