import passport from 'passport';
import { localStrategy } from './local';

export function passportConfig() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    
    passport.deserializeUser(async(id, done) => {
        try{
            const user = await User.findOne({ where : { id }});
            done(null, user)
        }catch(error){
            console.error(error);
            done(error);
        }
    })
    
    localStrategy();
}