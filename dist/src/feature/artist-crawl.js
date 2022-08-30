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
const aws_sdk_1 = require("aws-sdk");
const models_1 = require("../models");
const crawlUtil_1 = require("./crawlUtil");
const trim_background_1 = __importDefault(require("./trim-background"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const s3 = new aws_sdk_1.S3({ accessKeyId: process.env.AWS_ACCES_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
// 지니 아티스트 검색
const ARTIST_SEARCH_URL = 'https://www.genie.co.kr/search/searchMain?query=';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { browser, page } = yield crawlUtil_1.launchBrowser();
    try {
        const albums = yield models_1.Album.findAll({
            attributes: [
                [models_1.Sequelize.fn('DISTINCT', models_1.Sequelize.col('artistName')), 'artistName']
            ],
            raw: true
        });
        for (const album of albums) {
            const outputPath = `artist-profile/${album === null || album === void 0 ? void 0 : album.artistName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.jpg`;
            const exist = yield crawlUtil_1.getObjectS3({ Key: outputPath });
            if (exist)
                continue;
            yield page.goto(`${ARTIST_SEARCH_URL}${encodeURIComponent(album.artistName)}`);
            const src = yield page.evaluate(() => {
                const element = document.querySelector('span.cover-img img');
                if (element) {
                    return 'https:' + (element === null || element === void 0 ? void 0 : element.getAttribute('src'));
                }
                return null;
            });
            if (!src || src.includes('blank_')) {
                console.error(`검색어 : ${album === null || album === void 0 ? void 0 : album.artistName} 결과가 없습니다`);
                continue;
            }
            const artistImagePath = yield trim_background_1.default({ url: src, artistName: album === null || album === void 0 ? void 0 : album.artistName });
            if (artistImagePath)
                yield crawlUtil_1.uploadS3({ targetPath: artistImagePath, outputPath });
            console.log(`${album === null || album === void 0 ? void 0 : album.artistName} 아티스트 이미지 저장 성공 ✔️`);
        }
    }
    catch (err) {
        console.error(err);
    }
    finally {
        page.close();
        browser.close();
    }
}))();
//# sourceMappingURL=artist-crawl.js.map