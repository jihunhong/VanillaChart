import { collectBugsCharts } from './bugsCrawl';
import { insertChart, launchBrowser } from './crawlUtil';
import { collectGenieCharts } from './genieCrawl';
import { collectMelonCharts } from './melonCrawl';
import { createYoutubeRows } from './youtubeMatch';

(async() => {
    const { browser, page } = await launchBrowser();
    try {
        const genieChart = await collectGenieCharts({ page });
        await insertChart({ page, site : 'genie', chart : genieChart });
 
        const melonChart = await collectMelonCharts({ page });
        await insertChart({ page, site : 'melon', chart : melonChart });

        const bugsChart = await collectBugsCharts({ page });
        await insertChart({ page, site : 'bugs', chart : bugsChart });

        await createYoutubeRows();
        
        console.log('SUCCESS INSERT AND CRAWL');
    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();