const router = require('express').Router();
const mongoose = require('mongoose');

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
    
    const collection = mongoose.model('Log', logSchema, 'logs')

    try{
        const logs = await collection.find();
        res.json(logs);
    }catch(err){
        res.json({message : err});
    }
})