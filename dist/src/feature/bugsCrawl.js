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
exports.collectBugs = void 0;
const crawlUtil_1 = require("./crawlUtil");
function fetchBugs({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        const titles = yield page.$$eval('p.title', titles => titles.map((el) => el.textContent));
        const artists = yield page.$$eval('p.artist', artists => artists.map((el) => el.textContent));
        const albumtitles = yield page.$$eval('td[class="left"] > a', albumtitles => albumtitles.map((el) => el.textContent));
        const images = yield page.$$eval('td a img', imageTags => imageTags.map((el) => { var _a; return (_a = el.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.replace('/images/50', '/images/500'); }));
        // "https://image.bugsm.co.kr/album/images/50/40271/4027185.jpg?version=20210128063905.0"
        // "https://image.bugsm.co.kr/album/images/200/40271/4027185.jpg?version=20210128063905.0"
        if (titles.length === artists.length && artists.length === albumtitles.length) {
            const charts = Array(titles.length).fill('').map((v, i) => {
                return {
                    rank: i + 1,
                    title: titles[i].replace(/\n/g, ''),
                    artist: artists[i].replace(/\n/g, ''),
                    album: albumtitles[i].replace(/\n/g, ''),
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
function collectBugs({ page }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://music.bugs.co.kr/chart`, crawlUtil_1.waitor);
        const untilHundred = yield fetchBugs({ page });
        // 1위부터 100위까지
        return untilHundred;
    });
}
exports.collectBugs = collectBugs;
//# sourceMappingURL=bugsCrawl.js.map