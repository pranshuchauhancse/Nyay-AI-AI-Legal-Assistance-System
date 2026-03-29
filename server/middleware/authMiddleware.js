const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const APPROVED_ADMIN_EMAILS = [
  'pranshu121005@gmail.com',
  'rohitchauhan200207@gmail.com',
];

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database not connected');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (
      req.user.role === 'admin' &&
      !APPROVED_ADMIN_EMAILS.includes(normalizeEmail(req.user.email))
    ) {
      res.status(403);
      throw new Error('Admin access denied for this account');
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
};

module.exports = {
  protect,
};
