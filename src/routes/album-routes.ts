import express from 'express';
import { Album, Artist, Music, Video } from '../models';
import { mappingAlbumDetail, mappingArtistAlbums } from './../lib/imgix';

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
                        'albumName',
                        'artistName',
                        'lead',
                        'albumId'
                    ],
                    include: [
                        {
                            model: Video,
                            attributes: [
                                'videoId'
                            ]
                        },
                    ]
                },
                {
                    model: Artist,
                    attributes: ['artistName', 'profileImage']
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
                site: req.query.site,
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