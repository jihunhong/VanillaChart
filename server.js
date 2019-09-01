const express = require('express');
const path = require('path');
const app = express();
const chartRouter = require('./router/chartDataRouter.js')(app);
const youtubeRouter = require('./router/youtubeRouter.js')(app);

const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());


const server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
})

