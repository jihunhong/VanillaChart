"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
module.exports = {
    "development": {
        "username": process.env.LOCAL_DB_ID,
        "password": process.env.LOCAL_DB_PASSWORD,
        "database": "cherry_chart",
        "host": process.env.LOCAL_DB_HOST,
        "port": 3306,
        "dialect": "mysql",
        "timezone": "+09:00",
        "logging": false
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "port": 3307,
        "dialect": "mysql",
        "timezone": "+09:00"
    },
    "production": {
        "username": process.env.PRODUCTION_DB_ID,
        "password": process.env.PRODUCTION_DB_PASSWORD,
        "database": "cherry_chart",
        "host": process.env.PRODUCTION_DB_HOST,
        "port": 3306,
        "dialect": "mysql",
        "timezone": "+09:00"
    }
};
//# sourceMappingURL=config.js.map