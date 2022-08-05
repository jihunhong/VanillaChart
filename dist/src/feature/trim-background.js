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
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require('sharp');
const path = require('path');
const axios = require('axios');
const trimBackground = ({ url, artistName }) => __awaiter(void 0, void 0, void 0, function* () {
    const response = (yield axios.default({ url, responseType: 'arraybuffer' }));
    const buffer = Buffer.from(response.data, 'binary');
    try {
        yield sharp(buffer)
            .trim(30)
            .toFormat('jpeg')
            .toFile(path.join(__dirname, '../../../static', 'image', 'artist-profile', `${artistName}.jpg`));
        return path.join(__dirname, '../../../static', 'image', 'artist-profile', `${artistName}.jpg`);
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
});
exports.default = trimBackground;
//# sourceMappingURL=trim-background.js.map