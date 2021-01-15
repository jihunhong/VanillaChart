import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = express.Router();

import { signUpUser } from '../controller/userController';
import prisma from '../config/db';

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);
            return next(err);
        }

        if(info){
            return res.status(401).send(info.message);
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
    req.session.destroy(() => {
        console.log('destroyed session..');
    });
    res.send('ok');
})

router.post('/create', async(req, res, next) => {
    
    try{
        const existUser = await prisma.users.findOne({
            where : {
                email : req.body.email,
            }
        });
        if(existUser){
            return res.status(403).send('이미 사용중인 아이디입니다.')
        }

        await signUpUser({ email : req.body.eamil, nickname : req.body.nickname, password: req.body.password });
        res.status(201).send('ok');
    }catch(err){
        console.error(err);
        next(err)
    }
})

export default router;