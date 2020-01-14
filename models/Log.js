const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = mongoose.Schema({
    result:   {type: Boolean, require: true  },
    message:  {type: String, require: true },
    date :    {type: Date,   default: Date.now }
});

const Log = mongoose.model('log', logSchema);

module.exports = Log;