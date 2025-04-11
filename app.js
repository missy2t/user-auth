const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes'); // Corrected import

// Middleware
app.use(express.json());

// Routes
console.log('Mounting /api/auth routes'); // Debug log
app.use('/api/auth', authRoutes); // Ensure correct route prefix
console.log('Mounting /api/protected routes'); // Debug log
app.use('/api/protected', require('./routes/protectedRoute'));

// Error handling for unhandled routes
app.use((req, res, next) => {
  console.error(`Route not found: ${req.method} ${req.url}`); // Debug log
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;