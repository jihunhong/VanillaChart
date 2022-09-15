import bcrypt from 'bcrypt';
import { IMGIX_URL } from '../config/variables';
import { User } from "../models";

export async function signUpUser({ email, nickname, password } : { email: string, nickname: string, password: string }) {
    try{
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email,
            nickname,
            password : hashPassword,
            picture: `${IMGIX_URL}/static/example-user-avatar.png?w=256&ar=1:1&auto=format`
        })
        return {
            ...newUser,
            password: null,
        };
    }catch(err){
        throw err;
    }
}