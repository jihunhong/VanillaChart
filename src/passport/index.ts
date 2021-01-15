import passport from 'passport';
import { localStrategy } from './local';
import prisma from '../config/db';

export function passportConfig() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    
    passport.deserializeUser(async(id: number, done) => {
        try{
            const user = await prisma.users.findOne({ where : { id }});
            done(null, user!)
        }catch(error){
            console.error(error);
            done(error);
        }
    })
    
    localStrategy();
}