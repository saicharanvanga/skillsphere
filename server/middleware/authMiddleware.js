const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const jwtSecret = process.env.JWT_SECRET || 'skillsphere_default_dev_secret_key_2026';
      const decoded = jwt.verify(token, jwtSecret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account no longer exists or session has expired.',
        });
      }

      return next();
    } catch (error) {
      console.error('[AuthMiddleware] Verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Authentication token is invalid or expired.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided in request header.',
    });
  }
};

module.exports = { protect };
