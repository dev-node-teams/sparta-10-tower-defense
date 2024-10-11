import redisClient from '../init/redis.js';

const KEY_PREFIX = 'golddatas:';
const TTL = 60 * 60 * 24 * 7; // 7일

// Redis 리스트 빈 배열로 저장
const createGold = async (userId) => {
  await redisClient.lTrim(KEY_PREFIX + userId, 1, 0); // 빈 리스트로 초기화
};

// Redis 리스트 모든 요소 조회
const getGold = async (userId) => {
  const res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

// Redis 리스트 gold 요소 총합 계산
const getTotalGold = async (userId) => {
  const goldArray = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);

  // 빈 배열이면 0원
  if (!goldArray || goldArray.length === 0) {
    return 0;
  }

  const totalGold = goldArray.map((e) => JSON.parse(e)).reduce((acc, cur) => acc + cur, 0);

  return totalGold;
};

// Redis 리스트 요소 추가
const setGold = async (userId, data) => {
  await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify(data), { EX: TTL });
};

// Redis 리스트 빈 배열로
const clearGold = async (userId) => {
  await redisClient.lTrim(KEY_PREFIX + userId, 1, 0);
};

export { createGold, getGold, setGold, clearGold, getTotalGold };
