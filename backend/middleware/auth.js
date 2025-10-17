const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Step 1: Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');  

    // Step 2: Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }    
    // Step 3: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, authorization denied'
      });
    }

    // Step 4: Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found, authorization denied'
      });
    }

    // Step 5: Attach user to request object
    req.user = user;

    // Step 6: Call next()
    next();

  } catch (error) {
    // Handle errors
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = authMiddleware;