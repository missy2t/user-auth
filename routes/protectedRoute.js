const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Make sure this path is correct

// Protected route that requires JWT authentication
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
