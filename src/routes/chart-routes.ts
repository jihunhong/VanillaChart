import express from 'express';
import prisma from '../config/db';
import moment from 'moment';

const router = express.Router();

router.get('/:chart', async(req, res, next) => {

    try{
        const chart = await prisma.charts.findMany({
            where : {
                site : {
                    equals : req.params.chart,
                },
                updatedAt : {
                    gte : moment().format('YYYY-MM-DD'),
                    lt : moment().add(1, 'days').format('YYYY-MM-DD'),
                }
            }
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
        const chart = await prisma.charts.findMany({
            where : {
                site : req.params.chart,
                createdAt : {
                    gte : moment(req.params.date).format('YYYY-MM-DDTHH:mm:ss'),
                    lt : moment(req.params.date).add(1, 'days').format('YYYY-MM-DDT00:00:00'),
                }
            }
        })
        res.status(200).send(chart);
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/:chart/:rank',  async(req, res, next) => {
    
    try{
        const result = await prisma.charts.findMany({
            where : {
                site : {
                    equals : req.params.chart,
                },
                updatedAt : {
                    gte : moment().format('YYYY-MM-DD'),
                    lt : moment().add(1, 'days').format('YYYY-MM-DD'),
                },
                rank : {
                    equals : req.params.rank as unknown as number
                }
            }
        })
        res.status(200).send(result);
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;