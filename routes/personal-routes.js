const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        // not logged in
        res.redirect('/auth/google');
    }else{
        next();
    }
}

router.get('/', authCheck, (req, res) => {
    res.send('Hi ! ' + req.user.username);
})

module.exports = router;