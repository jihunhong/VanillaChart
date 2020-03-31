const router = require('express').Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const chartSchema = require('../models/Chart');
const userSchema = require('../models/User');
const searchlogSchema = require('../models/SearchLog');
const logSchema = require('../models/Log');

router.get('/:chart', async(req, res) => {
    
    const collection = mongoose.model('Chart', chartSchema, req.params.chart)

    try{
        const chart = await collection.find();
        res.json(chart);
    }catch(err){
        res.json({message : err});
    }
})

router.get('/search', async(req, res) => {
    
    const collection = mongoose.model('SearchLog', searchlogSchema, 'search')

    try{
        const searchLog = await collection.find();
        res.json(searchLog);
    }catch(err){
        res.json({message : err});
    }
})

router.get('/log', async(req, res) => {
    
    const crawlLog = fs.readFileSync(path.resolve(__dirname, 'crawl.log'));

    try{ 
        res.send(crawlLog.toString());
    }catch(err){
        res.json({message : err});
    }
})

module.exports = router
