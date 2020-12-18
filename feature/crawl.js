const { launchBrowser } = require("./crawlOption");
const { collectMelon } = require("./melonCrawl");
const { collectGenie } = require("./genieCrawl");
const { collectBugs } = require("./bugsCrawl");

(async() => {
    const [browser, page] = await launchBrowser();
    try{
        const melon = await collectMelon({ page });
        const genie = await collectGenie({ page });
        const bugs = await collectBugs({ page });

        console.log(melon);
        console.log(genie);
        console.log(bugs);

    }catch(err){
        console.log(err);
    }finally{
        browser.close();
        process.exit(0);
    }
})();