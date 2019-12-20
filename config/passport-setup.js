const passport = require('passport');
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy;
const fs = require('fs');
const keys = require('../keys');

passport.use(
    new YoutubeV3Strategy({

        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        scope: ['https://www.googleapis.com/auth/youtube'],
        profileURL: 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true'

    }, (accessToken, refreshToken, profile, done) => {

        console.log('passport callback function fired');
        console.log(profile);
        fs.writeFileSync('mine.json', JSON.stringify(profile));

    })
)