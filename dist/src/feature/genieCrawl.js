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
exports.collectGenieAlbums = exports.collectGenieCharts = exports.fetchAlbumInfo = void 0;
const crawlUtil_1 = require("./crawlUtil");
function fetchGenieCharts({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const titles = yield page.$$eval('.info .title', titles => titles.map((el) => el.textContent.trim()));
        const artists = yield page.$$eval('.info .artist', artists => artists.map((el) => el.textContent.trim()));
        const albumtitles = yield page.$$eval('.info .albumtitle', albumtitles => albumtitles.map((el) => el.textContent.trim()));
        const images = yield page.$$eval('a.cover img', imageTags => imageTags.map((el) => { var _a; return (_a = el.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.replace('//image.genie.co.kr/', 'https://image.genie.co.kr/').replace('140x140.JPG/dims/resize/Q_80,0', '600x600.JPG'); }));
        // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_140x140.JPG/dims/resize/Q_80,0
        // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_600x600.JPG
        const albumInfoNumbers = yield page.$$eval('.albumtitle', anchors => anchors.map((el) => { var _a; return (_a = el.getAttribute('onclick')) === null || _a === void 0 ? void 0 : _a.replace(/[^0-9]/g, ''); }));
        if (titles.length === artists.length && artists.length === albumtitles.length) {
            const charts = Array(titles.length).fill('').map((v, i) => {
                return {
                    rank: i + 1,
                    title: titles[i],
                    artistName: artists[i],
                    albumName: albumtitles[i],
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
function fetchGenieAlbumNumbers({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const albumInfoNumbers = yield page.$$eval('.albumtitle', anchors => anchors.map((el) => el.getAttribute('onclick')));
        const infoNumbers = albumInfoNumbers.map((el) => {
            return el.replace(/[^0-9]/g, '');
        });
        return infoNumbers;
    });
}
function fetchAlbumInfo({ page, albumId }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.genie.co.kr/detail/albumInfo?axnm=${albumId}`, crawlUtil_1.waitor);
        const albumName = yield page.$eval('h2.name', el => el.textContent);
        const artistName = yield page.$eval('a[onclick*="artistInfo"]', el => el.textContent);
        const tracks = yield page.$$eval('td > a.title', trackList => trackList.map((el) => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); }));
        const releaseDate = yield page.$eval('li:last-child > span.value', time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
        const description = yield page.evaluate(() => Array.from(document.querySelectorAll('.db-insert p')).map(v => v.textContent).filter((v, i) => i > 0).join());
        // YYYY.MM.DD
        const leadIndex = yield page.$$eval('td.info', tracks => Array.from(tracks).findIndex((track) => track.querySelector('span.icon-title')));
        return {
            albumName,
            artistName,
            tracks: tracks.map((trackName, index) => {
                return {
                    track: trackName === null || trackName === void 0 ? void 0 : trackName.replace('TITLE\n', ''),
                    lead: index === leadIndex
                };
            }),
            releaseDate,
            description
        };
    });
}
exports.fetchAlbumInfo = fetchAlbumInfo;
function collectGenieCharts({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.genie.co.kr/chart/top200`, crawlUtil_1.waitor);
        const untilFifty = yield fetchGenieCharts({ page });
        // 1위부터 50위까지
        yield page.click(`.rank-page-nav a:not([class=current])`);
        // 다음 페이지 버튼 클릭
        yield page.waitFor(3000);
        const temp = yield fetchGenieCharts({ page });
        const untilHundred = temp.map((v) => {
            return Object.assign(Object.assign({}, v), { rank: 50 + v.rank });
        });
        // 51위부터 100위까지 페이지에서 같은 함수 실행
        return [...untilFifty, ...untilHundred];
    });
}
exports.collectGenieCharts = collectGenieCharts;
function collectGenieAlbums({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.genie.co.kr/chart/top200`, crawlUtil_1.waitor);
        const firstToFifty = yield fetchGenieAlbumNumbers({ page });
        // 1위부터 50위까지
        yield page.click(`.rank-page-nav a:not([class=current])`);
        // 다음 페이지 버튼 클릭
        yield page.waitFor(3000);
        const fiftyToHundered = yield fetchGenieAlbumNumbers({ page });
        const totalIds = Array.from(new Set(firstToFifty.concat(fiftyToHundered)));
        // 51위부터 100위까지 페이지에서 같은 함수 실행
        const albumInfos = [];
        for (const id of totalIds) {
            const albumInfo = yield fetchAlbumInfo({ page, albumId: id });
            albumInfos.push(albumInfo);
        }
        return albumInfos;
    });
}
exports.collectGenieAlbums = collectGenieAlbums;
//# sourceMappingURL=genieCrawl.js.map