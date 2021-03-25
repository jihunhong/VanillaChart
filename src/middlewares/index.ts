import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const jwtAuth  = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if(!token){
        return res.status(403).json({
            result : 'fail',
            message : 'this request is not containning jwt token.'
        })
    }

    try{
        const decoded = await verify(<string>token);
        req.decoded = <any>decoded
        next();
    }catch (error) {
        res.json({
            result : 'fail',
            message : error.message
        })
    }
}

const verify = (token: string) => {
    const secret = process.env.SECRET_KEY;
    return new Promise((res, rej) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) rej(err);
            res(decoded);
        })
    })
}

