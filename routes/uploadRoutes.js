const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer to store files in the 'uploads' directory
const upload = multer({
  dest: 'uploads/', // Ensure this path is correct
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
    files: 1, // Allow only one file per request
  },
});

// Route to upload materials
router.post('/upload', authenticate, upload.single('file'), uploadController.uploadMaterial);

// Test route to verify uploads route is working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Uploads route is working!' });
});

module.exports = router;
