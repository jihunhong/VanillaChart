const router = require('express').Router();
const fetch = require('node-fetch');

const authCheck = (req, res, next) => {
    if(!req.user){
        // not logged in
        res.redirect('/auth/google');
    }else{
        next();
    }
}

router.get('/', authCheck, (req, res) => {
    res.json(req.user);
})

router.get('/playlist', (req, res) => {
    fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + req.user.accessToken,
        }
    }).then(response => response.json())
        .then(data => {
            res.send(data);
        })
})


module.exports = router;