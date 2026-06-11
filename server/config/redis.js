const Redis = require('ioredis');
const logger = require('../utils/logger');

let client;

const getRedis = () => {
  if (!process.env.REDIS_URL) return null;

  if (!client) {
    client = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    client.on('error', (error) => {
      logger.warn({ error: error.message }, 'redis_error');
    });
  }

  return client;
};

const connectRedis = async () => {
  const redis = getRedis();
  if (!redis) {
    logger.info('redis_disabled');
    return null;
  }

  if (redis.status === 'wait') {
    await redis.connect();
  }

  logger.info('redis_connected');
  return redis;
};

module.exports = {
  connectRedis,
  getRedis,
};
