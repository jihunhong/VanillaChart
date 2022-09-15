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
const imgix_1 = require("../lib/imgix");
const models_1 = require("../models");
const router = express_1.default.Router();
router.get('/preview', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield models_1.Playlist.findOne({
            where: { pId: req.query.pId },
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
                                'albumName'
                            ]
                        }
                    ]
                },
                {
                    model: models_1.User,
                    attributes: [
                        'nickname'
                    ]
                }
            ],
        });
        res.status(200).send(imgix_1.mappingPlaylistPreview(playlist === null || playlist === void 0 ? void 0 : playlist.dataValues));
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.get('/:pId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield models_1.Playlist.findOne({
            where: { pId: req.params.pId },
            include: [
                {
                    model: models_1.PlaylistItems,
                    include: [
                        {
                            model: models_1.Music
                        }
                    ]
                }
            ]
        });
        res.status(200).send(playlist);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=playlist-routes.js.map