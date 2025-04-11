require('dotenv').config(); // Ensure .env is loaded
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD || '', // Explicitly handle empty password
  {
    host: process.env.DB_HOST, // Database host
    dialect: process.env.DB_DIALECT || 'mysql', // Database dialect
    logging: false, // Disable logging (optional)
  }
);

module.exports = sequelize;





