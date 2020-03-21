const tr = require('tor-request');

tr.request('https://www.melon.com/chart', (err, res, body) => {
    if( !err && res.statusCode == 200){
        console.log("Your public (through Tor) IP is: " + body);
    }else{
        console.log(err);
    }
})