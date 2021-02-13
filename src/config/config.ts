import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  "development": {
    "username": <string> process.env.LOCAL_DB_ID,
    "password": <string> process.env.LOCAL_DB_PASSWORD,
    "database": "cherry_chart",
    "host": <string> process.env.LOCAL_DB_HOST,
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
