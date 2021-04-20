import { launchBrowser, insertChart, ftsMatchingJob, imageDownload } from './crawlUtil';
import { collectMelon } from './melonCrawl';
import { collectGenie } from './genieCrawl';
import { collectBugs } from './bugsCrawl';
import { createYoutubeRows } from './youtubeMatch';

(async() => {
    const { browser, page } = await launchBrowser();
    try{
        const genie = await collectGenie({ page });
        await insertChart({ site : 'genie', chart : genie });
        
        const melon = await collectMelon({ page });
        const convertedMelon = await ftsMatchingJob({ chart : melon });
        await insertChart({ site : 'melon', chart : convertedMelon });

        const bugs = await collectBugs({ page });
        const convertedBugs = await ftsMatchingJob({ chart : bugs });
        await insertChart({ site : 'bugs', chart : convertedBugs });

        await createYoutubeRows();
        
        console.log('SUCCESS INSERT AND CRAWL');
    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();