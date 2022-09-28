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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.ftsMatchingJob = exports.imageDownload = exports.getObjectS3 = exports.uploadS3 = exports.fullTextSearch = exports.insertChart = exports.launchBrowser = exports.waitor = void 0;
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
const MIN_MATCH_SCORE = 7.5;
const BUCKET_NAME = 'cherrychart.resources';
exports.waitor = {
    waitUntil: "networkidle2"
};
function launchBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_extra_1.default.launch({
            headless: true
        });
        const page = yield browser.newPage();
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        return { browser, page };
    });
}
exports.launchBrowser = launchBrowser;
function fetchAlbumInfo({ page, site, albumId }) {
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
            const albumInfoExist = yield models_1.Album.findOne({
                where: {
                    id: row.album_id
                }
            });
            const [artist] = yield models_1.Artist.findOrCreate({
                where: {
                    artistName: row.artistName,
                    site,
                }
            });
            if (!albumInfoExist) {
                const albumInfo = yield fetchAlbumInfo({ page, site, albumId: row.album_id });
                const { tracks } = albumInfo;
                const [album] = yield models_1.Album.findOrCreate({
                    where: {
                        albumName: row.albumName,
                        artistName: row.artistName,
                        artistId: artist.id,
                        releaseDate: albumInfo.releaseDate,
                        site,
                    }
                });
                for (const element of tracks) {
                    const [res] = yield models_1.Music.findOrCreate({
                        where: {
                            title: element.track,
                            artistName: row.artistName,
                            albumName: row.albumName,
                            lead: element.lead,
                            albumId: album.id,
                            artistId: artist.id
                        }
                    });
                    if (row.title === element.track && element.lead) {
                        yield models_1.Chart.create({
                            rank: row.rank,
                            site,
                            musicId: res.id
                        });
                    }
                }
                yield imageDownload({ url: row.image, music: row, site });
                continue;
            }
            //  이전에 이미 가져왔기 때문에 위의 if문
            //  음원정보는 모두 존재한다는 말이다. 또한 Music도 이미 존재할것이다.
            const [music] = yield models_1.Music.findOrCreate({
                where: {
                    title: row.title,
                    artistName: row.artistName,
                    albumName: row.albumName,
                    albumId: row.album_id,
                    artistId: artist.id
                }
            });
            yield models_1.Chart.create({
                rank: row.rank,
                site,
                musicId: music.id
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
            SELECT *, match(title, artistName) against( ? ) as score 
            FROM music 
            WHERE match(title, artistName) against( ? ) AND 
                id IN (
                    SELECT musicId
                    FROM charts
                    WHERE site = 'genie'
                )
            ORDER BY score desc
            LIMIT 5;`, {
                replacements: [`${element.title} ${element.artistName}`, `${element.title} ${element.artistName}`],
                type: models_1.sequelize.QueryTypes.SELECT
            });
            if (matchedList.length > 0) {
                if (matchedList[0].score > MIN_MATCH_SCORE) {
                    console.log(`✔ '${element.title} - ${element.artistName}' matched '${matchedList[0].title} - ${matchedList[0].artistName}' `);
                    return Object.assign(Object.assign({}, element), { id: matchedList[0].id, title: matchedList[0].title, artistName: matchedList[0].artistName, albumName: matchedList[0].albumName, album_id: matchedList[0].albumId, matched: true });
                }
                else {
                    if ((element.title.includes(matchedList[0].title) && element.artistName.includes(matchedList[0].artistName))
                        ||
                            matchedList[0].title.includes(element.title) && matchedList[0].artistName.includes(element.artistName)) {
                        console.warn(`💫 '${element.title} - ${element.artistName}' can not matched max score => ${matchedList[0].title} - ${matchedList[0].artistName} : ${matchedList[0].score} `);
                        return Object.assign(Object.assign({}, element), { id: matchedList[0].id, title: matchedList[0].title, artistName: matchedList[0].artistName, albumName: matchedList[0].albumName, album_id: matchedList[0].albumId, matched: true });
                    }
                    console.error(`❌ '${element.title} - ${element.artistName}' not found `);
                    return Object.assign({}, element);
                }
            }
            else {
                console.error(`❌ '${element.title} - ${element.artistName}' not found `);
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
function uploadS3({ targetPath, outputPath }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync(targetPath);
        const params = {
            Bucket: 'cherrychart.resources',
            Key: outputPath,
            Body: fileContent
        };
        return new Promise((res, rej) => {
            s3.upload(params, (err, data) => {
                if (err)
                    rej(err);
                res(data);
            });
        });
    });
}
exports.uploadS3 = uploadS3;
function getObjectS3({ Key }) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => {
            s3.getObject({
                Bucket: BUCKET_NAME,
                Key,
            }, (err, data) => {
                if (err)
                    res(null);
                res(data);
            });
        });
    });
}
exports.getObjectS3 = getObjectS3;
function imageDownload({ url, site, music }) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetPath = path_1.default.join(__dirname, `../../covers/${music.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`);
        const coverDir = path_1.default.join(__dirname, `../../covers`);
        const exist = fs_1.default.existsSync(coverDir);
        if (!exist) {
            fs_1.default.mkdirSync(coverDir);
        }
        if (!fs_1.default.existsSync(targetPath)) {
            yield download({ targetPath, url });
            yield uploadS3({
                targetPath,
                outputPath: `${music.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png`,
            });
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