import express from 'express';
import passport from 'passport';
import { signUpUser } from '../controller/userController';
import { getId } from '../lib';
import { joinArrange } from '../lib/arrange';
import { isAuthenticated } from '../middlewares';
import { Music, Playlist, User } from '../models';

const router = express.Router();


router.get('/profile', isAuthenticated, (req, res) => {
    // my profile
    res.json(req.user);
})

router.post('/signup', async(req, res, next) => {
    try {
        const existUser = await User.findOne({
            where : {
                email: req.body.email
            }
         })
         if(existUser) {
            return res.status(403).send('이미 사용중인 이메일 입니다.');
         }
        const existNickname = await User.findOne({
            where: {
                nickname: req.body.nickname
            }
        })
        if(existNickname) {
            return res.status(403).send('이미 사용중인 닉네임 입니다.');
        }
        
        const newUser = await signUpUser({ email: req.body.email, password: req.body.password, nickname: req.body.nickname });
        res.status(201).send(newUser);
    } catch(err) {
        console.error(err);
        next(err);
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        if(info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, async(loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError)
            }
            const existUser = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: Playlist,
                        attributes: ['pId'],
                        as: 'playlists'
                    },
                    {
                        model: Music,
                        attributes: ['id'],
                        as: 'liked',
                    },
                    {
                        model: User,
                        attrbiutes: ['id'],
                        as: 'followings'
                    },
                    {
                        model: User,
                        attrbiutes: ['id'],
                        as: 'followers'
                    },
                ]
            });
            return res.status(200).json(joinArrange(existUser));
        });
    })(req, res, next);
});

router.post('/logout', isAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.session = null!;
        res.send('ok');
    });
    
})

router.patch('/follow', isAuthenticated, async(req, res, next) => {
    // add follower
    try {
        const targetUser = await User.findOne({ where: { id: req.body.userId }});
        if(!targetUser) {
            return res.status(403).send('존재하지 않는 유저입니다.');
        }
        await targetUser.addFollowers(req.user!.id);
        const followers = await targetUser.getFollowers();
        res.status(200).json(followers.map(getId));
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.delete('/unfollow', isAuthenticated, async(req, res, next) => {
    // remove follower
    try {
        const targetUser = await User.findOne({ where: { id: req.body.userId }});
        if(!targetUser) {
            return res.status(403).send('존재하지 않는 유저입니다.');
        }
        await targetUser.removeFollowers(req.user!.id);
        const followers = await targetUser.getFollowers();
        res.status(200).json(followers.map(getId));
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.get('/:id', async(req, res, next) => {
    try {
        const targetUser = await User.findOne({
            where: {
                id: parseInt(req.params.id)
            },
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Playlist,
                    attributes: ['pId'],
                    as: 'playlists'
                },
                {
                    model: Music,
                    attributes: ['id'],
                    as: 'liked',
                },
                {
                    model: User,
                    attrbiutes: ['id'],
                    as: 'followings'
                },
                {
                    model: User,
                    attrbiutes: ['id'],
                    as: 'followers'
                },
            ]
        })
        res.status(200).json(joinArrange(targetUser));
    }catch(err) {
        console.error(err);
        next(err);
    }
})


export default router;