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
    app.get('/api/genie', function (req, res) {
        res.json(result.success(charts[genie]));
    })

    app.get('/api/genie/:rank', function (req, res) {
        const genie = charts['genie'];

        const music = genie.find((v) => v['rank'] == req.params['rank']);

        res.json(result.judge(music));
    })


    app.get('/api/melon', function (req, res) {
        res.json(result.success(charts[melon]));
    })

    app.get('/api/melon/:rank', function (req, res) {
        const melon = charts['melon'];

        const music = melon.find((v) => v['rank'] == req.params['rank']);

        res.json(result.judge(music));
    })


    app.get('/api/bugs', function (req, res) {
        res.json(result.success(charts[bugs]));
    })

    app.get('/api/bugs/:rank', function (req, res) {
        const bugs = charts['bugs'];

        const music = bugs.find((v) => v['rank'] == req.params['rank']);

        res.json(result.judge(music));
    })

    
}