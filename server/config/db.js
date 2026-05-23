const mongoose = require('mongoose');

let memoryServer;

const connectMemoryDB = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'nyay_ai',
    },
  });

  const uri = memoryServer.getUri();
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB memory server connected: ${conn.connection.host}`);
  return true;
};

const connectDB = async () => {
  // Avoid requests hanging forever when Mongo is unavailable.
  mongoose.set('bufferCommands', false);
  mongoose.set('bufferTimeoutMS', 0);

  if (!process.env.MONGO_URI) {
    console.warn('MongoDB URI not set. Starting local memory MongoDB.');
    return connectMemoryDB();
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    if (process.env.DISABLE_MEMORY_DB === 'true') {
      console.warn(`MongoDB connection skipped: ${error.message}`);
      return false;
    }

    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Starting local memory MongoDB for development.');
    return connectMemoryDB();
  }
};

module.exports = connectDB;
