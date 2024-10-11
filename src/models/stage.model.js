import redisClient from '../init/redis.js';

const KEY_PREFIX = 'stagedatas:';
const TTL = 60 * 60 * 24 * 7; // 7일

// redis stagedatas:userId 키에 초기 스테이지 객체 push
const createStage = async (userId) => {
  await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify({ id: 1 }), { EX: TTL });
};
// redis stagedatas:userId 키의 모든 요소 조회
const getStage = async (userId) => {
  let res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};
// redis stagedatas:userId 키에 data로 받아온 스테이지 객체 추가
const setStage = async (userId, data) => {
  await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify({ id: data }), { EX: TTL });
};
// redis stagedatas:userId 키를 모든 요소를 제거하여 빈배열로
const clearStage = async (userId) => {
  await redisClient.lTrim(KEY_PREFIX + userId, 1, 0);
};

export { createStage, getStage, setStage, clearStage };
