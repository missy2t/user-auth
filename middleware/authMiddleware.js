const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  console.log(`[DEBUG] Authenticating token`);
  const authHeader = req.headers['authorization'];

  // Check if token exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error(`[ERROR] No token provided or invalid format`);
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log(`[DEBUG] Token extracted: ${token}`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[DEBUG] Token decoded successfully:`, decoded);
    req.user = decoded; // Add user info to request object
    next(); // Move to next middleware or controller
  } catch (error) {
    console.error(`[ERROR] Invalid token:`, error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
