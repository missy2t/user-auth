const Notification = require('../models/Notification');

exports.sendNotification = async (req, res) => {
  const { user_id, message } = req.body;

  try {
    // Ensure the user_id exists in the users table
    const notification = await Notification.create({ user_id, message });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error(`[ERROR] Failed to send notification:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
