import express from 'express';
import moment from 'moment';
import { Chart, Music, Video, Album } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/artists/:site', async(req, res, next) => {
    try{
        const artists = await Chart.findAll({
            where : {
                site : req.params.site,
                updatedAt : {
                    [Op.gte] : moment().format('YYYY-MM-DD 00:00:00'),
                    [Op.lt] : moment().add(1, 'days').format('YYYY-MM-DD'),
                }
            },
            group : ['artists']
        })
        res.status(200).send(artists);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/album/:album_id', async(req, res, next) => {
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

router.get('/:site', async(req, res, next) => {

    try{
        const chart = await Chart.findAll({
            attributes : [
              'rank',
            ],
            where : {
                site : req.params.site,
                updatedAt : {
                    [Op.gte] : moment().format('YYYY-MM-DD 00:00:00'),
                    [Op.lt] : moment().add(1, 'days').format('YYYY-MM-DD'),
                }
            },
            include : [
                {
                    model : Music,
                    attributes : [
                        'title',
                        'artist',
                        'album',
                        'AlbumId'
                    ],
                    include : [
                        {
                            model : Video,
                            attributes : [
                                'videoId'
                            ]
                        }
                    ]
                },
            ],
            order : [
                ['rank', 'ASC']
            ]
        })
        res.status(200).send(chart);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/:chart/:date', async(req, res, next) => {
    // dateFormat => 'YYYY-MM-DDTHH:mm:ss'

    try{
        const chart = await Chart.findAll({
            where : {
                site : req.params.chart,
                createdAt : {
                    [Op.gte] : moment(req.params.date).format('YYYY-MM-DDTHH:mm:ss'),
                    [Op.lt] : moment(req.params.date).add(1, 'days').format('YYYY-MM-DDT00:00:00'),
                }
            },
            include : [
                {
                    model : Music,
                    attributes : [
                        'title',
                        'artist',
                        'album',
                    ],
                    include : [
                        {
                            model : Video,
                            attributes : [
                                'videoId'
                            ]
                        }
                    ]
                }
            ]
        })
        res.status(200).send(chart);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/:chart/:rank',  async(req, res, next) => {
    
    try{
        const chart = await Chart.findAll({
            attributes : [
              'rank'
            ],
            where : {
                site : req.params.site,
                updatedAt : {
                    [Op.gte] : moment().format('YYYY-MM-DD 00:00:00'),
                    [Op.lt] : moment().add(1, 'days').format('YYYY-MM-DD'),
                }
            },
            include : [
                {
                    model : Music,
                    attributes : [
                        'title',
                        'artist',
                        'album',
                    ],
                    where : {
                        rank : req.params.rank
                    },
                    include : [
                        {
                            model : Video,
                            attributes : [
                                'videoId'
                            ]
                        }
                    ]
                }
            ],
            order : [
                ['rank', 'ASC']
            ]
        })
        res.status(200).send(chart);
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;