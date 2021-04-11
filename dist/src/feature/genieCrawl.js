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
exports.collectGenie = void 0;
const crawlUtil_1 = require("./crawlUtil");
function fetchGenie({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const titles = yield page.$$eval('.info .title', titles => titles.map((el) => el.textContent.trim()));
        const artists = yield page.$$eval('.info .artist', artists => artists.map((el) => el.textContent.trim()));
        const albumtitles = yield page.$$eval('.info .albumtitle', albumtitles => albumtitles.map((el) => el.textContent.trim()));
        const images = yield page.$$eval('a.cover img', imageTags => imageTags.map((el) => { var _a; return (_a = el.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.replace('//image.genie.co.kr/', 'https://image.genie.co.kr/').replace('140x140.JPG/dims/resize/Q_80,0', '600x600.JPG'); }));
        // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_140x140.JPG/dims/resize/Q_80,0
        // //image.genie.co.kr/Y/IMAGE/IMG_ALBUM/081/902/916/81902916_1613722333486_1_600x600.JPG
        if (titles.length === artists.length && artists.length === albumtitles.length) {
            const charts = Array(titles.length).fill('').map((v, i) => {
                return {
                    rank: i + 1,
                    title: titles[i],
                    artist: artists[i],
                    album: albumtitles[i],
                    image: images[i],
                };
            });
            return charts;
        }
        else {
            throw Error(`titles : ${titles.length}, artists: ${artists.length}, albums : ${albumtitles.length}`);
        }
    });
}
function collectGenie({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.genie.co.kr/chart/top200`, crawlUtil_1.waitor);
        const untilFifty = yield fetchGenie({ page });
        // 1위부터 50위까지
        yield page.click(`.rank-page-nav a:not([class=current])`);
        // 다음 페이지 버튼 클릭
        yield page.waitFor(3000);
        const temp = yield fetchGenie({ page });
        const untilHundred = temp.map((v) => {
            return Object.assign(Object.assign({}, v), { rank: 50 + v.rank });
        });
        // 51위부터 100위까지 페이지에서 같은 함수 실행
        return [...untilFifty, ...untilHundred];
    });
}
exports.collectGenie = collectGenie;
//# sourceMappingURL=genieCrawl.js.map