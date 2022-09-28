import express from 'express';
import moment from 'moment';
import { Op } from 'sequelize';
import { mappingChartCover } from '../lib/imgix';
import { Album, Artist, Chart, Music, User, Video } from '../models';

const router = express.Router();

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
                    [Op.lt] : moment().format('YYYY-MM-DD 23:59:59'),
                }
            },
            include : [
                {
                    model : Music,
                    attributes : [
                        'id',
                        'title',
                        'artistName',
                        'albumName',
                        'albumId',
                        'artistId'
                    ],
                    include : [
                        {
                            model: Artist,
                            attributes: [
                                'artistName'
                            ]
                        },
                        {
                            model : Video,
                            attributes : [
                                'videoId' 
                            ]
                        },
                        {
                            model: User,
                            as: 'liker',
                            attributes: [
                                'id'
                            ],
                            through: {
                                attributes: []
                            }     
                        }
                    ]
                },
            ],
            order : [
                ['rank', 'ASC']
            ],
            group: ['rank'],
        })
        const json = mappingChartCover(chart);
        res.status(200).send(json);
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
                        'artistName',
                        'albumName',
                        'albumId'
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
            ],
            order: [
                ['rank', 'ASC']
            ],
            group: ['rank']
        })
        const json = mappingChartCover(chart);
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
                        'artistName',
                        'albumName',
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
        const json = mappingChartCover(chart);
        res.status(200).send(json);
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;