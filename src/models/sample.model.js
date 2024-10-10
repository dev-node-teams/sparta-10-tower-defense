import redisClient from '../init/redis.js';

const SAMPLE_KEY_PREFIX = 'sample:';
const SAMPLE_LOG_KEY_PREFIX = 'sample:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * SAMPLE : SET 사용, json object를 문자열로 변환해서 저장.
 */
export const initSample = async () => {
  await redisClient.set(SAMPLE_KEY_PREFIX, JSON.stringify({ score: 0, userId: '' }), {
    EX: TTL,
  });
};

/**
 * SAMPLE : GET 사용, JSON OBJ 파싱
 */
export const getSample = async () => {
  // return rank['highScore'];
  const highScore = await redisClient.get(SAMPLE_KEY_PREFIX);
  return JSON.parse(highScore);
};

/**
 * SAMPLE : del 사용, 이력 초기화
 */
export const clearSample = (uuid) => {
  redisClient.del(SAMPLE_KEY_PREFIX + uuid);
};

// -------- 리스트

export const setSampleLog = async (uuid, stageId, itemId, itemScore, timestamp) => {
  await redisClient.rPush(
    SAMPLE_LOG_KEY_PREFIX + uuid,
    JSON.stringify({ stageId, itemId, itemScore, timestamp }),
    { EX: TTL },
  );
};

export const getSampleLog = async (uuid) => {
  // 0, -1 이 전체
  let res = await redisClient.lRange(SAMPLE_LOG_KEY_PREFIX + uuid, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};
