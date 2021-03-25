import jwt from 'jsonwebtoken';

export const sign = (user: { id: number, email: string, nickname: string }) => {
    const secret = process.env.SECRET_KEY;
    return new Promise((res, rej) => {
        jwt.sign(user, secret, {
            expiresIn : '1d',
            issuer : 'cherrychart.com',
            subject : 'user-info'
        }, (err, token) => {
            if(err) rej(err);
            res(token)
        })
    })
}