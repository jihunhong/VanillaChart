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
const { fn, col, Op } = require("sequelize");
const { Music, Artist, Album, Chart } = require("../models");
const { getObjectS3, launchBrowser, uploadS3 } = require("./crawlUtil");
const { default: trimBackground } = require("./trim-background");
const ARTIST_SEARCH_URL = 'https://www.genie.co.kr/search/searchMain?query=';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { browser, page } = yield launchBrowser();
    const artistNames = yield Album.findAll({
        where: {
            artistId: {
                [Op.eq]: null
            }
        },
        attributes: [
            'id',
            'artistName',
            'site'
        ]
    });
    for (const el of artistNames) {
        const [artist] = yield Artist.findOrCreate({
            where: {
                artistName: el.artistName,
                site: el.site
            }
        });
        console.log(`${artist.artistName}, ${artist.site} created!`);
        yield Album.update({
            artistId: artist.id
        }, {
            where: {
                id: el.id
            }
        });
        yield Music.update({
            artistId: artist.id
        }, {
            where: {
                albumId: el.id
            }
        });
        const outputPath = `artist-profile/${artist === null || artist === void 0 ? void 0 : artist.id}.jpg`;
        const exist = yield getObjectS3({ Key: outputPath });
        if (exist)
            continue;
        yield page.goto(`${ARTIST_SEARCH_URL}${encodeURIComponent(artist.artistName)}`);
        const src = yield page.evaluate(() => {
            const element = document.querySelector('span.cover-img img');
            if (element) {
                return 'https:' + (element === null || element === void 0 ? void 0 : element.getAttribute('src'));
            }
            return null;
        });
        if (!src || src.includes('blank_')) {
            console.error(`검색어 : ${artist === null || artist === void 0 ? void 0 : artist.artistName} 결과가 없습니다`);
            continue;
        }
        const artistImagePath = yield trimBackground({ url: src, artistName: artist === null || artist === void 0 ? void 0 : artist.artistName });
        if (artistImagePath)
            yield uploadS3({ targetPath: artistImagePath, outputPath });
        console.log(`${artist === null || artist === void 0 ? void 0 : artist.artistName} 아티스트 이미지 저장 성공 ✔️`);
    }
    process.exit(1);
}))();
//# sourceMappingURL=artist.js.map