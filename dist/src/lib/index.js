"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sign = (user) => {
    const secret = process.env.SECRET_KEY;
    return new Promise((res, rej) => {
        jsonwebtoken_1.default.sign(user, secret, {
            expiresIn: '1d',
            issuer: 'cherrychart.com',
            subject: 'user-info'
        }, (err, token) => {
            if (err)
                rej(err);
            res(token);
        });
    });
};
exports.sign = sign;
const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
};
exports.delay = delay;
//# sourceMappingURL=index.js.map