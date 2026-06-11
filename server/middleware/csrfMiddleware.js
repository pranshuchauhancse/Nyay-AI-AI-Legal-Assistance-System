const crypto = require('crypto');
const { ForbiddenError } = require('../utils/AppError');

const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const csrfProtection = (req, res, next) => {
  let token = req.cookies?.[CSRF_COOKIE];

  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  req.csrfToken = token;

  if (process.env.NODE_ENV === 'production' && !SAFE_METHODS.has(req.method)) {
    const submittedToken = req.headers[CSRF_HEADER];
    if (!submittedToken || submittedToken !== token) {
      throw new ForbiddenError('Invalid CSRF token');
    }
  }

  next();
};

module.exports = {
  csrfProtection,
};
