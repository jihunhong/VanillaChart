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
const moment_1 = __importDefault(require("moment"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const arrange_1 = require("../lib/arrange");
const models_1 = require("../models");
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:8080/api/oauth/google/callback",
    passReqToCallback: true,
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
}, (req, accessToken, refreshToken, params, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield models_1.User.findOne({
            where: {
                oauth_id: profile === null || profile === void 0 ? void 0 : profile.id
            },
            raw: true
        });
        if (existUser) {
            return done(null, existUser);
        }
        console.log('Creating new user : ', profile.id);
        const newUser = yield models_1.User.create({
            email: profile === null || profile === void 0 ? void 0 : profile.emails[0].value,
            nickname: profile === null || profile === void 0 ? void 0 : profile.displayName,
            oauth_id: profile === null || profile === void 0 ? void 0 : profile.id,
            accessToken,
            refreshToken,
            picture: profile === null || profile === void 0 ? void 0 : profile.picture,
            expire: moment_1.default().add(params.expires_in, 's').format('x')
        });
        return done(null, newUser === null || newUser === void 0 ? void 0 : newUser.dataValues);
    }
    catch (err) {
        return done(err, false);
    }
})));
passport_1.default.serializeUser((user, done) => {
    console.log('Serialize User : ', user === null || user === void 0 ? void 0 : user.id);
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 유저 정보와 함께 playlistId만 가져오기
        const user = yield models_1.User.findOne({
            where: {
                id
            },
            include: [
                {
                    model: models_1.Playlist,
                    attributes: ['pId'],
                    as: 'playlists'
                },
                {
                    model: models_1.Music,
                    attributes: ['id'],
                    as: 'liked',
                },
                {
                    model: models_1.User,
                    attrbiutes: ['id'],
                    as: 'followings'
                },
                {
                    model: models_1.User,
                    attrbiutes: ['id'],
                    as: 'followers'
                },
            ],
        });
        done(null, arrange_1.joinArrange(user));
    }
    catch (err) {
        console.error('Error Deserialize', err);
        done(err, null);
    }
}));
//# sourceMappingURL=google.js.map