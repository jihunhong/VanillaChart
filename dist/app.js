"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./src/passport");
const cors_1 = __importDefault(require("cors"));
//  Router 
const chart_routes_1 = __importDefault(require("./src/routes/chart-routes"));
const user_routes_1 = __importDefault(require("./src/routes/user-routes"));
const album_routes_1 = __importDefault(require("./src/routes/album-routes"));
const app = express_1.default();
dotenv_1.default.config({ path: path_1.default.join(__dirname, './.env') });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.default({
    origin: process.env.NODE_ENV === 'production' ? 'https://www.cherrychart.com' : 'http://localhost:3000',
    credentials: true,
}));
passport_2.passportConfig();
app.use(passport_1.default.initialize());
app.use('/api/cover', express_1.default.static(path_1.default.join(__dirname, '../covers')));
app.use('/api/user', user_routes_1.default);
app.use('/api/album', album_routes_1.default);
app.use('/api/chart', chart_routes_1.default);
app.listen(8080, () => {
    console.log('LOCAL DEV SETTING app.listen port 8080');
});
//# sourceMappingURL=app.js.map