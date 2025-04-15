const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes'); // Corrected import

// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// cors policy manually added without using package
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({}); // Respond to preflight requests
  }
  next(); // Proceed to the next middleware or route handler
});

// Routes
console.log('Mounting /api/auth routes'); // Debug log
app.use('/api/auth', authRoutes); // Ensure correct route prefix
console.log('Mounting /api/protected routes'); // Debug log
app.use('/api/protected', require('./routes/protectedRoute'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Error handling for unhandled routes
app.use((req, res, next) => {
  console.error(`Route not found: ${req.method} ${req.url}`); // Debug log
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
