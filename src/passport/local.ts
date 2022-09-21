import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { Music, Playlist, User } from '../models';

passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async(email, password, done) => {
    try{
        const user = await User.findOne({
            where: { email },
            raw: true
        });
        if(!user) {
            return done(null, false, { message: '존재하지 않는 이메일입니다.' });
        }
        const result = await bcrypt.compare(password, user.password);
        if(result) {
            return done(null, user);
        }
        return done(null, false, { message: '비밀번호를 확인해주세요' });
    }catch(err){
        return done(err, false);
    }
}))

passport.serializeUser((user, done) => {
    console.log('Serialize User : ', user);노
    done(null, user.id);
})

passport.deserializeUser(async(id, done) => {
    try {
        // 유저 정보와 함께 playlistId만 가져오기
        const user = await User.findOne({ 
            where : { 
                id
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
            ],
        });
        done(null, user);
    }catch(err){
        console.error('Error Deserialize', err);
        done(err, null);
    }
})