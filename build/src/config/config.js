"use strict";
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const development = {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    dialect: 'postgres',
};
const config = {
    development,
};
module.exports = config;
