const mongoose = require('mongoose');

const chartSchema = mongoose.Schema({
    rank: {
        type: Number,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    img : {
        type: String,
        required: true
    },
    video_id: {
        type: String,
        required: false
    }
});

module.exports = chartSchema;