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
exports.createYoutubeRows = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/search';
function search({ q }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.get(API_URL, {
                params: {
                    part: 'snippet',
                    q,
                    type: 'video',
                    key: KEY,
                }
            });
            return res.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
function arrange(items) {
    return items.map((v) => {
        return {
            title: v.snippet.title,
            videoId: v.id.videoId,
            description: v.snippet.description,
            publishedAt: v.snippet.publishedAt,
            thumbnail: v.snippet.thumbnails.high || v.snippet.thumbnails.medium || v.snippet.thumbnails.default,
            channelTitle: v.snippet.channelTitle,
            channelId: v.snippet.channelId,
        };
    });
}
function excuteSearch({ q }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { items } = yield search({ q });
            const matchedList = arrange(items);
            const exact = matchedList.find((v) => {
                return v.title.includes('MV') && v.videoId;
            });
            return exact || matchedList.find((v) => v.videoId);
        }
        catch (err) {
            console.error(err);
        }
    });
}
function createYoutubeRows() {
    return __awaiter(this, void 0, void 0, function* () {
        const chartData = yield models_1.Chart.findAll({
            attributes: [
                'rank'
            ],
            raw: true,
            include: [
                {
                    model: models_1.Music,
                    attributes: [
                        'id',
                        'title',
                        'artist',
                        'album',
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
            group: ['Music.id'],
            order: [
                ['rank', 'ASC']
            ]
        });
        try {
            for (const el of chartData) {
                const exist = yield models_1.Video.findOne({
                    where: {
                        MusicId: el["Music.id"]
                    }
                });
                if (!exist) {
                    console.log(`not exist element. start to youtube matching job : ${el["Music.title"]}`);
                    const youtubeSnippet = yield excuteSearch({ q: `${el["Music.title"]} ${el["Music.artist"]}` });
                    if (!youtubeSnippet) {
                        console.log(`empty response! q : ${el["Music.title"]} ${el["Music.artist"]}`);
                        break;
                    }
                    yield models_1.Video.create({
                        MusicId: el["Music.id"],
                        videoId: youtubeSnippet.videoId
                    });
                }
            }
            // 차트 내에 존재하는 데이터 부터 검색 시작
            // 할당량이 남아있다면 최근 추가된 앨범의 데이터부터 차례로 검색 시작
            const recentMusics = yield models_1.Music.findAll({
                order: [
                    ['createdAt']
                ]
            });
            for (const el of recentMusics) {
                const exist = yield models_1.Video.findOne({
                    where: {
                        id: el.id
                    }
                });
                if (!exist) {
                    const youtubeSnippet = yield excuteSearch({ q: `${el.title} ${el.artist}` });
                    if (!youtubeSnippet) {
                        break;
                    }
                    yield models_1.Video.create({
                        MusicId: el.id,
                        videoId: youtubeSnippet.videoId
                    });
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.createYoutubeRows = createYoutubeRows;
//# sourceMappingURL=youtubeMatch.js.map