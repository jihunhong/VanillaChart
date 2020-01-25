const Youtube = require('youtube-node');
const youtube = new Youtube();

const router = require('express').Router();

const apiKeys = require('../keys.js').apiKeys;

const key = apiKeys.sort((a, b) => a-b).shift().key;

router.get('/search', (req, res) => {
    const q = `${req.params.query}`

    youtube.setKey(key);
    youtube.addParam('regionCode', 'kr');
    
    return new Promise(function(res, rej){

        youtube.search(q, limit, function (err, result) {

            if(err) { console.log(err);}

            let response = [];
            try{

                response = result.items.slice(0);

                const officialItem = response.find((v) => 
                    ['MV', 'M/V', 'Official'].includes(v.snippet.title) );
                    // 검색된 결과들중 우선순위를 따져 반환하기 위한 코드

                officialItem === undefined ? res(response[0].id.videoId) : res(officialItem.id.videoId);

            }catch(e){
                console.log(`[ youtube.search() 에러] : ${e}`);
                res(undefined);
            }
        })
    }) 
})