import { launchBrowser, insertChart, convertChartFormat } from './crawlUtil.js';
import { collectMelon } from './melonCrawl.js';
import { collectGenie } from './genieCrawl.js';
import { collectBugs } from './bugsCrawl.js';

(async() => {
    const { browser, page } = await launchBrowser();
    try{
        const melon = await collectMelon({ page });
        const genie = await collectGenie({ page });
        const bugs = await collectBugs({ page });

        const convertedMelon = await convertChartFormat({ chart : melon });
        const convertedBugs = await convertChartFormat({ chart : bugs });

        await insertChart({ site : 'melon', chart : convertedMelon });
        await insertChart({ site : 'genie', chart : genie });
        await insertChart({ site : 'bugs', chart : convertedBugs });

        console.log('SUCCESS INSERT AND CRAWL');
    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();