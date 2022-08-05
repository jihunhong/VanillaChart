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
const crawlUtil_1 = require("./crawlUtil");
const genieCrawl_1 = require("./genieCrawl");
const fs_1 = __importDefault(require("fs"));
const melonCrawl_1 = require("./melonCrawl");
const bugsCrawl_1 = require("./bugsCrawl");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { browser, page } = yield crawlUtil_1.launchBrowser();
    try {
        const genie = yield genieCrawl_1.collectGenieAlbums({ page });
        fs_1.default.writeFileSync('./genie.json', JSON.stringify(genie));
        const melon = yield melonCrawl_1.collectMelonAlbums({ page });
        fs_1.default.writeFileSync('./melon.json', JSON.stringify(melon));
        const bugs = yield bugsCrawl_1.collectBugsAlbums({ page });
        fs_1.default.writeFileSync('./bugs.json', JSON.stringify(bugs));
    }
    catch (err) {
        console.error(err);
    }
    finally {
        browser.close();
        process.exit(0);
    }
    // genie : 42.608ms
    // melon : 64.913ms
    // bugs : 139.313ms
}))();
//# sourceMappingURL=album-crawl.js.map