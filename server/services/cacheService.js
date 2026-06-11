const { getRedis } = require('../config/redis');

const getJson = async (key) => {
  const redis = getRedis();
  if (!redis || redis.status !== 'ready') return null;

  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

const setJson = async (key, value, ttlSeconds = 300) => {
  const redis = getRedis();
  if (!redis || redis.status !== 'ready') return;

  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

const delByPattern = async (pattern) => {
  const redis = getRedis();
  if (!redis || redis.status !== 'ready') return;

  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(keys);
  }
};

module.exports = {
  delByPattern,
  getJson,
  setJson,
};
