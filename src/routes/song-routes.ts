import { mappingSongs } from './../lib/imgix';
import express from 'express';
import { Music, Video, Sequelize, Album } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/updated', async(req, res, next) => {
    try{
        const songs = await Music.findAll({
            include: [
                {
                    model: Album,
                    attributes : [
                        ['id', 'albumId']
                    ],
                    
                },
                {
                    model: Video,
                    attributes: [
                        'videoId'
                    ]
                }
            ],
            group: ['albumId'],
            order: [
                ['updatedAt', 'DESC']
            ],
            limit: 320
        })
        res.json(mappingSongs(songs));
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;