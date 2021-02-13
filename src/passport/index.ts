import passport from 'passport';
import { localStrategy } from './local';
import { User } from '../models';

export function passportConfig() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    
    passport.deserializeUser(async(id: number, done) => {
        try{
            const user = await User.findOne({ where : { id }});
            done(null, user!)
        }catch(error){
            console.error(error);
            done(error);
        }
    })
    
    localStrategy();
}