"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const models_1 = require("./src/models");
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
//  Router 
const chart_routes_1 = __importDefault(require("./src/routes/chart-routes"));
const album_routes_1 = __importDefault(require("./src/routes/album-routes"));
const video_routes_1 = __importDefault(require("./src/routes/video-routes"));
const song_routes_1 = __importDefault(require("./src/routes/song-routes"));
const artist_routes_1 = __importDefault(require("./src/routes/artist-routes"));
const oauth_routes_1 = __importDefault(require("./src/routes/oauth-routes"));
const youtube_routes_1 = __importDefault(require("./src/routes/youtube-routes"));
const playlist_routes_1 = __importDefault(require("./src/routes/playlist-routes"));
const user_routes_1 = __importDefault(require("./src/routes/user-routes"));
require('./src/passport/google');
const app = express_1.default();
dotenv_1.default.config({ path: path_1.default.join(__dirname, './.env') });
models_1.sequelize.sync({ force: false })
    .then(() => {
    console.log('Connected database ⚡');
}).catch((err) => {
    console.error(err);
    console.log('Failed to connect database 🔥');
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.default({
    origin: process.env.NODE_ENV === 'production' ? 'https://www.cherrychart.com' : 'http://localhost:3000',
    credentials: true,
}));
app.use(cookie_session_1.default({
    name: 'cc.session',
    maxAge: (24 * 7) * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/cover', express_1.default.static(path_1.default.join(__dirname, '../covers')));
app.use('/api/album', album_routes_1.default);
app.use('/api/chart', chart_routes_1.default);
app.use('/api/video', video_routes_1.default);
app.use('/api/song', song_routes_1.default);
app.use('/api/artist', artist_routes_1.default);
app.use('/api/oauth', oauth_routes_1.default);
app.use('/api/youtube', youtube_routes_1.default);
app.use('/api/playlist', playlist_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.listen(8080, () => {
    console.log('LOCAL DEV SETTING app.listen port 8080');
});
//# sourceMappingURL=app.js.map