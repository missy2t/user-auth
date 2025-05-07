const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(`[DEBUG] Authorization header: ${authHeader}`); // Log the header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error(`[ERROR] Missing or invalid Authorization header`);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  console.log(`[DEBUG] Extracted token: ${token}`); // Log the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[DEBUG] Token decoded successfully:`, decoded); // Log decoded token
    req.user = decoded; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(`[ERROR] Invalid token:`, error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };
