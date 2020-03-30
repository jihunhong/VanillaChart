const moment = require('moment');
const colors = require('colors');
const Chart = require('../class/Chart.js');

const melon = new Chart();

const mongoose = require('mongoose');



melon.Builder(
    {
        name   : 'melon', 
        url    : 'https://www.melon.com/chart/', 
        parent : 'tr.lst50', 
        title  : 'div.rank01 a',
        artist : '.ellipsis.rank02 > span',
        img    : '.image_typeAll > img'
    }
);



const genie = new Chart();

genie.Builder(
    {
        name   : 'genie', 
        url    : 'https://www.genie.co.kr/chart/top200', 
        parent : 'tr.list', 
        title  : 'a.title',
        artist : 'a.artist',
        img    : 'a.cover > img'
    }
);

const bugs  = new Chart();

bugs.Builder(
    {
        name   : 'bugs', 
        url    : 'https://music.bugs.co.kr/chart', 
        parent : 'table.list >  tbody > tr', 
        title  : 'p.title > a',
        artist : 'p.artist > a',
        img    : 'a.thumbnail > img'
    }
);

const crawl = async() => {
    
    await melon.saveOldChart();
    await melon.getData();

    await genie.saveOldChart();
    await genie.getData();

    await bugs.saveOldChart();
    await bugs.getData();
}

crawl()
    .then(res => {
        console.log(colors.green(`${moment().format('YYYY-MM-DD')} crawl 완료`));
        mongoose.disconnect();
    })
    .catch((err) => {
        console.log(colors.red('[crawl.js 에러] crawl.js 에러'));
        console.log(err);
    })