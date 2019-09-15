const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const Chart = require('../Object/Chart.js');

const melon = new Chart('melon', 'https://www.melon.com/chart/', '.ellipsis.rank01 > span > a', '.ellipsis.rank02 > span > a', '.image_typeAll');
// const genie = new Chart('genie', 'https://www.genie.co.kr/chart/top200','a.title', 'a.artist', 'a.cover');
// const bugs  = new Chart('bugs' ,  'https://music.bugs.co.kr/chart', 'p.title a', 'p.artist a', 'a.thumbnail');

melon.getData();
// genie.getData();
// bugs.getData();

module.exports = melon.getData();