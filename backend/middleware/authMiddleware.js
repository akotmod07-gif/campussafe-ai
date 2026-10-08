const { verifyToken } = require('../utils/token');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const { mockUsers } = require('../services/seedService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided',
    });
  }

  try {
    const decoded = verifyToken(token);

    if (getDBStatus()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      req.user = user;
    } else {
      // In-Memory fallback mode
      const user = mockUsers.find(u => (u._id === decoded.id || u.id === decoded.id || u.email === decoded.email));
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists in session' });
      }
      const { password, ...safeUser } = user;
      req.user = safeUser;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required',
    });
  }
};

module.exports = { protect, requireAdmin };
