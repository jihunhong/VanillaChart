const router = require('express').Router();

const keys = require('../keys');
const User = require('../models/User');

const Playlist = require('../class/Playlist');

const userPlaylist = new Playlist();

const authCheck = (req, res, next) => {
    if(!req.user){
        // not logged in
        res.redirect('/auth/google');
    }else{
        next();
    }
}

router.get('/', (req,  res) => {
    // import
    res.redirect('/personal');
})

router.get('/:chart', authCheck, (req, res) => {
    userPlaylist.Builder(
        {
            
        }
    )
    userPlaylist.getList()
                        .then((res) => {res.json(res)});
})