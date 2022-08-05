"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const imgix_1 = require("../lib/imgix");
const router = express_1.default.Router();
router.get('/album/:album_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const albums = yield models_1.Album.findAll({
            where: {
                id: req.params.album_id,
            }
        });
        res.status(200).send(albums);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.get('/:site', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chart = yield models_1.Chart.findAll({
            attributes: [
                'rank',
            ],
            where: {
                site: req.params.site,
                updatedAt: {
                    [sequelize_1.Op.gte]: moment_1.default().format('YYYY-MM-DD 00:00:00'),
                    [sequelize_1.Op.lt]: moment_1.default().format('YYYY-MM-DD 23:59:59'),
                }
            },
            include: [
                {
                    model: models_1.Music,
                    attributes: [
                        'id',
                        'title',
                        'artistName',
                        'albumName',
                        'albumId',
                    ],
                    include: [
                        {
                            model: models_1.Video,
                            attributes: [
                                'videoId'
                            ]
                        }
                    ]
                },
            ],
            order: [
                ['rank', 'ASC']
            ],
            group: ['rank'],
        });
        const json = imgix_1.mappingChartCover(chart);
        res.status(200).send(json);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.get('/:chart/:date', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // dateFormat => 'YYYY-MM-DDTHH:mm:ss'
    try {
        const chart = yield models_1.Chart.findAll({
            where: {
                site: req.params.chart,
                createdAt: {
                    [sequelize_1.Op.gte]: moment_1.default(req.params.date).format('YYYY-MM-DDTHH:mm:ss'),
                    [sequelize_1.Op.lt]: moment_1.default(req.params.date).add(1, 'days').format('YYYY-MM-DDT00:00:00'),
                }
            },
            include: [
                {
                    model: models_1.Music,
                    attributes: [
                        'title',
                        'artistName',
                        'albumName',
                        'albumId'
                    ],
                    include: [
                        {
                            model: models_1.Video,
                            attributes: [
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
        });
        const json = imgix_1.mappingChartCover(chart);
        res.status(200).send(chart);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.get('/:chart/:rank', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chart = yield models_1.Chart.findAll({
            attributes: [
                'rank'
            ],
            where: {
                site: req.params.site,
                updatedAt: {
                    [sequelize_1.Op.gte]: moment_1.default().format('YYYY-MM-DD 00:00:00'),
                    [sequelize_1.Op.lt]: moment_1.default().add(1, 'days').format('YYYY-MM-DD'),
                }
            },
            include: [
                {
                    model: models_1.Music,
                    attributes: [
                        'title',
                        'artistName',
                        'albumName',
                    ],
                    where: {
                        rank: req.params.rank
                    },
                    include: [
                        {
                            model: models_1.Video,
                            attributes: [
                                'videoId'
                            ]
                        }
                    ]
                }
            ],
            order: [
                ['rank', 'ASC']
            ]
        });
        const json = imgix_1.mappingChartCover(chart);
        res.status(200).send(json);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=chart-routes.js.map