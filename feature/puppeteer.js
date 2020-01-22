const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless : true});

  const page = await browser.newPage();

  await page.goto('https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm?plylstSeq=470791337');
  // 사용자 플레이리스트 url


  const titles = await page.evaluate(() => {
      const array = Array.from(document.querySelectorAll('td.t_left > div.wrap > .ellipsis > a.fc_gray'));
      return array.map(title => title.textContent);
  })

  const artists = await page.evaluate(() => {
      const array = Array.from(document.querySelectorAll('td.t_left > div.wrap > #artistName > a.fc_mgray'));
      return array.map(artist => artist.textContent);
  })
  
  await browser.close();
})();