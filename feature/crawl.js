const { launchBrowser, insertChart } = require('./crawlUtil.js');
const { collectMelon } = require('./melonCrawl.js');
const { collectGenie } = require('./genieCrawl.js');
const { collectBugs } = require('./bugsCrawl.js');

(async() => {
    const [browser, page] = await launchBrowser();
    try{
        const melon = await collectMelon({ page });
        const genie = await collectGenie({ page });
        const bugs = await collectBugs({ page });

        await insertChart({ site : 'melon', chart : melon });
        await insertChart({ site : 'genie', chart : genie });
        await insertChart({ site : 'bugs', chart : bugs });

        console.log('SUCCESS INSERT AND CRAWL');
    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();