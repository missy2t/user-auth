const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
  try {
    const notificationCount = await Notification.count();
    res.status(200).json({ success: true, stats: { notificationCount } });
  } catch (error) {
    console.error(`[ERROR] Failed to fetch dashboard stats:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
