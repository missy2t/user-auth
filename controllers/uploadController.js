const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory
const Notification = require('../models/Notification'); // Import Notification model

// Upload material logic
exports.uploadMaterial = async (req, res) => {
  console.log(`[DEBUG] Upload request received`); // Log when the request is received
  console.log(`[DEBUG] User: ${req.user}`); // Log the user info from the token
  console.log(`[DEBUG] Uploaded file:`, req.file); // Log the uploaded file

  try {
    // Ensure the user is authenticated
    const userId = req.user?.id; // Retrieve user ID from the authenticated token
    if (!userId) {
      console.error(`[ERROR] Unauthorized access: User not authenticated`);
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    if (!req.file) {
      console.error(`[ERROR] No file uploaded`);
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log(`[DEBUG] File path: ${filePath}`); // Log the file path

    // Check if the file exists in the uploads directory
    if (!fs.existsSync(filePath)) {
      console.error(`[ERROR] File not saved in uploads directory`);
      return res.status(500).json({ message: 'File not saved in uploads directory' });
    }

    // Send a notification to the user
    await Notification.create({
      user_id: userId,
      message: `Your file "${req.file.originalname}" has been uploaded successfully.`,
    });

    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    console.error(`[ERROR] Error during file upload:`, error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
