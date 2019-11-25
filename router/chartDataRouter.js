const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs = require('../chart/bugs.json');

const JSONResult = require('../Object/JSONResult.js');

const result = new JSONResult();

const assert = require('assert');
// const MongoClient = require('mongodb').MongoClient;
// // Connection URL
// const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'VanillaChart';

// MongoClient.connect(url, function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
// });

const charts = {
    'genie': genie,
    'melon': melon,
    'bugs': bugs
};

module.exports = function (app) {
    app.get('/api/chart/:chart', function (req, res) {
        
        // readChart(db, function() {}, genie, 'genie');

        res.json(result.judge(charts[req.params.chart]));
    })

    app.get('/api/chart/:chart/:rank', function (req, res) {
        const chart = charts[req.params.chart];

        const music = chart.find((v) => v['rank'] == req.params['rank']);
    
        // readChartByRank(db, function() {}, genie, rank);

        res.json(result.judge(music));
    })

}