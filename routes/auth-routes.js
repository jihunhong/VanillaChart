const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req,  res) => {
    res.render('login');
})


// auth logout
router.get('/logout', (req, res) => {

    // handle with passport
    res.send('logging out');
})

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['youtube']
}))

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the callback URL')
})


module.exports = router;