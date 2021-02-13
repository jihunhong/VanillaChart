import { Request } from "express";
import bcrypt from 'bcrypt';
import { User } from "../models";

export async function signUpUser({ email, nickname, password } : { email: string, nickname: string, password: string }) {
    try{
        const hashPassword = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nickname,
            password : hashPassword
        })
    }catch(err){
        throw err;
    }
}