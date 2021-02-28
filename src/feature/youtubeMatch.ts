import axios from 'axios';
const KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function search({ q }: { q : string }) {
    try{
        const res = await axios.get(`${API_URL}?part=snippet&q=${q}&key=${KEY}`);
        const { data } = res;
        console.log(data);
    }catch(error){
        console.error(error);;
        throw error;
    }
}


(async() => {
    try{
        const q = 'Celebrity';
        const result = await search({ q });
        console.log(result);
    }catch(err){
        console.log(err);
    }
})();