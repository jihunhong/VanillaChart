import { Request } from "express";
import bcrypt from 'bcrypt';

export async function signUpUser( req: Request ) {
    try{
        const hashPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hashPassword
        })
    }catch(err){
        throw err;
    }
}