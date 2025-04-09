const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public route: Register user
router.post('/register', authController.register);

// Public route: Login user
router.post('/login', authController.loginUser);

// Protected route: This route requires a valid JWT token
router.get('/profile', (req, res) => {
  res.json({ message: 'Profile route is working (protected)' });
});

module.exports = router;
// Add this line below the register route
router.post('/login', authController.login);



