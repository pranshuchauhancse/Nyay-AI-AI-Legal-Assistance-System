const mongoose = require('mongoose');

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  res.status(503);
  throw new Error(
    'Database not connected. Start MongoDB and set MONGO_URI in server/.env to use this endpoint.'
  );
};

module.exports = {
  requireDatabase,
};

