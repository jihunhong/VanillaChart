const { User } = require('../models');

exports.signUpUser = async( req ) => {
    try{
        const hashPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hashPassword
        })
    }catch(err){
        throw err;
    }
}