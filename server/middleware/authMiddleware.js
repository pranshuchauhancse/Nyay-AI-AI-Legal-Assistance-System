const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Session = require('../models/Session');
const { ForbiddenError, UnauthorizedError } = require('../utils/AppError');

const APPROVED_ADMIN_EMAILS = [
  'pranshu121005@gmail.com',
  'rohitchauhan200207@gmail.com',
];

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Not authorized, token missing');
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database not connected');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure it's an access token
    if (decoded.type !== 'access') {
      throw new UnauthorizedError('Invalid token type. Use access token.');
    }

    if (!decoded.role || !decoded.userId) {
      throw new UnauthorizedError('Invalid token payload');
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      throw new UnauthorizedError('User not found');
    }

    if (String(req.user._id) !== String(decoded.userId) || req.user.role !== decoded.role) {
      throw new UnauthorizedError('Token subject does not match current user');
    }

    if (decoded.sessionId) {
      const session = await Session.findOne({
        _id: decoded.sessionId,
        userId: req.user._id,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
      }).select('_id');

      if (!session) {
        throw new UnauthorizedError('Session expired or revoked');
      }

      req.sessionId = session._id;
    }

    // Verify admin access if admin role
    if (
      req.user.role === 'admin' &&
      !APPROVED_ADMIN_EMAILS.includes(normalizeEmail(req.user.email))
    ) {
      throw new ForbiddenError('Admin access denied for this account');
    }

    next();
  } catch (err) {
    if (res.statusCode < 400) {
      res.status(401);
    }
    if (err.statusCode) {
      throw err;
    }
    throw new UnauthorizedError(err.message || 'Not authorized, token invalid');
  }
};

module.exports = {
  protect,
};
