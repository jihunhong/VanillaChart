import express from 'express';
import { isAuthenticated } from '../middlewares';
import { Album, Music, Video } from '../models';
import { mappingSongs } from './../lib/imgix';

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

router.patch('/like', isAuthenticated, async(req, res, next) => {
    try{
        const song = await Music.findOne({
            where: {
                id: req.body.id,
            }
        })
        if(!song) {
            return res.status(403).send('해당 트랙이 존재하지 않습니다.');
        }
        await song.addLiker(req.user?.id);
        res.status(200).json({ songId: song.id, id: req.user?.id });
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.delete('/unlike', isAuthenticated, async(req, res, next) => {
    try{
        const song = await Music.findOne({
            where: {
                id: req.body.id,
            }
        })
        if(!song) {
            return res.status(403).send('해당 트랙이 존재하지 않습니다.');
        }
        await song.removeLiker(req.user?.id);
        res.status(200).json({ songId: song.id, id: req.user?.id });
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;