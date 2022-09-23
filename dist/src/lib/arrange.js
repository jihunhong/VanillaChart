"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinArrange = exports.favoriteArtistArrange = void 0;
const _1 = require(".");
const variables_1 = require("../config/variables");
const favoriteArtistArrange = (artists) => {
    var _a;
    if (artists) {
        const names = (_a = artists === null || artists === void 0 ? void 0 : artists.playlistItems) === null || _a === void 0 ? void 0 : _a.map(item => {
            var _a, _b;
            if ((_a = item === null || item === void 0 ? void 0 : item.music) === null || _a === void 0 ? void 0 : _a.artistName) {
                //  return `${IMGIX_URL}/artist-profile/${item?.music?.artistName}.jpg?w=300&ar=1:1&fit=crop&auto=format`
                return (_b = item === null || item === void 0 ? void 0 : item.music) === null || _b === void 0 ? void 0 : _b.artistName;
            }
            return null;
        });
        const uniqueNames = Array.from(new Set(names));
        return uniqueNames.map(name => {
            return {
                src: `${variables_1.IMGIX_URL}/artist-profile/${encodeURIComponent(name)}.jpg?w=300&ar=1:1&fit=crop&auto=format`,
                artistName: name,
            };
        });
    }
    return [];
};
exports.favoriteArtistArrange = favoriteArtistArrange;
const joinArrange = (user) => {
    const { followings } = user;
    const { followers } = user;
    return Object.assign(Object.assign({}, user.toJSON()), { password: null, followers: followers.map(_1.getId), followings: followings.map(_1.getId) });
};
exports.joinArrange = joinArrange;
//# sourceMappingURL=arrange.js.map