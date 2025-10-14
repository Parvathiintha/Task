const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'No token provided' });

    const token = authHeader.split(' ')[1]; 

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'User not found or inactive' });

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    // Other server errors
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

//Authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role,'trsdt')
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: 'Access denied' });
    next();
  };
};
