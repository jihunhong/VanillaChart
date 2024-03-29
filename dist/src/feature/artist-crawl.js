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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const variables_1 = require("../config/variables");
const models_1 = require("../models");
const crawlUtil_1 = require("./crawlUtil");
const trim_background_1 = __importDefault(require("./trim-background"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const s3 = new aws_sdk_1.S3({ accessKeyId: process.env.AWS_ACCES_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
// 지니 아티스트 검색
const ARTIST_SEARCH_URL = 'https://www.genie.co.kr/search/searchMain?query=';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { browser, page } = yield crawlUtil_1.launchBrowser();
    try {
        const artists = yield models_1.Artist.findAll({
            where: {
                profileImage: {
                    [sequelize_1.Op.eq]: null
                },
            }
        });
        for (const artist of artists) {
            const outputPath = `artist-profile/${artist === null || artist === void 0 ? void 0 : artist.id}.jpg`;
            yield page.goto(`${ARTIST_SEARCH_URL}${encodeURIComponent(artist.artistName)}`);
            const src = yield page.evaluate(() => {
                const element = document.querySelector('span.cover-img img');
                if (element) {
                    return 'https:' + (element === null || element === void 0 ? void 0 : element.getAttribute('src'));
                }
                return null;
            });
            if (!src || src.includes('blank_')) {
                console.error(`${artist === null || artist === void 0 ? void 0 : artist.id}:  검색어 : ${artist === null || artist === void 0 ? void 0 : artist.artistName} 결과가 없습니다`);
                yield models_1.Artist.update({
                    profileImage: `${variables_1.IMGIX_URL}/artist-profile/default-artist.jpg`
                }, {
                    where: {
                        id: artist.id
                    }
                });
                continue;
            }
            const artistImagePath = yield trim_background_1.default({ url: src, artistName: artist === null || artist === void 0 ? void 0 : artist.artistName });
            if (artistImagePath) {
                yield crawlUtil_1.uploadS3({ targetPath: artistImagePath, outputPath });
                yield models_1.Artist.update({
                    profileImage: `${variables_1.IMGIX_URL}/artist-profile/${artist === null || artist === void 0 ? void 0 : artist.id}.jpg`
                }, {
                    where: {
                        id: artist.id
                    }
                });
                console.log(`${artist === null || artist === void 0 ? void 0 : artist.artistName} 아티스트 이미지 저장 성공 ✔️`);
            }
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