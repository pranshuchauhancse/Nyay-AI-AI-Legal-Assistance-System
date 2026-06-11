const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: req.user?._id,
      role: req.user?.role,
    }, 'api_request');
  });

  next();
};

module.exports = requestLogger;
