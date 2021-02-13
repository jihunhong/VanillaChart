const app = require('../server.js');
const supertest = require('supertest');
const mongoose = require('mongoose');

const mockFn = jest.fn();

const request = supertest(app);

const moment = require('moment');



describe('차트 데이터 체크', () => {
    it('MELON', async(done) => {
        const melon = await request.get('/api/chart/melon');

        expect(melon.status).toBe(200);
        expect(melon.body.length).toBe(50);
        
        let videoIds = melon.body.map((music) => {return music.video_id});
        videoIds = videoIds.filter((video_id) => video_id);
        expect(videoIds.length).not.toBeLessThan(50);

        done();
    })

    it('GENIE', async(done) => {
        const genie = await request.get('/api/chart/genie');

        expect(genie.status).toBe(200);
        expect(genie.body.length).toBe(50);
        
        let videoIds = genie.body.map((music) => {return music.video_id});
        videoIds = videoIds.filter((video_id) => video_id);
        expect(videoIds.length).not.toBeLessThan(50);

        done();
    })

    it('BUGS', async(done) => {
        const bugs = await request.get('/api/chart/bugs');

        expect(bugs.status).toBe(200);
        expect(bugs.body.length).toBe(100);
        
        let videoIds = bugs.body.map((music) => {return music.video_id});
        videoIds = videoIds.filter((video_id) => video_id);
        expect(videoIds.length).not.toBeLessThan(50);

        done();
    })
})

describe('차트데이터 백업 테스트', () => {
    it('mock', () => {
        expect(mockFn()).toBe(undefined);
    })
})