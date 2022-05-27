import { mappingAlbumDetail, mappingArtistAlbums } from './../lib/imgix';
import express from 'express';
import moment from 'moment';
import { Chart, Music, Video, Album } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/tracks/:album_id', async(req, res, next) => {
    try{
        const tracks = await Album.findOne({
            where : {
                id: req.params.album_id
            },
            include: [
                {
                    model: Music,
                    attributes : [
                        'title',
                        'artistName',
                        'lead',
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
        })
        res.json(mappingAlbumDetail(tracks));
    }catch(err){
        console.error(err);
    }
})

router.get('/:album_id', async(req, res, next) => {
    try{
        const albums = await Album.findAll({
            where : {
                id : req.params.album_id,
            }
        })
        res.status(200).send(albums);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/artist/:artistName', async(req, res, next) => {
    try{
        const albums = await Album.findAll({
            where : {
                artistName : req.params.artistName,
            },
            group: 'albumName',
            order : [
                ['releaseDate', 'DESC']
            ],
        })
        res.status(200).send(mappingArtistAlbums(albums));
    }catch(err){
        console.error(err);
        next(err);
    }
})


export default router;