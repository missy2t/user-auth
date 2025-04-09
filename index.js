require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const express = require('express');
const sequelize = require('./config/database'); // Sequelize connection
const { QueryTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 8070; // Use port from .env or default to 8080

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login Route - Auth Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database (assuming you're using Sequelize)
    const user = await sequelize.query(
      'SELECT * FROM users WHERE email = :email AND password = :password',
      {
        replacements: { email, password },
        type: QueryTypes.SELECT,
      }
    );

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user[0].id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Respond with success and token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test DB connection - REMOVED - This is now tested in config/database.js

// Start the server ONLY AFTER SUCCESSFUL DB Connection.
sequelize.sync()
  .then(() => {
    console.log('Database synced.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing the database:', err);
    process.exit(1); // Exit process if DB connection fails
  });
