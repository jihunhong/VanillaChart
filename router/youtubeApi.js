const JSONResult = require('../Object/JSONResult.js');
const VIDEOIDS = require('../data.json');

const result = new JSONResult();

module.exports = function(app)
{
    app.get('/api/youtube/search', function(req, res){
        if(Object.keys(req.query).length === 0){
            res.json(result.fail('need to input query'));
        }else{
            const query = req.query.q;
            const video = VIDEOIDS.find((v) => v.query == query);
            res.json(result.judge(video));
        }

    })

}