import express from 'express';
import passport from 'passport';
import { signUpUser } from '../controller/userController';
import { User } from '../models';
import { sign } from '../lib';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post('/', async(req, res, next) => {
    try{
        const { accessToken } = req.body;
        console.log(accessToken);
        client.setCredentials({ access_token: accessToken });
        const response = await client.request({ url : `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&key=${process.env.YOUTUBE_API_KEY}` });
        console.log(response);
        res.status(200).send(response.data);
    }catch(err){
        console.error(err);
        next(err);
    }
});

export default router;