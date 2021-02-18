import express from 'express';
import moment from 'moment';
import { Chart } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/:chart', async(req, res, next) => {

    try{
        const chart = await Chart.findAll({
            where : {
                site : req.params.chart,
                updatedAt : {
                    [Op.gte] : moment().format('YYYY-MM-DD 00:00:00'),
                    [Op.lt] : moment().add(1, 'days').format('YYYY-MM-DD'),
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
        const chart = await Chart.findAll({
            where : {
                site : req.params.chart,
                createdAt : {
                    [Op.gte] : moment(req.params.date).format('YYYY-MM-DDTHH:mm:ss'),
                    [Op.lt] : moment(req.params.date).add(1, 'days').format('YYYY-MM-DDT00:00:00'),
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
        const result = await Chart.findAll({
            where : {
                site : req.params.chart,
                updatedAt : {
                    [Op.gte] : moment().format('YYYY-MM-DD'),
                    [Op.lt] : moment().add(1, 'days').format('YYYY-MM-DD'),
                },
                rank : req.params.rank as unknown as number
            }
        })
        res.status(200).send(result);
    }catch(err){
        console.error(err);
        next(err);
    }
})

export default router;