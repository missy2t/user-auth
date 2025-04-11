const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// REGISTER USER
router.post('/register', authController.register);

// LOGIN USER
router.post('/login', authController.login);

// REQUEST PASSWORD RESET
router.post('/request-password-reset', authController.requestPasswordReset);

// BONUS: Handle GET request for password reset form
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  console.log(`[DEBUG] Password reset form requested with token: ${token}`);
  res.send("This would be your frontend password reset page.");
});

// RESET PASSWORD
router.post('/reset-password/:token', (req, res, next) => {
  console.log(`[DEBUG] Reset password route hit`);
  console.log(`[DEBUG] Token parameter:`, req.params.token);
  console.log(`[DEBUG] Request body:`, req.body);

  // Check if newPassword is provided
  if (!req.body.newPassword) {
    console.error(`[ERROR] Missing newPassword in request`);
    return res.status(400).json({ message: 'New password is required.' });
  }

  next();
}, authController.resetPassword);

module.exports = router;