require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'root',
    database: 'user_appointment',
    host: '127.0.0.1',
    dialect: 'postgres',
  }
};
