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
const { userJoinArrange } = require("./src/lib/arrange");
const { User, Playlist, Music } = require("./src/models");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({
        where: {
            id: 27
        },
        include: [
            {
                model: Playlist,
                attributes: ['pId'],
                as: 'playlists'
            },
            {
                model: Music,
                attributes: ['id'],
                as: 'liked',
            },
            {
                model: User,
                attributes: ['id'],
                as: 'followings',
            },
            {
                model: User,
                attrbiutes: ['id'],
                as: 'followers'
            },
        ],
    });
    console.log(userJoinArrange(user));
}))();
//# sourceMappingURL=test.js.map