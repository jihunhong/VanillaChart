import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares';

const router = express.Router();

router.get('/google/login',
    passport.authenticate('google', {
        accessType: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtubepartner'
        ],
    })
);

router.get('/google/user', (req, res) => {
    res.json(req.user);
})

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000/login/success',
        failureMessage: 'Cannot login to Google, please try again later',
        failureRedirect: 'http://localhost:3000/login/error'
    }), (req, res) => {
        console.log('User: ', req.user);
        res.send('Thank you for siginning in');
    }
);

export default router;