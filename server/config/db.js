const mongoose = require('mongoose');

const connectDB = async () => {
  // Avoid requests hanging forever when Mongo is unavailable.
  mongoose.set('bufferCommands', false);
  mongoose.set('bufferTimeoutMS', 0);

  if (!process.env.MONGO_URI) {
    console.warn('MongoDB URI not set. Starting server without database connection.');
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB connection skipped: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
