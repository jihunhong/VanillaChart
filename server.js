const express = require('express');
const path = require('path');
const app = express();
const chartRoutes = require('./routes/chart-routes');
const authRoutes = require('./routes/auth-routes');

const passportSetup = require('./config/passport-setup');

const keys = require('./keys');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');


app.use(bodyParser.json());
app.use('/api/chart', chartRoutes);
app.use('/auth', authRoutes);

if( process.env.NODE_ENV == 'production'){
    // deploy server setting

    console.log('Production MODE resolved');

    app.use(express.static(path.join(__dirname, './client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'))
    })
}

mongoose.connect(
    keys.db.uri, 
    {useNewUrlParser: true,
     useUnifiedTopology: true},
    () =>   console.log('connected')
)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => 
    console.log("Express server has started on port 8080")
);

