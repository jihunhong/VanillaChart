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
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const imgix_1 = require("./../lib/imgix");
const router = express_1.default.Router();
router.get('/updated', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield models_1.Music.findAll({
            include: [
                {
                    model: models_1.Album,
                    attributes: [
                        ['id', 'albumId']
                    ],
                },
                {
                    model: models_1.Video,
                    attributes: [
                        'videoId'
                    ]
                }
            ],
            group: ['albumId'],
            order: [
                ['updatedAt', 'DESC']
            ],
            limit: 320
        });
        res.json(imgix_1.mappingSongs(songs));
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.patch('/like', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const song = yield models_1.Music.findOne({
            where: {
                id: req.body.id,
            }
        });
        if (!song) {
            return res.status(403).send('해당 트랙이 존재하지 않습니다.');
        }
        yield song.addLiker((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        res.status(200).json({ songId: song.id, id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.delete('/unlike', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const song = yield models_1.Music.findOne({
            where: {
                id: req.body.id,
            }
        });
        if (!song) {
            return res.status(403).send('해당 트랙이 존재하지 않습니다.');
        }
        yield song.removeLiker((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
        res.status(200).json({ songId: song.id, id: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=song-routes.js.map