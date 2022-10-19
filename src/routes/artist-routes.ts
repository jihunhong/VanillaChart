import express from 'express';
import moment from 'moment';
import { fn, Op, col } from 'sequelize';
import { favoriteArtistArrange } from '../lib/arrange';
import { Artist, Chart, Music, Playlist, PlaylistItems, Sequelize } from '../models';
import { IMGIX_URL } from './../config/variables';

const router = express.Router();


router.get('/favorite', async(req, res, next) => {
    try {
        const artists = await Playlist.findOne({
            where : {
                userId: req.query.userId
            },
            include: [{
                model: PlaylistItems,
                include: [{
                    model : Music,
                    attributes: [
                        'artistName'
                    ],
                }]
            }]
        })
        res.json(favoriteArtistArrange(artists));
    }catch(err){
        console.error(err);
        next(err)
    }
})

router.get('/:site', async(req, res, next) => {
    try{
        const artists = await Chart.findAll({
            attributes: [
                'rank'
            ],
            where : {
                site : req.params.site,
                updatedAt : {
                    [Op.gte] : moment().format('YYYY-MM-DD 00:00:00'),
                    [Op.lt] : moment().format('YYYY-MM-DD 23:59:59'),
                }
            },
            include: [
                {
                    model: Music,
                    attributes : [
                        'title',
                        'albumName',
                        'albumId',
                        [fn('concat', `${IMGIX_URL}/artist-profile/`, col('artistId'), '.jpg?w=600&ar=1:1&fit=crop&auto=format'), 'middleArtistProfile']
                    ],
                    include: [
                        {
                            model: Artist,
                            attributes: ['id', 'artistName', 'profileImage']
                        }
                    ]
                },
                
            ],
            order: [
                ['rank', 'ASC']
            ],
            group : ['artistId']
        })
        res.status(200).send(artists);
    }catch(err){
        console.error(err);
        next(err);
    }
})


export default router;