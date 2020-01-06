const mongoose = require('mongoose');

const chartSchema = mongoose.Schema({
    query:    {type: String, require: true   },
    title :   {type: String, require: true   },
    artist:   {type: String, require: true   },
    video_id: {type: String, require: true   },
    result:   {type: String, require: false  },
    date :    {type: Date,   default: Date.now }
});

module.exports = chartSchema;