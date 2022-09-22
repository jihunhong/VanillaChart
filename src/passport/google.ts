import moment from 'moment';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { Music, Playlist, User } from '../models';

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:8080/api/oauth/google/callback",
    passReqToCallback: true,
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
}, async(req, accessToken, refreshToken, params, profile, done) => {
    try{
        const existUser = await User.findOne({
            where: {
                oauth_id : profile?.id
            },
            raw: true
        });
        if(existUser) {
            return done(null, existUser);
        }
        console.log('Creating new user : ', profile.id);

        const newUser = await User.create({
            email: profile?.emails[0].value,
            nickname: profile?.displayName,
            oauth_id: profile?.id,
            accessToken,
            refreshToken,
            picture: profile?.picture,
            expire: moment().add(params.expires_in, 's').format('x')
        });
        return done(null, newUser?.dataValues);
    }catch(err){
        return done(err, false);
    }
}))

passport.serializeUser((user, done) => {
    console.log('Serialize User : ', user?.id);
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