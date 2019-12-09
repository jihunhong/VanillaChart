const mongoose = require('mongoose');

const chartSchema = mongoose.Schema({
    query: {
        type: String,
        require: true
    },
    title : {
        type: String,
        require: true
    },
    artist: {
        type: String,
        require: true
    },
    video_id:{
        type: String,
        require: true
    },
    date : {
        type: Date,
        default: Date.now
    },
    result: {
        type: String,
        require: false
    }
});

module.exports = chartSchema;