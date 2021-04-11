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
exports.localStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
function localStrategy() {
    passport_1.default.use('local', new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield models_1.User.findOne({
                where: { email },
                raw: true
            });
            if (!user) {
                return done(null, false, { message: '존재하지 않는 사용자입니다' });
            }
            const result = yield bcrypt_1.default.compare(password, user.password);
            if (result) {
                delete user['password'];
                return done(null, user);
            }
            return done(null, false, { message: '비밀번호가 틀렸습니다.' });
        }
        catch (error) {
            console.error(error);
            return done(error);
        }
    })));
}
exports.localStrategy = localStrategy;
//# sourceMappingURL=local.js.map