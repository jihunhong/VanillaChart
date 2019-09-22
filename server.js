const express = require('express');
const path = require('path');
const app = express();
const chartRouter = require('./router/chartDataRouter.js')(app);
const youtubeRouter = require('./router/youtubeRouter.js')(app);

const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());

if( process.env.NODE_ENV == 'production'){

    console.log('Production MODE resolved');

    app.use(express.static(path.join(__dirname, './client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => 
    console.log("Express server has started on port 8080")
);

