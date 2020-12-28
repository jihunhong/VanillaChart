const router = require('express').Router();
const fetch = require('node-fetch');

const passport = require('passport');

const keys = require('../keys');
const apiKey = keys.apiKeys.shift();

const User = require('../models/users');

const authCheck = (req, res, next) => {
    if(!req.user){
        // not logged in
        res.redirect('/auth/google');
    }else{
        next();
    }
}

const refreshToken = (req, res) => {
    const user = req.user;

    const url = 'https://oauth2.googleapis.com/token'

    const params = `?client_id=${keys.google.local.clientID}&client_secret=${keys.google.local.clientSecret}&refresh_token=${user.refreshToken}&grant_type=refresh_token`

    
    fetch( url + params, {
        method : 'POST'
    }).then(response => response.json())
        .then( async (json) => {
            await User.findOneAndUpdate(
                        { 'googleId' : user.googleId },
                        { $set : { accessToken: json.access_token }}
            )
            
            res.redirect('/personal');
        })
}

router.get('/', authCheck, (req, res) => {
    res.json(req.user);
    
})

router.get('/playlist', (req, res) => {
    // read playlist

    fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&key=' + apiKey, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + req.user.accessToken,
        }
    }).then(response => response.json())
        .then(json => {

            if( json.error ) { 
                console.log('expired access_token')
                refreshToken(req, res); 
            }
            else{ res.send(json); }
            
        })
})

router.post('/playlist', (req, res) => {

    // create playlist

    fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status&key=' + apiKey, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + req.user.accessToken,
        },
        body : JSON.stringify({
              snippet: {
                title: req.body.title || '재생목록',
                description: req.body.description || 'cherrychart.com 에서 생성된 재생목록'
              },
              status: {
                privacyStatus: req.body.privacy || 'private'
              }
          })
    }).then(response => response.json())
        .then(data => {
            res.send(data);
        })

})

router.patch('/playlist', (req, res) => {

    fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&key=' + apiKey, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + req.user.accessToken,
        },
        body : JSON.stringify({
              snippet: {
                playlistId: req.body.playlistId,
                resourceId: {
                    videoId: req.body.videoId,
                    kind: "youtube#video"
                }
              }
          })
    }).then(response => response.json())
        .then(data => {
            res.send(data);
        })
})


module.exports = router;