"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ftsMatchingJob = exports.imageDownload = exports.fullTextSearch = exports.insertChart = exports.launchBrowser = exports.waitor = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const models_1 = __importStar(require("../models"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const genieCrawl_1 = require("./genieCrawl");
const melonCrawl_1 = require("./melonCrawl");
const bugsCrawl_1 = require("./bugsCrawl");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const s3 = new aws_sdk_1.default.S3({ accessKeyId: process.env.AWS_ACCES_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
models_1.default.sequelize.sync()
    .then(() => {
    console.log('sequelize connected');
})
    .catch((err) => {
    console.error(err);
});
const MIN_MATCH_SCORE = 9;
exports.waitor = {
    waitUntil: "networkidle2"
};
function launchBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_extra_1.default.launch({
            headless: process.env.NODE_ENV === 'production'
        });
        const page = yield browser.newPage();
        return { browser, page };
    });
}
exports.launchBrowser = launchBrowser;
// export async function albumInsert({ page, site, chart } : { page: Page ,site : siteName, chart : Array<ChartData> }) {
//     for(const row of chart){
//         const albumInfo = await getAlbumInfo({ page, albumId: row.album_id });
//         const res = await Album.findAndUpdate({
//             where : {
//                 albumName: albumInfo.albumName,
//                 artist: albumInfo.artist,
//                 releaseDate: albumInfo.releaseDate
//             },
//             raw : true
//         });
//         for(const single of albumInfo.tracks){
//             await Music.findOrCreate({
//                 where : {
//                     title: single.track,
//                     artist: row.artist,
//                     album: row.album,
//                     lead:  single.lead,
//                     AlbumId: res.id
//                 }
//             })
//         }
//     }
// }
function getAlbumInfo({ page, site, albumId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const func = {
            'melon': melonCrawl_1.fetchAlbumInfo,
            'genie': genieCrawl_1.fetchAlbumInfo,
            'bugs': bugsCrawl_1.fetchAlbumInfo
        };
        const targetFunction = func[site];
        return targetFunction({ page, albumId });
    });
}
function insertChart({ page, site, chart }) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of chart) {
            if (row.matched) {
                yield models_1.Chart.findOrCreate({
                    where: {
                        rank: row.rank,
                        site,
                        MusicId: row.id
                    }
                });
                continue;
            }
            const albumInfo = yield getAlbumInfo({ page, site, albumId: row.album_id });
            yield models_1.Album.findOrCreate({
                where: {
                    id: Number(row.album_id),
                    artist: row.artist,
                    album: row.album,
                    site,
                    releaseDate: albumInfo.releaseDate
                }
            });
            for (const music of albumInfo.tracks) {
                const res = yield models_1.Music.findOrCreate({
                    where: {
                        title: music.track,
                        artist: row.artist,
                        album: row.album,
                        AlbumId: Number(row.album_id),
                        lead: Boolean(music.lead)
                    },
                    raw: true
                });
                if (row.title === music.track) {
                    yield models_1.Chart.findOrCreate({
                        where: {
                            rank: row.rank,
                            site,
                            MusicId: res[0].id || res[0].dataValues.id,
                        }
                    });
                }
                else {
                    console.log(row.title);
                    console.log(music.track + '\n');
                }
            }
            yield imageDownload({ url: row.image, music: row, site });
        }
    });
}
exports.insertChart = insertChart;
function fullTextSearch(element) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const matchedList = yield models_1.sequelize.query(`
            SELECT *, match(title, artist) against( ? ) as score 
            FROM Music 
            WHERE match(title, artist) against( ? ) AND 
                id IN (
                    SELECT MusicId
                    FROM Charts
                    WHERE site = 'genie'
                )
            ORDER BY score desc
            LIMIT 5;`, {
                replacements: [`${element.title} ${element.artist}`, `${element.title} ${element.artist}`],
                type: models_1.sequelize.QueryTypes.SELECT
            });
            if (matchedList.length > 0) {
                if (matchedList[0].score > MIN_MATCH_SCORE) {
                    console.log(`✔ '${element.title} - ${element.artist}' matched '${matchedList[0].title} - ${matchedList[0].artist}' `);
                    return Object.assign(Object.assign(Object.assign({}, element), matchedList[0]), { matched: true });
                }
                else {
                    if ((element.title.includes(matchedList[0].title) && element.artist.includes(matchedList[0].artist))
                        ||
                            matchedList[0].title.includes(element.title) && matchedList[0].artist.includes(element.artist)) {
                        console.warn(`💫 '${element.title} - ${element.artist}' can not matched max score => ${matchedList[0].title} - ${matchedList[0].artist} : ${matchedList[0].score} `);
                        return Object.assign(Object.assign(Object.assign({}, element), matchedList[0]), { matched: true });
                    }
                    console.error(`❌ '${element.title} - ${element.artist}' not found `);
                    return Object.assign({}, element);
                }
            }
            else {
                console.error(`❌ '${element.title} - ${element.artist}' not found `);
                return element;
            }
        }
        catch (err) {
            console.error(err);
            return element;
        }
    });
}
exports.fullTextSearch = fullTextSearch;
function download({ targetPath, url }) {
    return __awaiter(this, void 0, void 0, function* () {
        const writer = fs_1.default.createWriteStream(targetPath);
        const response = yield axios_1.default({
            url,
            method: 'GET',
            responseType: 'stream'
        });
        response.data.pipe(writer);
        return new Promise((res, rej) => {
            writer.on('finish', res);
            writer.on('error', rej);
        });
    });
}
function uploadS3({ targetPath, music }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync(targetPath);
        const params = {
            Bucket: 'cherrychart.resources',
            Key: `${music.album.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`,
            Body: fileContent
        };
        return new Promise((res, rej) => {
            s3.upload(params, (err, data) => {
                if (err)
                    rej(err);
                console.log(`File uploaded Successfully at ${data.Location}`);
                res(data);
            });
        });
    });
}
function imageDownload({ url, site, music }) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetPath = path_1.default.join(__dirname, `../../covers/${music.album.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`);
        const coverDir = path_1.default.join(__dirname, `../../covers`);
        const exist = fs_1.default.existsSync(coverDir);
        if (!exist) {
            fs_1.default.mkdirSync(coverDir);
        }
        if (!fs_1.default.existsSync(targetPath)) {
            yield download({ targetPath, url });
            yield uploadS3({ targetPath, music });
        }
    });
}
exports.imageDownload = imageDownload;
function ftsMatchingJob({ chart }) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = [];
        for (const el of chart) {
            const mapped = yield fullTextSearch(el);
            res.push(mapped);
        }
        return res;
    });
}
exports.ftsMatchingJob = ftsMatchingJob;
//# sourceMappingURL=crawlUtil.js.map