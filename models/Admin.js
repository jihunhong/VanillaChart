const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    date:  { type: Date, default: Date.now },
    quota: { type: Number },
    logs:  []
})