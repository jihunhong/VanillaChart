import passport from 'passport';
import passportJWT from 'passport-jwt';
import { localStrategy } from './local';
import { User } from '../models';

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

export function passportConfig(){
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // authorization : Bearer <token>
        secretOrKey: process.env.SECRET_KEY,
    }, async(payload, done) => {
        try{
            const user = await User.findOne({
                where : {
                    email : payload.email
                },
                attributes: {
                    exclude: ['password'],
                },
                raw : true,
            });
            if(user){
                done(null, user);
                return;
            }
            done(null, false, { reason : 'invalid token...' });
        }catch(err){
            console.error(err);
            done(err);
        }
    }));

    localStrategy();
}