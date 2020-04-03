const mongoose = require('mongoose');
const moment = require('moment');
moment().utcOffset(8);

const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

const searchLogSchema = mongoose.Schema({ 
    query:    {type: String, require: true   },
    title :   {type: String, require: false   },
    artist:   {type: String, require: false   },
    video_id: {type: String, require: true   },
    result:   {type: String, require: false  },
    date :    {type: String, default : currentDate }
});

module.exports = mongoose.model('SearchLog', searchLogSchema, 'search');