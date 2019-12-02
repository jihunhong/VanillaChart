const express = require('express');
const router = express.Router();

const chartSchema = require('../models/Chart');
const mongoose = require('mongoose');

router.get('/:chart', async(req, res) => {
    
    const chart = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const collection = await chart.find();
        // 차트 이름 별로 모든 데이터 조회
        res.json(collection);
    }catch(err){
        res.json({message : err});
    }
})

router.get('/:chart/:rank',  async(req, res) => {
    
    const chart = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const music = await chart.find({rank: req.params.rank});
        res.json(music);
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