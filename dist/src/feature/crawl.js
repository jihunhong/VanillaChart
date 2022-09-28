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
const bugsCrawl_1 = require("./bugsCrawl");
const crawlUtil_1 = require("./crawlUtil");
const genieCrawl_1 = require("./genieCrawl");
const melonCrawl_1 = require("./melonCrawl");
const youtubeMatch_1 = require("./youtubeMatch");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { browser, page } = yield crawlUtil_1.launchBrowser();
    try {
        const genieChart = yield genieCrawl_1.collectGenieCharts({ page });
        yield crawlUtil_1.insertChart({ page, site: 'genie', chart: genieChart });
        const melonChart = yield melonCrawl_1.collectMelonCharts({ page });
        yield crawlUtil_1.insertChart({ page, site: 'melon', chart: melonChart });
        const bugsChart = yield bugsCrawl_1.collectBugsCharts({ page });
        yield crawlUtil_1.insertChart({ page, site: 'bugs', chart: bugsChart });
        yield youtubeMatch_1.createYoutubeRows();
        console.log('SUCCESS INSERT AND CRAWL');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        browser.close();
        process.exit(0);
    }
}))();
//# sourceMappingURL=crawl.js.map