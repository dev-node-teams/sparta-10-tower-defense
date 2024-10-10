import redisClient from '../init/redis.js';

const KEY_PREFIX = 'dataversions:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 메타 데이터 버전 조회
 */
export const getDataVersion = async () => {
  const version = await redisClient.get(KEY_PREFIX);
  return version;
};

export const setDataVersion = async (version) => {
  await redisClient.set(KEY_PREFIX, version, {
    EX: TTL,
  });
};

/**
 * 메타 데이터 버전 등록
 */
export const clearDataVersion = (uuid) => {
  redisClient.del(KEY_PREFIX);
};
