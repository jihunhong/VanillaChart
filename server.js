const express = require('express');
const path = require('path');
const app = express();
const router = require('./router/main.js')(app);

app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

const server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
})

