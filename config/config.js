// require('dotenv').config()
const mysql2 = require('mysql2')

const {
  DB_HOSTNAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: DB_DIALECT,
    dialectModule: mysql2
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: DB_DIALECT,
    dialectModule: mysql2
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: DB_DIALECT,
    dialectModule: mysql2
  },
};
