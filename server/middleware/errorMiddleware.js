const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

/**
 * STEP 6: Improved error handling middleware
 * Returns consistent error response format:
 * { success: false, error: "...", code: "..." }
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  
  // Map status codes to error codes
  const errorCodeMap = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    429: 'RATE_LIMITED',
    503: 'SERVICE_UNAVAILABLE',
    500: 'INTERNAL_ERROR',
  };

  const errorCode = errorCodeMap[statusCode] || 'INTERNAL_ERROR';
  const message = err.message || 'An error occurred';

  // Log errors for debugging (don't expose to client)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${errorCode}] ${message}`);
    if (err.stack) console.error(err.stack);
  } else {
    // Log to external service in production (e.g., Sentry)
    console.error(`[${errorCode}] ${message} at ${new Date().toISOString()}`);
  }

  // Return consistent error response
  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
      code: errorCode,
    },
    // Stack trace only in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
