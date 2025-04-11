const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Use the utility function
require('dotenv').config();

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password'); // Debug log
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login attempt with email:', email); // Debug log

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email); // Debug log
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user.email); // Debug log
    console.log('Stored password hash for user:', user.password); // Debug log
    console.log('Provided password:', password); // Debug log

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result for user:', user.email, isMatch); // Debug log
    if (!isMatch) {
      console.log('Password mismatch for user:', user.email); // Debug log
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for user:', user.email); // Debug log

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Error during login:', error); // Debug log
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// REQUEST PASSWORD RESET
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Generate reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log('Password reset link:', resetLink); // Log the reset link to the console
    const token = resetLink.split('/').pop(); // Extract the token from the reset link
    console.log('Extracted Token:', token); // Log the extracted token

    // Send reset link via email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Link',
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (err) {
    console.error('Request reset error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params; // Extract token from params
  const { newPassword } = req.body;

  console.log(`[DEBUG] Reset password request received`);
  console.log(`[DEBUG] Token: ${token}`);
  console.log(`[DEBUG] New Password: ${newPassword}`);

  if (!token || !newPassword) {
    console.error(`[ERROR] Missing token or new password`);
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    console.log(`[DEBUG] Searching for user with reset token: ${token}`);
    const user = await User.findOne({ where: { resetToken: token } });

    if (!user) {
      console.error(`[ERROR] No user found with the provided reset token`);
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    if (user.resetTokenExpiry < Date.now()) {
      console.error(`[ERROR] Reset token has expired`);
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    console.log(`[DEBUG] User found: ${user.email}`);
    console.log(`[DEBUG] Updating user password`);
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    console.log(`[DEBUG] Password reset successfully for user: ${user.email}`);
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(`[ERROR] Error resetting password:`, error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Ensure only the correct functions are exported
module.exports = {
  register: exports.register,
  login: exports.login,
  requestPasswordReset: exports.requestPasswordReset,
  resetPassword: exports.resetPassword,
};
