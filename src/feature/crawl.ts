import { launchBrowser, insertChart, ftsMatchingJob, imageDownload } from './crawlUtil';
import { collectMelonCharts } from './melonCrawl';
import { collectGenieCharts } from './genieCrawl';
import { collectBugsCharts } from './bugsCrawl';
import { createYoutubeRows } from './youtubeMatch';

(async() => {
    const { browser, page } = await launchBrowser();
    try {
        const genie = await collectGenieCharts({ page });
        await insertChart({ page, site : 'genie', chart : genie });

        const melon = await collectMelonCharts({ page });
        const convertedMelon = await ftsMatchingJob({ chart : melon });
        await insertChart({ page, site : 'melon', chart : convertedMelon });

        const bugs = await collectBugsCharts({ page });
        const convertedBugs = await ftsMatchingJob({ chart : bugs });
        await insertChart({ page, site : 'bugs', chart : convertedBugs });

        await createYoutubeRows();
        
        console.log('SUCCESS INSERT AND CRAWL');
    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();