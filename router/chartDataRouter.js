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
    app.get('/api/:chart/list', function (req, res) {
        const name = req.params.chart;

        res.json(result.success(charts[name]));
    })

    app.get('/api/:chart', function (req, res) {
        const name = req.params.chart;
        const chart = charts[name];

        const keys = Object.keys(req.query);
        const queryKey = keys[0];
        const music = chart.find((v) => v[queryKey] == req.query[queryKey]);

        res.json(result.judge(music));
    })
}