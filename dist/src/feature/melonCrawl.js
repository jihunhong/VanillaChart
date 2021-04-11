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
exports.collectMelon = void 0;
const crawlUtil_1 = require("./crawlUtil");
function fetchMelon({ page }) {
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
function collectMelon({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.melon.com/chart/`, crawlUtil_1.waitor);
        const untilHundred = yield fetchMelon({ page });
        // 1위부터 100위까지
        return untilHundred;
    });
}
exports.collectMelon = collectMelon;
;
//# sourceMappingURL=melonCrawl.js.map