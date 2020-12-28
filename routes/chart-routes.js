const router = require('express').Router();

const chartSchema = require('../models/Chart');

const redis = require('redis');
const client = redis.createClient();

router.get('/qwer', async(req, res) => {
    res.redirect('melonapp://play/?ctype=1&menuid=0&cid=32381408,32381407,32381409,32381410,32381408,31706346,32381411,32381412,32381408,31388213,32381413,32381414,32381415,32381408,32381416,32381417,32381418');
})


router.get('/:chart', async(req, res) => {

    try{

        client.get(req.params.chart, (err, value) => {
            if( err ){console.log(err)};
            
            res.json(JSON.parse(value));
        });

    }catch(err){
        res.json({message : err});
    }
})

router.get('/:chart/:rank',  async(req, res) => {
    
    try{
        
        client.get(req.params.chart, async (err, value) => {
            if( err ){console.log(err)};

            const json = JSON.parse(value);

            const data = json.find((v) => v.rank == req.params.rank );

            res.json(data);
        });

    }catch(err){
        res.json({message : err});
    }
})

module.exports = router;