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
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const oauthValidator_1 = require("../middlewares/oauthValidator");
const router = express_1.default.Router();
router.get('/playlist/list', middlewares_1.isAuthenticated, oauthValidator_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield oauthValidator_1.oauth2Client.request({
            url: 'https://www.googleapis.com/youtube/v3/playlists',
            params: {
                key: process.env.YOUTUBE_API_KEY,
                mine: 'true',
                part: 'snippet',
            }
        });
        res.status(200).send((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.items);
    }
    catch (err) {
        res.send(err);
    }
}));
exports.default = router;
//# sourceMappingURL=youtube-routes.js.map