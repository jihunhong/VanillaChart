const express = require('express');
const path = require('path');
const app = express();
const router = require('./router/chartDataRouter.js/index.js')(app);

app.use(express.json());
app.use(express.static('public'));

const server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
})

