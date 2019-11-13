const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const Chart = require('../Object/Chart.js');

const melon = new Chart();

melon.setName('melon');
melon.setUrl('https://www.melon.com/chart/');
melon.setParent('tr.lst50');
melon.setTitle('div.rank01 a');
melon.setArtist('.ellipsis.rank02 > span');
melon.setImg('.image_typeAll');

const genie = new Chart();

genie.setName('genie');
genie.setUrl('https://www.genie.co.kr/chart/top200');
genie.setParent('td.info');
genie.setTitle('a.title');
genie.setArtist('a.artist');
genie.setImg('a.cover');

const bugs  = new Chart();

bugs.setName('bugs');
bugs.setUrl('https://music.bugs.co.kr/chart')
bugs.setParent('tbody tr')
bugs.setTitle('p.title a')
bugs.setArtist('p.artist a')
bugs.setImg('a.thumbnail')

melon.getData();
genie.getData();
bugs.getData();