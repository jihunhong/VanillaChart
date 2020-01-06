const router = require('express').Router();
const fetch = require('node-fetch');

const passport = require('passport');

const keys = require('../keys');

const User = require('../models/User');

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
            
            res.redirect('/personal/playlist');
        })
}

router.get('/', authCheck, (req, res) => {
    res.json(req.user);
})

router.get('/playlist', (req, res) => {

    // read playlist

    fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
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

    const submitted = req.body;

    fetch('https://www.googleapis.com/youtube/v3/playlists', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + req.user.accessToken,
        },
        body : JSON.stringify({
            part: 'snippet,status',
            resource: {
              snippet: {
                title: submitted.title || '재생목록',
                description: submitted.description || 'cherrychart.com 에서 생성된 재생목록'
              },
              status: {
                privacyStatus: submitted.privacy || 'private'
              }
            }
          })
    }).then(response => response.json())
        .then(data => {
            res.send(data);
        })

})

router.patch('/playlist', (req, res) => {
// ** inserting to playlist **
// {
//   "snippet": {
//     "playlistId": "PL8u0G9l6wlp9BNle3N5yCZSlVuQ7_Ct8T",
//     "resourceId": {
//       "videoId": "1ZhDsPdvl6c",
//       "kind": "youtube#video"
      
//     }
    
//   }
})


module.exports = router;