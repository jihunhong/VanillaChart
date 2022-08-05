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
const oauthValidator_1 = require("../middlewares/oauthValidator");
const models_1 = require("../models");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.get('/playlist/list', middlewares_1.isAuthenticated, oauthValidator_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield oauthValidator_1.oauth2Client.request({
            url: 'https://www.googleapis.com/youtube/v3/playlists',
            params: {
                key: process.env.YOUTUBE_API_KEY,
                mine: 'true',
                part: 'snippet',
            }
        });
        res.status(200).send((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.items);
    }
    catch (err) {
        res.send(err);
    }
}));
router.post('/playlist', middlewares_1.isAuthenticated, oauthValidator_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const newList = yield models_1.Playlist.create({
            pId: uuid_1.v4(),
            title: req.body.title,
            description: req.body.description,
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            private: req.body.private || 0
        });
        if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.items) {
            const { items } = req.body;
            for (const [order, id] of items.entries()) {
                yield models_1.PlaylistItems.create({
                    playlistPId: newList === null || newList === void 0 ? void 0 : newList.pId,
                    musicId: id,
                    order
                });
            }
        }
        const response = yield models_1.Playlist.findOne({
            where: {
                pId: newList === null || newList === void 0 ? void 0 : newList.pId,
            },
            include: [
                {
                    model: models_1.PlaylistItems,
                    attributes: [
                        'musicId'
                    ],
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
                    ]
                }
            ]
        });
        res.status(200).send(response.dataValues);
    }
    catch (err) {
        res.send(err);
    }
}));
exports.default = router;
//# sourceMappingURL=youtube-routes.js.map