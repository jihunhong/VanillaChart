const mongoose = require('mongoose');

const chartSchema = mongoose.Schema({
    rank: {
        type: Number,
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
    img : {
        type: String,
        require: true
    },
    video_id: {
        type: String,
        require: false
    }
});

module.exports = chartSchema;