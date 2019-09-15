const express = require('express');
const path = require('path');
const app = express();
const chartRouter = require('./router/chartDataRouter.js')(app);
const youtubeRouter = require('./router/youtubeRouter.js')(app);
const crawl = require('./modules/crawl');

const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());


app.listen(5000, () => 
    console.log("Express server has started on port 5000")
);

