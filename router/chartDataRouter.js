const genie = require('../chart/genie.json');
const melon = require('../chart/melon.json');
const bugs = require('../chart/bugs.json');

module.exports = function(app)
{
    app.get('/genie', function(req, res){
        res.json(genie);
    })

    app.get('/melon', function(req, res){
        res.json(melon);
    })

    app.get('/bugs', function(req, res){
        res.json(bugs);
    })

}