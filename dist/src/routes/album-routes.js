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
const models_1 = require("../models");
const router = express_1.default.Router();
router.get('/tracks/:album_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tracks = yield models_1.Album.findOne({
            where: {
                id: req.params.album_id
            },
            include: [
                {
                    model: models_1.Music,
                    attributes: [
                        'title',
                        'artist',
                        'lead',
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
            ]
        });
        res.json(tracks);
    }
    catch (err) {
        console.error(err);
    }
}));
router.get('/:album_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = router;
//# sourceMappingURL=album-routes.js.map