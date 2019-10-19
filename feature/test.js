var google = require('googleapis');
var Lien = require("lien");
var OAuth2 = google.auth.OAuth2;

var server = new Lien({
    host: "localhost"
  , port: 5000
});

var oauth2Client = new OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:5000/oauthcallback'
);

var scopes = [
  'https://www.googleapis.com/auth/youtube'
];

var youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

server.addPage("/", lien => {
    var url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes
    });
    lien.end("<a href='"+url+"'>Authenticate yourself</a>");
})

server.addPage("/oauthcallback", lien => {
    console.log("Code obtained: " + lien.query.code);
    oauth2Client.getToken(lien.query.code, (err, tokens) => {
        if(err){
            return console.log(err);
        }

        oauth2Client.setCredentials(tokens);
        youtube.playlists.insert({
            part: 'id,snippet',
            resource: {
                snippet: {
                    title:"Test",
                    description:"Description",
                }
            }
        }, function (err, data, response) {
            if (err) {
                lien.end('Error: ' + err);
            }
            else if (data) {
                lien.end(data);
            }
            if (response) {
                console.log('Status code: ' + response.statusCode);
            }
        });
    });
});