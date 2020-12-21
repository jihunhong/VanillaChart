const express = require('express');
const router = express.Router();

const { Chart } = require('../models');

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

router.get('/:chart/time/:time', async(req, res) => {
    // 시간을 받아서 과거 차트 데이터 조회
    const pastCharts = mongoose.model('pastCharts', pastChartsSchema, 'pastcharts');

    try{
        // const data = await pastCharts.find({data: req.params.rank});

        res.json(data);
    }catch(err){
        res.json({message : err});
    }

})

module.exports = router;