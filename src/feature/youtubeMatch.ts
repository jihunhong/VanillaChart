import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { matchedItem } from '../../@types/search';
import { ChartData } from '../../@types';
import { Music, Video, Chart } from '../models';

dotenv.config({ path : path.join(__dirname, '../../.env') });
const KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function search({ q }: { q : string }) {
    try{
        const res = await axios.get(API_URL, {
            params: {
                part: 'snippet',
                q,
                type: 'video',
                key : KEY,
            }
        });
        return res.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

function arrange(items: any){
    return items.map((v: any) => {
        return {
            title : v.snippet.title,
            videoId : v.id.videoId,
            description : v.snippet.description,
            publishedAt : v.snippet.publishedAt,
            thumbnail : v.snippet.thumbnails.high || v.snippet.thumbnails.medium || v.snippet.thumbnails.default,
            channelTitle : v.snippet.channelTitle,
            channelId : v.snippet.channelId,
        }
    })
}

async function excuteSearch({ q }: { q : string }) {
    try {
        const { items } = await search({ q });
        const matchedList: Array<matchedItem> = arrange(items);
        const exact = matchedList.find((v) => {
            return v.title.includes('MV') && v.videoId;
        });

        return exact || matchedList.find((v) => v.videoId);
    } catch (err) {
        console.error(err);
    }
}

export async function createYoutubeRows(){
    const chartData = await Chart.findAll({
        attributes: [
            'rank'
        ],
        raw : true,
        include : [
            {
                model : Music,
                attributes : [
                    'id',
                    'title',
                    'artist',
                    'album',
                ],
                include : [
                    {
                        model : Video,
                        attributes : [
                            'videoId'
                        ]
                    }
                ]
            },
        ],
        group: ['Music.id'],
        order : [
            ['rank', 'ASC']
        ]
    });
    try{
        for( const el of chartData ){
            const exist = await Video.findOne({
                where : {
                    MusicId : el["Music.id"]
                }
            })

            if(!exist){

                console.log(`not exist element. start to youtube matching job : ${el["Music.title"]}`);
                const youtubeSnippet = await excuteSearch({ q: `${el["Music.title"]} ${el["Music.artist"]}` });
                if(!youtubeSnippet){
                    console.log(`empty response! q : ${el["Music.title"]} ${el["Music.artist"]}`);
                    break;
                }
                await Video.create({
                    MusicId : el["Music.id"],
                    videoId: youtubeSnippet.videoId
                })
            }
        }
        // 차트 내에 존재하는 데이터 부터 검색 시작
        // 할당량이 남아있다면 최근 추가된 앨범의 데이터부터 차례로 검색 시작

        const recentMusics = await Music.findAll({
            order: [
                ['createdAt']
            ]
        })
        for(const el of recentMusics){
            const exist = await Video.findOne({
                where : {
                    id: el.id
                }
            })

            if(!exist){
                const youtubeSnippet = await excuteSearch({ q: `${el.title} ${el.artist}`});
                if(!youtubeSnippet){
                    break;
                }
                await Video.create({
                    MusicId: el.id,
                    videoId: youtubeSnippet.videoId
                })
            }
        }
    }catch(error){
        console.error(error);
    }
}