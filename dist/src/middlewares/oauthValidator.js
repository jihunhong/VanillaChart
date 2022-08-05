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
exports.checkToken = exports.oauth2Client = void 0;
const moment_1 = __importDefault(require("moment"));
const googleapis_1 = require("googleapis");
const models_1 = require("../models");
exports.oauth2Client = new googleapis_1.Auth.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET, process.env.GOOGLE_CALLBACK);
const checkToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    exports.oauth2Client.setCredentials({
        access_token: req.user.accessToken,
        refresh_token: req.user.refreshToken,
    });
    if (parseInt(moment_1.default().subtract(req.user.expire, 's').format('X')) > -300) {
        exports.oauth2Client.refreshAccessToken((err, tokens) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return next(err);
            const exist = yield models_1.User.findOne({ where: { id: req.user.id } });
            if (exist) {
                yield models_1.User.update(Object.assign(Object.assign({}, exist), { accessToken: tokens === null || tokens === void 0 ? void 0 : tokens.access_token, refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token, expire: tokens === null || tokens === void 0 ? void 0 : tokens.expiry_date }));
            }
            next();
        }));
    }
    next();
});
exports.checkToken = checkToken;
//# sourceMappingURL=oauthValidator.js.map