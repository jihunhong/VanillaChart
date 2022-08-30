"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappingSongs = exports.mappingArtistAlbums = exports.mappingAlbumDetail = exports.mappingChartCover = exports.mappingPlaylistPreview = void 0;
const variables_1 = require("./../config/variables");
const mappingPlaylistPreview = (data) => {
    const items = data === null || data === void 0 ? void 0 : data.playlistItems.map(model => model.get({ plain: true }));
    const thumbnails = items.map(t => {
        var _a;
        return `${variables_1.IMGIX_URL}/${(_a = t.music.albumName) === null || _a === void 0 ? void 0 : _a.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png?w=300&ar=1:1&fit=crop&auto=format`;
    });
    return Object.assign(Object.assign({}, data), { thumbnails });
};
exports.mappingPlaylistPreview = mappingPlaylistPreview;
const mappingChartCover = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData === null || rawData === void 0 ? void 0 : rawData.map(item => {
        var _a, _b;
        if ((_a = item === null || item === void 0 ? void 0 : item.music) === null || _a === void 0 ? void 0 : _a.albumName) {
            const rawAlbumName = (_b = item.music.albumName) === null || _b === void 0 ? void 0 : _b.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return Object.assign(Object.assign({}, item), { music: Object.assign(Object.assign({}, item.music), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format` }) });
        }
        return Object.assign(Object.assign({}, item), { music: Object.assign(Object.assign({}, item.music), { middleCoverImage: null, smallCoverImage: null }) });
    });
};
exports.mappingChartCover = mappingChartCover;
const mappingAlbumDetail = (data) => {
    const rawData = data.get({ plain: true });
    const rawAlbumName = data === null || data === void 0 ? void 0 : data.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
    const tracks = rawData.music.map(item => {
        return Object.assign(Object.assign({}, item), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format` });
    });
    return Object.assign(Object.assign({}, rawData), { middleCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`, smallCoverImage: `${variables_1.IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`, music: tracks });
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