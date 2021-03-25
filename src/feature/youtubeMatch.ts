import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { matchedItem } from '../../@types/search';

dotenv.config({ path : path.join(__dirname, '../../.env') });
const KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function search({ q }: { q : string }) {
    try{
        const res = await axios.get(`${API_URL}?part=snippet&q=${q}&key=${KEY}`);
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


(async() => {
    try{
        const q = 'Celebrity - 아이유';
        const { items } = await search({ q });
        const matchedList: Array<matchedItem> = arrange(items);
        console.log(matchedList);
    }catch(err){
        console.log(err);
    }
})();