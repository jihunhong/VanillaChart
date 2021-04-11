import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path : path.join(__dirname, '../../.env') });

module.exports = {
  "development": {
    "username": <string> process.env.LOCAL_DB_ID,
    "password": <string> process.env.LOCAL_DB_PASSWORD,
    "database": "cherry_chart",
    "host": <string> process.env.LOCAL_DB_HOST,
    "port" : 3306,
    "dialect": "mysql",
    "timezone": "+09:00",
    // "logging" : false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "port" : 3306,
    "dialect": "mysql",
    "timezone": "+09:00"
  },
  "production": {
    "username": <string> process.env.PRODUCTION_DB_ID,
    "password": <string> process.env.PRODUCTION_DB_PASSWORD,
    "database": "cherry_chart",
    "host": <string> process.env.PRODUCTION_DB_HOST,
    "port" : 3306,
    "dialect": "mysql",
    "timezone": "+09:00"
  }
}
