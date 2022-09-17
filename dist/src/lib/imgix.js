"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappingSongs = exports.mappingArtistAlbums = exports.mappingAlbumDetail = exports.mappingChartCover = exports.mappingPlaylistPreview = void 0;
const variables_1 = require("./../config/variables");
const mappingPlaylistPreview = (data) => {
    var _a;
    const items = data === null || data === void 0 ? void 0 : data.playlistItems.map(model => model.get({ plain: true }));
    const set = new Set(items.map(item => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.music) === null || _a === void 0 ? void 0 : _a.albumName; }));
    const thumbnails = (_a = Array.from(set)) === null || _a === void 0 ? void 0 : _a.slice(0, 4).map(name => {
        return `${variables_1.IMGIX_URL}/${name === null || name === void 0 ? void 0 : name.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png?w=600&ar=1:1&fit=crop&auto=format`;
    });
    return Object.assign(Object.assign({}, data), { playlistItems: [], 
        // 너무 많은 데이터라서 용량 줄이기위해 빈배열로 반환
        playlistItemCount: data === null || data === void 0 ? void 0 : data.playlistItems.length, thumbnails });
};
exports.mappingPlaylistPreview = mappingPlaylistPreview;
const mappingChartCover = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData === null || rawData === void 0 ? void 0 : rawData.map(item => {
        var _a, _b;
        if ((_a = item === null || item === void 0 ? void 0 : item.music) === null || _a === void 0 ? void 0 : _a.albumName) {
            const rawAlbumName = (_b = item.music.albumName) === null || _b === void 0 ? void 0 : _b.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return Object.assign(Object.assign({}, item), { music: Object.assign(Object.assign({}, item.music), { liker: item.music.liker.map(v => v.id).sort(), middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=600&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=128&ar=1:1&fit=crop&auto=format` }) });
        }
        return Object.assign(Object.assign({}, item), { music: Object.assign(Object.assign({}, item.music), { liker: item.music.liker.map(v => v.id).sort(), middleCoverImage: null, smallCoverImage: null }) });
    });
};
exports.mappingChartCover = mappingChartCover;
const mappingAlbumDetail = (data) => {
    const rawData = data.get({ plain: true });
    const rawAlbumName = data === null || data === void 0 ? void 0 : data.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
    const tracks = rawData.music.map(item => {
        return Object.assign(Object.assign({}, item), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=540&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format` });
    });
    return Object.assign(Object.assign({}, rawData), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=540&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`, music: tracks });
};
exports.mappingAlbumDetail = mappingAlbumDetail;
const mappingArtistAlbums = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData === null || rawData === void 0 ? void 0 : rawData.map(item => {
        if (item === null || item === void 0 ? void 0 : item.albumName) {
            const rawAlbumName = item.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return Object.assign(Object.assign({}, item), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format` });
        }
        return Object.assign(Object.assign({}, item), { middleCoverImage: null });
    });
};
exports.mappingArtistAlbums = mappingArtistAlbums;
const mappingSongs = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData === null || rawData === void 0 ? void 0 : rawData.map(item => {
        if (item === null || item === void 0 ? void 0 : item.albumName) {
            const rawAlbumName = item.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return Object.assign(Object.assign({}, item), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format` });
        }
        return Object.assign(Object.assign({}, item), { middleCoverImage: null, smallCoverImage: null });
    });
};
exports.mappingSongs = mappingSongs;
//# sourceMappingURL=imgix.js.map