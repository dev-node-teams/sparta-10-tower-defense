import redisClient from '../init/redis.js';

const KEY_PREFIX = 'tokens:';
const TTL = 60 * 60 * 24 * 7; // 7일

export const storeRefreshToken = async (token, userId) => {
  await redisClient.set(KEY_PREFIX + userId, token, TTL); // 7일 만료
};

export const clearRefreshToken = async (userId) => {
  await redisClient.del(KEY_PREFIX + userId);
};
