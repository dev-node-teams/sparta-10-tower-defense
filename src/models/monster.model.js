import redisClient from '../init/redis.js';

const KEY_PREFIX = 'monsterdatas:';
const TTL = 60 * 60 * 24 * 7; // 7일

// 게임 시작 시 몬스터 기록 초기화
export const createMonsters = async (userId) => {
  await redisClient.lTrim(KEY_PREFIX + userId, 1, 0); // 빈 리스트로 초기화
};

// 몬스터 기록 확인
export const getMonsters = async (userId) => {
  let res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

// 새로운 몬스터 추가 확인
export const setMonster = async (userId, id, level) => {
  return await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify({ id, level }, { EX: TTL }));
};

// 몬스터 기록 초기화
export const clearMonsters = async (userId) => {
  return await redisClient.lTrim(KEY_PREFIX + userId, 1, 0);
};
