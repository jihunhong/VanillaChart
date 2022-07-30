import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/playlist/list', (req, res) => {
    try{
        
    }
});

router.get('/google/user', isAuthenticated, (req, res) => {
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