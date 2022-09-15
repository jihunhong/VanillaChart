import express from 'express';
import { signUpUser } from '../controller/userController';
import { User } from '../models';

const router = express.Router();

router.post('/signup', async(req, res, next) => {
    try {
        const existUser = await User.findOne({ 
            where : {
                email: req.body.email
            }
         })
         if(existUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
         }
        const newUser = await signUpUser({ email: req.body.email, password: req.body.password, nickname: req.body.nickname });
        res.status(201).send(newUser);
    } catch(err) {
        console.error(err);
        next(err);
    }
})


export default router;