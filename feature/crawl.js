const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const Chart = require('../Object/Chart.js');

const melon = new Chart();

melon.Builder(
    {
        name   : 'melon', 
        url    : 'https://www.melon.com/chart/', 
        parent : 'tr.lst50', 
        title  : 'div.rank01 a',
        artist : '.ellipsis.rank02 > span',
        img    : '.image_typeAll'
    }
);

const genie = new Chart();

genie.Builder(
    {
        name   : 'genie', 
        url    : 'https://www.genie.co.kr/chart/top200', 
        parent : 'td.info', 
        title  : 'a.title',
        artist : 'a.artist',
        img    : 'a.cover'
    }
);

const bugs  = new Chart();

bugs.Builder(
    {
        name   : 'bugs', 
        url    : 'https://music.bugs.co.kr/chart', 
        parent : 'tbody tr', 
        title  : 'p.title a',
        artist : 'p.artist a',
        img    : 'a.thumbnail'
    }
);


// melon.saveOldChart()
//     .then(res => {
//         melon.getData();
//         console.log('getData 멜론')
//     })
//     .catch((err) => {
//         console.log('에러!');
//         console.log(err);
//     });

// genie.saveOldChart()
//     .then(res => {
//         genie.getData();
//         console.log('getData 지니')
//     })
//     .catch((err) => {
//         console.log('에러!');
//         console.log(err);
//     });


// bugs.saveOldChart()
//     .then(res => {
//         bugs.getData();
//         console.log('getData 벅스')
//     })
//     .catch((err) => {
//         console.log('에러!');
//         console.log(err);
//     });

const crawl = async() => {
    await melon.saveOldChart();
    await melon.getData();

    await genie.saveOldChart();
    await genie.getData();
    
    await bugs.saveOldChart();
    await bugs.getData();

    return '완료';
}

crawl()
    .then(res => {
        console.log(res);
    })
    .catch((err) => {
        console.log('에러!')
        console.log(err);
    })