const axios = require('axios');
const cheerio = require('cheerio');

const mongoose = require('mongoose');

class Playlist{
    constructor(url, id){
        this.id = id;
        this.url = 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm?plylstSeq=' + this.id;
    }

    Builder(obj){
        this.setId(obj.id);
    }

    setId(id){
        this.id = id;
    }

    async getList(){
        const getHTML = async () => {
            try{
                return await axios.get(this.url);
            }catch(e){
                console.error(e);
            }
        }

        const HTML = await getHTML();
        const $ = cheerio.load(HTML.data);

        const tr = $('tr');

        console.log($(tr[1]).find('span.odd_span'));

        
    }
}

module.exports = Playlist;