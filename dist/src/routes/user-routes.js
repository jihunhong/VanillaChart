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
const userController_1 = require("../controller/userController");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const router = express_1.default.Router();
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield models_1.User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (existUser) {
            return res.status(403).send('이미 사용중인 이메일 입니다.');
        }
        const existNickname = yield models_1.User.findOne({
            where: {
                nickname: req.body.nickname
            }
        });
        if (existNickname) {
            return res.status(403).send('이미 사용중인 닉네임 입니다.');
        }
        const newUser = yield userController_1.signUpUser({ email: req.body.email, password: req.body.password, nickname: req.body.nickname });
        res.status(201).send(newUser);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, (loginError) => __awaiter(void 0, void 0, void 0, function* () {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            const existUser = yield models_1.User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password']
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
                ]
            });
            return res.status(200).json(existUser);
        }));
    })(req, res, next);
});
router.patch('/follow', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // add follower
    try {
        const targetUser = yield models_1.User.findOne({ where: { id: req.body.userId } });
        if (!targetUser) {
            return res.status(403).send('존재하지 않는 유저입니다.');
        }
        yield targetUser.addFollowers(req.user.id);
        const followers = yield targetUser.getFollowers();
        res.status(200).json(followers);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.delete('/follow', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // remove follower
    try {
        const targetUser = yield models_1.User.findOne({ where: { id: req.body.userId } });
        if (!targetUser) {
            return res.status(403).send('존재하지 않는 유저입니다.');
        }
        yield targetUser.removeFollowers(req.user.id);
        const followers = yield targetUser.getFollowers();
        res.status(200).json(followers);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=user-routes.js.map