const { Sequelize } = require('sequelize');

require('dotenv').config();

const client = new Sequelize({
  host: process.env.DB_HOST || 'chatgramm-postgres',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'qwerty989898',
  database: process.env.DB_DATABASE || 'postgres',
  dialect: 'postgres',
  retry: {
    max: 10, // кількість спроб
  },
});

module.exports = { client };
