const express = require('express');
const router = express.Router();

const chartSchema = require('../models/Chart');
const mongoose = require('mongoose');

router.get('/:chart', async(req, res) => {
    
    const chart = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const collection = await chart.find();
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

module.exports = router;