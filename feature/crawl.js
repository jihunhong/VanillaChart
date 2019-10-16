const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const Chart = require('../Object/Chart.js');

const melon = new Chart('melon', 'https://www.melon.com/chart/', 'tr.lst50' ,'div.rank01 a', '.ellipsis.rank02 > span', '.image_typeAll');

melon.setName('melon');
melon.setUrl('https://www.melon.com/chart/');
melon.setParent('tr.lst50');
melon.setTitle('div.rank01 a');
melon.setArtist('.ellipsis.rank02 > span');
melon.setImg('.image_typeAll');

const genie = new Chart('genie', 'https://www.genie.co.kr/chart/top200','td.info', 'a.title', 'a.artist', 'a.cover');
const bugs  = new Chart('bugs' ,  'https://music.bugs.co.kr/chart', 'tbody tr' ,'p.title a', 'p.artist a', 'a.thumbnail');

melon.getData();
genie.getData();
bugs.getData();

// module.exports = melon.getData();