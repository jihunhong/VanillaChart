const redis = require('redis');
const client = redis.createClient();

const mongoose = require('mongoose');
const db = require('../keys.js').db;

const chartSchema = require('../models/Chart');

(async() => {

    await mongoose.connect(
        db.uri, 
        { useNewUrlParser: true,
          useUnifiedTopology: true},
        () => console.log('connected')
    )

    

    const melon = await mongoose.model('Chart', chartSchema, 'melon').find();
    const genie = await mongoose.model('Chart', chartSchema, 'genie').find();
    const bugs = await mongoose.model('Chart', chartSchema, 'bugs').find();

    client.set('melon', JSON.stringify(melon), redis.print);
    client.set('genie', JSON.stringify(genie), redis.print);
    client.set('bugs', JSON.stringify(bugs), redis.print);
    
    client.quit();
    mongoose.disconnect();
})();