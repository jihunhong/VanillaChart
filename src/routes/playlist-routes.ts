import express from 'express';
import { mappingPlaylistPreview } from '../lib/imgix';
import { Music, Playlist, PlaylistItems } from '../models';

const router = express.Router();

router.get('/preview', async(req, res, next) => {
    try{
        const playlist = await Playlist.findOne({
            where : { pId : req.query.pId },
            include: [
                {
                    model: PlaylistItems,
                    attributes: [
                        'musicId'
                    ],
                    limit: 4,
                    include: [
                        {
                            model: Music,
                            attributes: [
                                'albumName'
                            ]
                        }
                    ]
                }
            ],
        })
        res.status(200).send(mappingPlaylistPreview(playlist?.dataValues));
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/:pId', async(req, res, next) => {
    try{
        const playlist = await Playlist.findOne({
            where : { pId : req.params.pId },
            include: [
                {
                    model: PlaylistItems,
                    include: [
                        {
                            model: Music
                        }
                    ]
                }
            ]
        })
        res.status(200).send(playlist);
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;