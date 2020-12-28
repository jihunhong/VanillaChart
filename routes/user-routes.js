const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User } = require('../models');

const router = express.Router();

const { signUpUser } = require('../controller/userController');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);
            return next(err);
        }

        if(info){
            return res.status(401).send(info.reason);
        }

        return req.login(user, async(loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.status(200).json(user);
        })
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
})

router.post('/create', async(req, res, next) => {
    
    try{
        const existUser = await User.findOne({
            where : {
                email : req.body.email,
            }
        });
        if(existUser){
            return res.status(403).send('이미 사용중인 아이디입니다.')
        }

        await signUpUser(req);
        res.status(201).send('ok');
    }catch(err){
        console.error(err);
        next(err)
    }
})

module.exports = router;