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
// export async function insertChart({ site, chart } : { site : siteName, chart : Array<ChartData> }) {
//     for(const row of chart){
//         const res = await Music.findOrCreate({
//             where : {
//                 title : row.title,
//                 artist : row.artist,
//                 album : row.album
//             },
//             raw : true
//         })
//         await Chart.create({
//             rank : row.rank,
//             site,
//             MusicId : res[0].id,
//         })
//         await imageDownload({ url : row.image!, music : row, site });
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
                // 매칭이 됐다면 앨범정보, 음원 정보 모두 이미 있다는 말이다.
                yield models_1.Chart.create({
                    rank: row.rank,
                    site,
                    MusicId: row.id
                });
                continue;
            }
            // 매칭이 되지 않은 경우
            const albumInfoExist = yield models_1.Album.findOne({
                where: {
                    id: row.album_id
                }
            });
            if (!albumInfoExist) {
                const albumInfo = yield getAlbumInfo({ page, site, albumId: row.album_id });
                const { tracks } = albumInfo;
                const album = yield models_1.Album.findOrCreate({
                    where: {
                        album: row.album,
                        artist: row.artist,
                        releaseDate: albumInfo.releaseDate,
                        site,
                    }
                });
                for (const element of tracks) {
                    const res = yield models_1.Music.findOrCreate({
                        where: {
                            title: element.track,
                            artist: row.artist,
                            album: row.album,
                            lead: element.lead,
                            AlbumId: album[0].id
                        }
                    });
                    if (row.title === element.track) {
                        yield models_1.Chart.create({
                            rank: row.rank,
                            site,
                            MusicId: res[0].id
                        });
                    }
                }
                yield imageDownload({ url: row.image, music: row, site });
                continue;
            }
            //  매칭이 되지 않았지만 이미 앨범 정보가 있다면
            //  이전에 이미 가져왔기 때문에 위의 if문
            //  음원정보는 모두 존재한다는 말이다. 또한 Music도 이미 존재할것이다.
            const music = yield models_1.Music.findOrCreate({
                where: {
                    title: row.title,
                    artist: row.artist,
                    album: row.album,
                    AlbumId: row.album_id
                }
            });
            yield models_1.Chart.create({
                rank: row.rank,
                site,
                MusicId: music[0].id
            });
            continue;
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
                    return Object.assign(Object.assign({}, element), { id: matchedList[0].id, title: matchedList[0].title, artist: matchedList[0].artist, album: matchedList[0].album, album_id: matchedList[0].AlbumId, matched: true });
                }
                else {
                    if ((element.title.includes(matchedList[0].title) && element.artist.includes(matchedList[0].artist))
                        ||
                            matchedList[0].title.includes(element.title) && matchedList[0].artist.includes(element.artist)) {
                        console.warn(`💫 '${element.title} - ${element.artist}' can not matched max score => ${matchedList[0].title} - ${matchedList[0].artist} : ${matchedList[0].score} `);
                        return Object.assign(Object.assign({}, element), { id: matchedList[0].id, title: matchedList[0].title, artist: matchedList[0].artist, album: matchedList[0].album, album_id: matchedList[0].AlbumId, matched: true });
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
function deleteFile({ targetPath }) {
    fs_1.default.unlinkSync(targetPath);
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
            deleteFile({ targetPath });
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