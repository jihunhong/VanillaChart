const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs = require('../chart/bugs.json');

const charts = {
    'genie': genie,
    'melon': melon,
    'bugs': bugs
};

module.exports = function (app) {
    app.get('/:chart', function (req, res) {
        const name = req.params.chart;
        res.json(charts[name]);
    })

    app.get('/:chart/:rank', async function (req, res) {
        const name = req.params.chart;
        const chart = charts[name];

        const rank = req.params.rank;
        const music = await chart.find((v) => v.rank == rank);

        res.json(music);
    })

}