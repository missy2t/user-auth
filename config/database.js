const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('digi_hub', 'root', '', { // Removed extra space in password
  host: 'localhost',
  dialect: 'mysql', // Or 'mariadb' if you're using MariaDB
  port: 3306, // Default MySQL port
  logging: console.log, // Optional: Log SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection *after* defining the sequelize object.  More robust error handling.
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})(); // Immediately invoked function expression (IIFE)

module.exports = sequelize;





