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
const app = require('../server.js');
const supertest = require('supertest');
const mongoose = require('mongoose');
const mockFn = jest.fn();
const request = supertest(app);
const moment = require('moment');
describe('차트 데이터 체크', () => {
    it('MELON', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const melon = yield request.get('/api/chart/melon');
        expect(melon.status).toBe(200);
        expect(melon.body.length).toBe(50);
        let videoIds = melon.body.map((music) => { return music.video_id; });
        videoIds = videoIds.filter((video_id) => video_id);
        expect(videoIds.length).not.toBeLessThan(50);
        done();
    }));
    it('GENIE', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const genie = yield request.get('/api/chart/genie');
        expect(genie.status).toBe(200);
        expect(genie.body.length).toBe(50);
        let videoIds = genie.body.map((music) => { return music.video_id; });
        videoIds = videoIds.filter((video_id) => video_id);
        expect(videoIds.length).not.toBeLessThan(50);
        done();
    }));
    it('BUGS', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const bugs = yield request.get('/api/chart/bugs');
        expect(bugs.status).toBe(200);
        expect(bugs.body.length).toBe(100);
        let videoIds = bugs.body.map((music) => { return music.video_id; });
        videoIds = videoIds.filter((video_id) => video_id);
        expect(videoIds.length).not.toBeLessThan(50);
        done();
    }));
});
describe('차트데이터 백업 테스트', () => {
    it('mock', () => {
        expect(mockFn()).toBe(undefined);
    });
});
//# sourceMappingURL=chartValidation.test.js.map