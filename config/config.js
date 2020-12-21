const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path : path.join(__dirname, '../.env') });

module.exports = {
  "development": {
    "username": process.env.LOCAL_DB_ID,
    "password": process.env.LOCAL_DB_PASSWORD,
    "database": "cherry_chart",
    "host": "127.0.0.1",
    "port" : 3306,
    "dialect": "mysql",
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "port" : 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "port" : 3306,
    "dialect": "mysql"
  }
}
