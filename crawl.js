const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const log = console.log;

const Chart = require('./Chart.js');

const melon = new Chart('melon', 'https://www.melon.com/chart/', 'div.wrap_song_info', 'div.rank01 a', 'div.rank02 span');
const genie = new Chart('genie', 'https://www.genie.co.kr/chart/top200', 'td.info', 'a.title', 'a.artist');
const bugs  = new Chart('bugs' ,  'https://music.bugs.co.kr/chart', 'tbody tr', 'p.title a', 'p.artist a');

melon.getData();
genie.getData();
bugs.getData();
