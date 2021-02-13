import { launchBrowser, insertChart, convertChartFormat } from './crawlUtil';
import { collectMelon } from './melonCrawl';
import { collectGenie } from './genieCrawl';
import { collectBugs } from './bugsCrawl';

(async() => {
    const { browser, page } = await launchBrowser();
    try{
        const genie = await collectGenie({ page });
        await insertChart({ site : 'genie', chart : genie });
        
        const melon = await collectMelon({ page });
        const convertedMelon = await convertChartFormat({ chart : melon });
        await insertChart({ site : 'melon', chart : convertedMelon });

        const bugs = await collectBugs({ page });
        const convertedBugs = await convertChartFormat({ chart : bugs });
        await insertChart({ site : 'bugs', chart : convertedBugs });
        
        console.log('SUCCESS INSERT AND CRAWL');
    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();