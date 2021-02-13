import { Request } from "express";
import bcrypt from 'bcrypt';
import prisma from "../config/db";

export async function signUpUser({ email, nickname, password } : { email: string, nickname: string, password: string }) {
    try{
        const hashPassword = await bcrypt.hash(password, 12);
        await prisma.users.create({
            data : {
                email,
                nickname,
                password : hashPassword
            }
        })
    }catch(err){
        throw err;
    }
}