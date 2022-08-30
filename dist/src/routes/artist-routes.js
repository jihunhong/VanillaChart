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
const sequelize_1 = require("sequelize");
const arragne_1 = require("../lib/arragne");
const models_1 = require("../models");
const variables_1 = require("./../config/variables");
const router = express_1.default.Router();
router.get('/favorite', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artists = yield models_1.Playlist.findOne({
            where: {
                userId: req.query.userId
            },
            include: [{
                    model: models_1.PlaylistItems,
                    include: [{
                            model: models_1.Music,
                            attributes: [
                                'artistName'
                            ],
                        }]
                }]
        });
        res.json(arragne_1.favoriteArtistArrange(artists));
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.get('/:site', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artists = yield models_1.Chart.findAll({
            attributes: [
                'rank'
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
                        'title',
                        'artistName',
                        'albumName',
                        'albumId',
                        [sequelize_1.fn('concat', `${variables_1.IMGIX_URL}/artist-profile/`, sequelize_1.col('artistName'), '.jpg?w=600&ar=1:1&fit=crop&auto=format'), 'middleArtistProfile']
                    ],
                }
            ],
            order: [
                ['rank', 'ASC']
            ],
            group: ['artistName']
        });
        res.status(200).send(artists);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=artist-routes.js.map