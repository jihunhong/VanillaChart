const router = require('express').Router();

const chartSchema = require('../models/Chart');
const mongoose = require('mongoose');

const redis = require('redis');
const client = redis.createClient();

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
        
        client.get(req.params.chart, (err, value) => {
            if( err ){console.log(err)};

            const json = JSON.parse(value);

            const data = json.find((v) => v.rank === req.params.rank );

            res.json(data);
        });

    }catch(err){
        res.json({message : err});
    }
})

router.patch('/:chart/:id',  async(req, res) => {
    // 조회한 음원 항목의 데이터 수정
    const chart = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const music = await chart.find({rank: req.params.rank});
        res.json(music);
    }catch(err){
        res.json({message : err});
    }

})

module.exports = router;