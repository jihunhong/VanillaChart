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
const imgix_1 = require("./../lib/imgix");
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const router = express_1.default.Router();
router.get('/updated', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vidoes = yield models_1.Video.findAll({
            where: {},
            include: [
                {
                    model: models_1.Music,
                    attributes: [
                        'title',
                        'artistName',
                        'lead',
                        'albumName'
                    ],
                    include: [
                        {
                            model: models_1.Album,
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
        });
        res.json(imgix_1.mappingChartCover(vidoes));
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=video-routes.js.map