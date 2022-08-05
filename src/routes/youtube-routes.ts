import express from 'express';
import { GaxiosResponse } from 'gaxios';
import { isAuthenticated } from '../middlewares';
import { checkToken, oauth2Client } from '../middlewares/oauthValidator';
import { Music, Playlist, PlaylistItems, Video } from '../models';
import { v4 as uuidv4 } from 'uuid';

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

router.post('/playlist', isAuthenticated, checkToken, async(req, res) => {
    try{
        const newList =  await Playlist.create({
            pId: uuidv4(),
            title: req.body.title,
            description: req.body.description,
            userId: req.user?.id,
            private: req.body.private || 0
        });
        if(req.body?.items) {
            const { items } = req.body;
            for(const [order, id] of items.entries()) {
                await PlaylistItems.create({
                    playlistPId: newList?.pId,
                    musicId: id,
                    order
                })
            }
        }
        const response = await Playlist.findOne({
            where : {
                pId: newList?.pId,
            },
            include: [
                {
                    model: PlaylistItems,
                    attributes: [
                        'musicId'
                    ],
                    include: [
                        {
                            model: Music,
                            attributes: [
                                'title',
                                'artistName',
                                'albumName',
                                'albumId'
                            ],
                            include: [
                                {
                                    model: Video,
                                    attributes: [
                                        'videoId'
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })
        res.status(200).send(response.dataValues);
    }catch(err){
        res.send(err);
    }
})

export default router;