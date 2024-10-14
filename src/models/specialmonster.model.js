import redisClient from '../init/redis.js';

const KEY_PREFIX = 'specialmonsterdatas:';
const TTL = 60 * 60 * 24 * 7; // 7일

// 유저가 죽인 스페이셜 몬스터 기록 확인
export const getSpecialMonsters = async (userId) => {
  let res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

// 유저가 죽인 스페이셜 몬스터 기록 추가
export const setSpecialMonster = async (userId, monsterId, level) => {
  return await redisClient.rPush(
    KEY_PREFIX + userId,
    JSON.stringify({ monsterId, level }, { EX: TTL }),
  );
};

// 유저가 죽인 스페이셜 몬스터 몬스터 기록 초기화
export const clearSpecialMonsters = async (userId) => {
  return await redisClient.lTrim(KEY_PREFIX + userId, 1, 0);
};
