import { launchBrowser } from "./crawlUtil";
import { collectGenieAlbums } from './genieCrawl';
import fs from 'fs';
import { collectMelonAlbums } from "./melonCrawl";
import { collectBugsAlbums } from "./bugsCrawl";


(async() => {
    const { browser, page } = await launchBrowser();
    try{

        const genie = await collectGenieAlbums({ page });
        fs.writeFileSync('./genie.json', JSON.stringify(genie)); 

        const melon = await collectMelonAlbums({ page });
        console.log(melon);
        fs.writeFileSync('./melon.json', JSON.stringify(melon));

        const bugs = await collectBugsAlbums({ page });
        console.log(bugs);
        fs.writeFileSync('./bugs.json', JSON.stringify(bugs));
    }catch(err){
        console.error(err);
    }finally{
        process.exit(0);
    }

    // genie : 42.608ms
    // melon : 64.913ms
    // bugs : 139.313ms

})();