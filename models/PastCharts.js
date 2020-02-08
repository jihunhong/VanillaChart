const mongoose = require('mongoose');
const moment = require("moment");
require('moment-timezone'); moment.tz.setDefault("Asia/Seoul");

const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

const pastChartsSchema = mongoose.Schema({
    date:  {type: String, default: currentDate},
    data : {
        type: Array, required : true
    }
});

module.exports = pastChartsSchema;