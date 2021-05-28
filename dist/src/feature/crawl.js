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
const crawlUtil_1 = require("./crawlUtil");
const youtubeMatch_1 = require("./youtubeMatch");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { browser, page } = yield crawlUtil_1.launchBrowser();
    try {
        // const genie = await collectGenieCharts({ page });
        // await insertChart({ page, site : 'genie', chart : genie });
        // const melon = await collectMelonCharts({ page });
        // const convertedMelon = await ftsMatchingJob({ chart : melon });
        // await insertChart({ page, site : 'melon', chart : convertedMelon });
        // const bugs = await collectBugsCharts({ page });
        // const convertedBugs = await ftsMatchingJob({ chart : bugs });
        // await insertChart({ page, site : 'bugs', chart : convertedBugs });
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