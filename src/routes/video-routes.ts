import { mappingChartCover } from './../lib/imgix';
import express from 'express';
import { Music, Video, Sequelize, Album } from '../models';

const router = express.Router();

router.get('/updated', async(req, res, next) => {
    try{
        const vidoes = await Video.findAll({
            where : {
            },
            include: [
                {
                    model: Music,
                    attributes : [
                        'title',
                        'artistName',
                        'lead',
                        'albumName'
                    ],
                    include: [
                        {
                            model: Album,
                            attributes: [
                                ['id', 'albumId']
                            ]
                        }
                    ]
                }
            ],
            group: ['albumId'],
            order: [
                ['updatedAt', 'DESC']
            ],
            limit: 12
        })
        res.json(mappingChartCover(vidoes));
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;