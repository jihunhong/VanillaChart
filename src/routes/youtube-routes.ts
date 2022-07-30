import express from 'express';
import { GaxiosResponse } from 'gaxios';
import { isAuthenticated } from '../middlewares';
import { checkToken, oauth2Client } from '../middlewares/oauthValidator';

const router = express.Router();

router.get('/playlist/list', isAuthenticated, checkToken, async(req, res) => {
    try{
        const response: GaxiosResponse = await oauth2Client.request({
            url: 'https://www.googleapis.com/youtube/v3/playlists',
            params: {
                key: process.env.YOUTUBE_API_KEY,
                mine: 'true',
                part: 'snippet',

            }
        })
        res.status(200).send(response?.data?.items);
    }catch(err){
        res.send(err);
    }
});

export default router;