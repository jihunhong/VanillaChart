const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./models');

//  Router 
const userRoutes = require('./routes/user-routes');

const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), {flags : 'a'})

db.sequelize.sync()
  .then(() => {
    console.log('sequelize connected');
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  saveUninitialized : false,
  resave : false,
  secret : process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined', { stream : logStream }));

app.use('/user', userRoutes);

app.listen(8080, () => {
  console.log('LOCAL DEV SETTING app.listen port 8080')
})

module.exports = app;