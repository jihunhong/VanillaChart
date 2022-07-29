import passport from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { User } from '../models';

export function googlePassport() {
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:8080/api/user/auth/google/callback",
        passReqToCallback: true
    }, async(request, accessToken, refreshToken, profile, done) => {
        try{
            const existUser = await User.findOne({
                where: {
                    oauth_id : profile?.id
                }
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
                refreshToken: refreshToken || null
            })
            return done(null, newUser);
        }catch(err){
            return done(err, false);
        }
    }))
}