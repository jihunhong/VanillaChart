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
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectMelonAlbums = exports.collectMelonCharts = void 0;
const crawlUtil_1 = require("./crawlUtil");
function fetchMelonCharts({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const titles = yield page.$$eval('.rank01', titles => titles.map((el) => el.textContent.trim()));
        const artists = yield page.evaluate(() => {
            return Array.from(document.querySelectorAll('.rank02')).map((v) => {
                const artistBlock = Array.from(v.querySelectorAll('span a'));
                return artistBlock.map((anchor) => anchor.textContent).join();
            });
        });
        const albumtitles = yield page.$$eval('.rank03', albumtitles => albumtitles.map((el) => el.textContent.trim()));
        const images = yield page.$$eval('.image_typeAll > img', imageTags => imageTags.map((el) => { var _a; return (_a = el.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.replace('120/quality/80/optimize', '500/sharpen/0x1'); }));
        // https://cdnimg.melon.co.kr/cm2/album/images/105/54/246/10554246_20210127150136_500.jpg/melon/resize/120/quality/80/optimize
        // https://cdnimg.melon.co.kr/cm2/album/images/105/54/246/10554246_20210127150136_500.jpg/melon/resize/282/sharpen/0x1
        const albumInfoNumbers = yield page.$$eval('.wrap > a[href*="AlbumDetail"]', anchors => anchors.map((el) => { var _a; return (_a = el.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.replace(/[^0-9]/g, ''); }));
        if (titles.length === artists.length && artists.length === albumtitles.length) {
            const charts = Array(titles.length).fill('').map((v, i) => {
                return {
                    rank: i + 1,
                    title: titles[i],
                    artist: artists[i],
                    album: albumtitles[i],
                    image: images[i],
                    album_id: albumInfoNumbers[i]
                };
            });
            return charts;
        }
        else {
            throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`);
        }
    });
}
function fetchMelonAlbumNumbers({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const albumInfoNumbers = yield page.$$eval('.wrap > a[href*="AlbumDetail"]', anchors => anchors.map((el) => el.getAttribute('href')));
        const infoNumbers = albumInfoNumbers.map((el) => {
            return el.replace(/[^0-9]/g, '');
        });
        return infoNumbers;
    });
}
function fetchAlbumInfo({ page, albumId }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.melon.com/album/detail.htm?albumId=${albumId}`, crawlUtil_1.waitor);
        const albumName = yield page.$eval('div.song_name', el => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().replace('앨범명\n\t\t\t\t\t\t\t\t\t\t', ''); });
        const artist = yield page.$eval('div.artist', el => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
        const tracks = yield page.$$eval('a[href*="playSong"]', trackList => trackList.map((el) => el.textContent));
        const releaseDate = yield page.$eval('dl.list > dd', time => time.textContent);
        // YYYY.MM.DD
        const leadIndex = yield page.$$eval('div.wrap_song_info', tracks => Array.from(tracks).findIndex((track) => track.querySelector('span.bullet_icons')));
        return {
            albumName,
            artist,
            tracks: tracks.map((trackName, index) => {
                return {
                    track: trackName,
                    lead: index === leadIndex
                };
            }),
            releaseDate
        };
    });
}
function collectMelonCharts({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.melon.com/chart/`, crawlUtil_1.waitor);
        const untilHundred = yield fetchMelonCharts({ page });
        // 1위부터 100위까지
        return untilHundred;
    });
}
exports.collectMelonCharts = collectMelonCharts;
;
function collectMelonAlbums({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.melon.com/chart/`, crawlUtil_1.waitor);
        const ids = yield fetchMelonAlbumNumbers({ page });
        const totalIds = Array.from(new Set(ids));
        // 1위부터 100위까지
        const albumInfos = [];
        for (const id of totalIds) {
            const albumInfo = yield fetchAlbumInfo({ page, albumId: id });
            albumInfos.push(albumInfo);
        }
        return albumInfos;
    });
}
exports.collectMelonAlbums = collectMelonAlbums;
//# sourceMappingURL=melonCrawl.js.map