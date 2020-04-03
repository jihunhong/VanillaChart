const mongoose = require('mongoose');
const moment = require('moment');

const currentDate = moment().format('YYYY-MM-DD');

const chartSchema = mongoose.Schema({ 
    query:    {type: String, require: true   },
    title :   {type: String, require: true   },
    artist:   {type: String, require: true   },
    video_id: {type: String, require: true   },
    result:   {type: String, require: false  },
    date :    {type: String, default : currentDate }
});

module.exports = chartSchema;