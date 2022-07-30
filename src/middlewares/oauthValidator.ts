import moment from 'moment';
import { Auth } from 'googleapis';
import { User } from '../models';

export const oauth2Client = new Auth.OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_CALLBACK
);


export const checkToken = async(req, res, next) => {
    oauth2Client.setCredentials({
        access_token: req.user.accessToken,
        refresh_token: req.user.refreshToken,
    })
    if(parseInt(moment().subtract(req.user.expire, 's').format('X')) > -300) {
        oauth2Client.refreshAccessToken(async(err, tokens) => {
            if(err) return next(err);
            const exist = await User.findOne({ where : { id: req.user.id } });
            if(exist) {
                await User.update({ 
                    ...exist, 
                    accessToken : tokens?.access_token,
                    refreshToken : tokens?.refresh_token,
                    expire: tokens?.expiry_date
                })
            }
            next();
        })
    }
    next();
}