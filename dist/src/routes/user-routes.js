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
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
const models_1 = require("../models");
const lib_1 = require("../lib");
router.get('/', (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            console.error(error);
            return next(error);
        }
        if (info) {
            return res.status(401).json(info);
        }
        return res.status(200).json(user);
    })(req, res, next);
});
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, { session: false }, (loginError) => __awaiter(void 0, void 0, void 0, function* () {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            const token = yield lib_1.sign(user);
            return res.status(200).json({
                message: 'logged in successfully',
                token,
            });
        }));
    })(req, res, next);
});
router.post('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy(() => {
        console.log('destroyed session..');
    });
    res.send('ok');
});
router.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield models_1.User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (existUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        yield userController_1.signUpUser({ email: req.body.email, nickname: req.body.nickname, password: req.body.password });
        res.status(201).send({ email: req.body.email, nickname: req.body.nickname, password: req.body.password });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=user-routes.js.map