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
exports.collectBugsAlbums = exports.collectBugsCharts = void 0;
const crawlUtil_1 = require("./crawlUtil");
function fetchBugsCharts({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const titles = yield page.$$eval('p.title', titles => titles.map((el) => el.textContent));
        const artists = yield page.$$eval('p.artist', artists => artists.map((el) => el.textContent));
        const albumtitles = yield page.$$eval('td[class="left"] > a', albumtitles => albumtitles.map((el) => el.textContent));
        const images = yield page.$$eval('td a img', imageTags => imageTags.map((el) => { var _a; return (_a = el.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.replace('/images/50', '/images/500'); }));
        // "https://image.bugsm.co.kr/album/images/50/40271/4027185.jpg?version=20210128063905.0"
        // "https://image.bugsm.co.kr/album/images/200/40271/4027185.jpg?version=20210128063905.0"
        const albumInfoNumbers = yield page.$$eval('td > a.album', anchors => anchors.map((el) => { var _a, _b; return (_b = (_a = el.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.split('?')[0]) === null || _b === void 0 ? void 0 : _b.replace(/[^0-9]/g, ''); }));
        ;
        if (titles.length === artists.length && artists.length === albumtitles.length) {
            const charts = Array(titles.length).fill('').map((v, i) => {
                return {
                    rank: i + 1,
                    title: titles[i].replace(/\n/g, ''),
                    artist: artists[i].replace(/\n/g, ''),
                    album: albumtitles[i].replace(/\n/g, ''),
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
function fetchBugsAlbumNubers({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const albumInfoNumbers = yield page.$$eval('td > a.album', anchors => anchors.map((el) => { var _a; return (_a = el.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.split('?')[0]; }));
        ;
        const infoNumbers = albumInfoNumbers.map((el) => {
            return el.replace(/[^0-9]/g, '');
        });
        return infoNumbers;
    });
}
function fetchAlbumInfo({ page, albumId }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://music.bugs.co.kr/album/${albumId}`, crawlUtil_1.waitor);
        const albumName = yield page.$eval('.innerContainer > h1', el => el.textContent);
        const artist = yield page.$eval('.info a[href*="artist"]', el => el.textContent);
        const tracks = yield page.$$eval('p.title', trackList => trackList.map((el) => el.textContent));
        const releaseDate = yield page.$eval('td > time', time => time.textContent);
        // YYYY.MM.DD
        const leadIndex = yield page.$$eval('tr[albumid]', tracks => Array.from(tracks).findIndex((track) => track.querySelector('span.albumTitle')));
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
function collectBugsCharts({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://music.bugs.co.kr/chart`, crawlUtil_1.waitor);
        const untilHundred = yield fetchBugsCharts({ page });
        // 1위부터 100위까지
        return untilHundred;
    });
}
exports.collectBugsCharts = collectBugsCharts;
function collectBugsAlbums({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://music.bugs.co.kr/chart`, crawlUtil_1.waitor);
        const ids = yield fetchBugsAlbumNubers({ page });
        const totalIds = Array.from(new Set(ids));
        const albumInfos = [];
        for (const id of totalIds) {
            const albumInfo = yield fetchAlbumInfo({ page, albumId: id });
            albumInfos.push(albumInfo);
        }
        return albumInfos;
    });
}
exports.collectBugsAlbums = collectBugsAlbums;
//# sourceMappingURL=bugsCrawl.js.map