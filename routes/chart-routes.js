const router = require('express').Router();

const chartSchema = require('../models/Chart');
const mongoose = require('mongoose');

router.get('/:chart', async(req, res) => {
    
    const collection = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const chart = await collection.find();
        res.json(chart);
    }catch(err){
        res.json({message : err});
    }
})

router.get('/:chart/:rank',  async(req, res) => {
    
    const chart = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const music = await chart.find({rank: req.params.rank});
        res.json(music[0]);
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