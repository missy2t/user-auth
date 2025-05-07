const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const protectedRoute = require('./routes/protectedRoute');
const filterRoutes = require('./routes/filterRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Add payment routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// CORS policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Serve static files (e.g., HTML, CSS, images, JS)
app.use(express.static(path.join('C:/Users/Essete/OneDrive/Documents/Digihub')));

// Serve specific frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join('C:/Users/Essete/OneDrive/Documents/Digihub/index.html'));
});

app.get('/aboutus', (req, res) => {
  res.sendFile(path.join('C:/Users/Essete/OneDrive/Documents/Digihub/Aboutus.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join('C:/Users/Essete/OneDrive/Documents/Digihub/Faq.html'));
});

app.get('/contactus', (req, res) => {
  res.sendFile(path.join('C:/Users/Essete/OneDrive/Documents/Digihub/Contactus.html'));
});

// Serve files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to download files
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  console.log(`[DEBUG] Attempting to download file: ${filePath}`); // Debug log

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error(`[ERROR] Error downloading file: ${filePath}`, err);
        res.status(500).send('Error downloading file');
      }
    });
  } else {
    console.error(`[ERROR] File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

// Handle missing favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Respond with no content
});

// Routes
console.log('Mounting /api/auth routes');
app.use('/api/auth', authRoutes);
console.log('Mounting /api/protected routes');
app.use('/api/protected', protectedRoute);
console.log('Mounting /api/uploads routes');
app.use('/api/uploads', uploadRoutes);
console.log('Mounting /api/filters routes');
app.use('/api/filters', filterRoutes);
console.log('Mounting /api/notifications routes');
app.use('/api/notifications', notificationRoutes);
console.log('Mounting /api/dashboard routes');
app.use('/api/dashboard', dashboardRoutes);
console.log('Mounting /api/payments routes');
app.use('/api/payments', paymentRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Error handling for unhandled routes
app.use((req, res) => {
  console.error(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
