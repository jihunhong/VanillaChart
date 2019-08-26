const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs = require('../chart/bugs.json');

module.exports = function(app)
{
    app.get('/genie', function(req, res){
        res.json(genie);
    })

    app.get('/genie/:rank', function(req, res){
        const rank = req.params.rank;
        const music = genie.find((v) => v.rank == rank);

        res.json(music);
    })

    app.get('/melon', function(req, res){
        res.json(melon);
    })

    app.get('/melon/:rank', function(req, res){
        const rank = req.params.rank;
        const music = melon.find((v) => v.rank == rank);

        res.json(music);
    })

    app.get('/bugs', function(req, res){
        res.json(bugs);
    })

    app.get('/bugs/:rank', function(req, res){
        const rank = req.params.rank;
        const music = bugs.find((v) => v.rank == rank);

        res.json(music);
    })

}