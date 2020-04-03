const mongoose = require('mongoose');
const moment = require('moment');

const currentDate = moment().format('YYYY-MM-DD');

const chartSchema = mongoose.Schema({
    rank:     {type: Number, require: true },
    title :   {type: String, require: true },
    artist:   {type: String, require: true },
    img :     {type: String, require: true },
    video_id: {type: String, require: false},
    date :    {type: String, default : currentDate}
});

module.exports = chartSchema;