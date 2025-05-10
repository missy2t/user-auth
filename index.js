const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Add payment routes
const uploadRoutes = require('./routes/uploadRoutes');
const sequelize = require('./config/database'); // Use Sequelize instance
const bodyParser = require('body-parser');
const app = require('./app'); // Ensure app is imported correctly
const { Department, AcademicYear, Course, Material, Notification } = require('./models');

dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
console.log('Mounting /api/auth routes');
app.use('/api/auth', authRoutes);
console.log('Mounting /api/payments routes');
app.use('/api/payments', paymentRoutes);
console.log('Mounting /api/upload routes');
app.use('/api/uploads/', uploadRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Error handling for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error logging middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Database connection and server start
sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true }); // Sync models with the database
    console.log('Database tables created/updated successfully');

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

