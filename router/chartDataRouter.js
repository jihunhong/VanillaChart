const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs = require('../chart/bugs.json');

const JSONResult = require('../Object/JSONResult.js');

const result = new JSONResult();

const charts = {
    'genie': genie,
    'melon': melon,
    'bugs': bugs
};

module.exports = function (app) {
    app.get('/api/chart/:chart', function (req, res) {
        res.json(result.judge(charts[req.params.chart]));
    })

    app.get('/api/chart/:chart/:rank', function (req, res) {
        const chart = charts[req.params.chart];

        const music = chart.find((v) => v['rank'] == req.params['rank']);

        res.json(result.judge(music));
    })
    
}