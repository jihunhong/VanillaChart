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
exports.passportConfig = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const local_1 = require("./local");
const models_1 = require("../models");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const JWTStrategy = passport_jwt_1.default.Strategy;
const { ExtractJwt } = passport_jwt_1.default;
function passportConfig() {
    passport_1.default.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // authorization : Bearer <token>
        secretOrKey: process.env.SECRET_KEY,
    }, (payload, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield models_1.User.findOne({
                where: {
                    email: payload.email
                },
                attributes: {
                    exclude: ['password'],
                },
                raw: true,
            });
            if (user) {
                done(null, user);
                return;
            }
            done(null, false, { reason: 'invalid token...' });
        }
        catch (err) {
            console.error(err);
            done(err);
        }
    })));
    local_1.localStrategy();
}
exports.passportConfig = passportConfig;
//# sourceMappingURL=index.js.map