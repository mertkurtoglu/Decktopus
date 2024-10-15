const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Optional: disable logging to keep the console clean
});

module.exports = sequelize;