import express from 'express';
import passport from 'passport';
import { signUpUser } from '../controller/userController';
import { User } from '../models';
import { sign } from '../lib';

const router = express.Router();

router.get('/', (req, res, next) => {
    passport.authenticate('jwt', { session : false }, (error, user, info) => {
        if(error){
            console.error(error);
            return next(error);
        }
        if(info){
            return res.status(401).json(info);
        }

        return res.status(200).json(user);
    })(req, res, next);
});


router.get('/auth/google', 
    passport.authenticate('google', {
        scope: [
            'email',
            'profile'
        ]
    })
);

router.get('/auth/google/callback', 
    passport.authenticate('google', {
        session: true
    }), (req, res) => (
        res.redirect('/profile')
    )
);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);
            return next(err);
        }

        if(info){
            return res.status(401).send(info.message);
        }
        return req.login(user, { session : false } , async(loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            const token = await sign(user);
            return res.status(200).json({
                message : 'logged in successfully',
                token,
            });
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
        const existUser = await User.findOne({
            where : {
                email : req.body.email,
            }
        });
        
        if(existUser){
            return res.status(403).send('이미 사용중인 아이디입니다.')
        }

        await signUpUser({ email : req.body.email, nickname : req.body.nickname, password: req.body.password });
        res.status(201).send({ email : req.body.email, nickname : req.body.nickname, password: req.body.password });
    }catch(err){
        console.error(err);
        next(err)
    }
})

export default router;