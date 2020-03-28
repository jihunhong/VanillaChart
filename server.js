const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const https = require('https');
const http = require('http');

const redirection = require('redirect-https');

const morgan = require('morgan');

//  Router 
const chartRoutes = require('./routes/chart-routes');
const authRoutes = require('./routes/auth-routes');
const personalRoutes = require('./routes/personal-routes');
const adminRoutes = require('./routes/admin-routes');

const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const mongoose = require('mongoose');
const keys = require('./keys');

const cookieSession = require('cookie-session');


const bodyParser = require('body-parser');


app.use(cookieSession({
    maxAge: 24 * 60 * 60 *1000,
    keys: [keys.cookieSession.key]
}));
app.use(passport.initialize());
app.use(passport.session());


const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), {flags : 'a'})
app.use(morgan('combined', {stream : logStream}));



app.use(bodyParser.json());
app.use('/api/chart', chartRoutes);
app.use('/auth', authRoutes);
app.use('/personal', personalRoutes);
app.use('/admin', adminRoutes);

if( process.env.NODE_ENV == 'production'){
    // deploy server setting

    console.log('Production MODE resolved');

    app.use(express.static(path.join(__dirname, './client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'))
    })

    const lex = require('greenlock-express').create({
        version: 'draft-11',
        configDir: '/etc/letsencrypt',
        server: 'https://acme-v02.api.letsencrypt.org/directory',
        approveDomains: (opts, certs, cb) => {
          if (certs) {
            opts.domains = ['cherrychart.com', 'www.cherrychart.com'];
          } else {
            opts.email = 'redgee49@gmail.com';
            opts.agreeTos = true;
          }
          cb(null, { options: opts, certs });
        },
        renewWithin: 81 * 24 * 60 * 60 * 1000,
        renewBy: 80 * 24 * 60 * 60 * 1000,
    });
    
    http.createServer(lex.middleware(redirection())).listen(process.env.PORT || 8080);
    https.createServer(lex.httpsOptions, lex.middleware(app)).listen(process.env.SSL_PORT || 443);
}else{
  
  app.listen(8080, () => {
    console.log('LOCAL DEV SETTING app.listen port 8080')
  })
}

mongoose.connect(
    keys.db.uri, 
    {useNewUrlParser: true,
     useUnifiedTopology: true},
)

module.exports = app;