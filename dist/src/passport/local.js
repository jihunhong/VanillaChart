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
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const models_1 = require("../models");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne({
            where: { email },
            raw: true
        });
        if (!user) {
            return done(null, false, { message: '존재하지 않는 이메일입니다.' });
        }
        const result = yield bcrypt_1.default.compare(password, user.password);
        if (result) {
            return done(null, user);
        }
        return done(null, false, { message: '비밀번호를 확인해주세요' });
    }
    catch (err) {
        return done(err, false);
    }
})));
passport_1.default.serializeUser((user, done) => {
    console.log('Serialize User : ', user);
    노;
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
        done(null, user);
    }
    catch (err) {
        console.error('Error Deserialize', err);
        done(err, null);
    }
}));
//# sourceMappingURL=local.js.map