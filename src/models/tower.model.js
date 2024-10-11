import redisClient from '../init/redis.js';

const KEY_PREFIX = 'towers:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 타워 보유 추가
 * @param {*} data Towers 테이블 형식
 */
export const setTower = async (userId, towerType, position) => {
  await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify({ towerType, position })),
    { EX: TTL };
};

/**
 * 타워 보유 조회
 * @returns {array} 데이터 전체 조회
 */
export const getTower = async (userId) => {
  let res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

/**
 * 타워 초기화
 */
export const clearTower = async (userId) => {
  await redisClient.del(KEY_PREFIX + userId);
};

/**
 * 타워 보유 갱신
 */
export const updateTower = async (userId, towers) => {
  await redisClient.del(KEY_PREFIX + userId);
  for (let i = 0; i < towers.length; i++) {
    await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify(towers[i]), { EX: TTL });
  }
};
