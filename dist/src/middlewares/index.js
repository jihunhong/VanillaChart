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
exports.jwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwtAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    if (!token) {
        return res.status(403).json({
            result: 'fail',
            message: 'this request is not containning jwt token.'
        });
    }
    try {
        const decoded = yield verify(token);
        req.decoded = decoded;
        next();
    }
    catch (error) {
        res.json({
            result: 'fail',
            message: error.message
        });
    }
});
const verify = (token) => {
    const secret = process.env.SECRET_KEY;
    return new Promise((res, rej) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err)
                rej(err);
            res(decoded);
        });
    });
};
//# sourceMappingURL=index.js.map