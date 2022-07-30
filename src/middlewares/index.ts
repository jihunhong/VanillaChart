import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(req.user) {
        next();
    }else{
        res.status(401).send('You must login first');
    }
}