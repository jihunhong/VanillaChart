import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { matchedItem } from '../../@types/search';
import { ChartData } from '../../@types';
import { Music } from '../models';

dotenv.config({ path : path.join(__dirname, '../../.env') });
const KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function search({ q }: { q : string }) {
    try{
        const res = await axios.get(`${API_URL}?part=snippet&q=${encodeURI(q)}&key=${KEY}`);
        return res.data;
    }catch(error){
        console.error(error);;
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
        return matchedList[0];
    } catch (err) {
        console.error(err);
    }
}

export async function createYoutubeRows({ chartData }: { chartData : Array<ChartData> }){
    try{
        for( const el of chartData ){
            const exist = await Music.findOne({
                where : {
                    title : el.title,
                    artist: el.artist,
                    album: el.album
                }
            })

            if(!exist){
                const youtubeSnippet = await excuteSearch({ q: `${el.title} ${el.artist}` });
                await Music.create({
                    title : el.title,
                    artist: el.artist,
                    album: el.album,
                    videoId: youtubeSnippet!.videoId
                })
            }
        }
    }catch(error){
        console.error(error);
    }
}