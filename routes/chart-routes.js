const express = require('express');
const router = express.Router();

const { Chart } = require('../models');

const redis = require('redis');
const client = redis.createClient();

router.get('/:chart', async(req, res, next) => {

    try{
        const chart = await Chart.findOne({
            where : {
                site : req.params.chart,
            }
        })
        res.status(200).send(chart);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/:chart/:rank',  async(req, res) => {
    
    try{
        const result = await Chart.findOne({
            where : {
                site : req.params.chart,
                rank : req.params.rank
            }
        })
        res.status(200).send(result);
    }catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;