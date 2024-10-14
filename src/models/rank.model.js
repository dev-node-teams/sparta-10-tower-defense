import redisClient from '../init/redis.js';

const HIGHSCORE_KEY_PREFIX = 'highscore:';
const RANK_KEY_PREFIX = 'ranks:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 유저별 최고 점수 조회
 * @param {*} userId
 * @returns highScore
 */
export const getHighScore = async (userId) => {
  const highScore = await redisClient.get(HIGHSCORE_KEY_PREFIX + userId);
  return +highScore;
};

/**
 * 유저별 최고 점수 저장
 * @param {*} userId
 * @returns
 */
export const setHighScore = async (userId, score) => {
  await redisClient.set(HIGHSCORE_KEY_PREFIX + userId, score, { EX: TTL });
};

/**
 * 유저 랭킹 저장
 * @param {*} userId
 * @param {*} score
 */
export const setUserRank = async (userId, score) => {
  await redisClient.zAdd(RANK_KEY_PREFIX, { score: score, value: userId + '' });
};

/**
 * 유저 랭킹 조회
 * @param {*} userId
 * @param {*} score
 */
export const getUserRank = async (userId) => {
  const rank = await redisClient.zRevRank(RANK_KEY_PREFIX, userId + '');
  console.log('rank =>>> ', rank);
  return rank + 1;
};

/**
 * 전체 랭킹 조회
 * @returns {array}
 */
export const getAllRanks = async () => {
  return (await redisClient.zRangeWithScores(RANK_KEY_PREFIX, 0, -1)).sort(
    (a, b) => b.score - a.score,
  );
  //   return await redisClient.sendCommand(['ZREVRANGE', RANK_KEY_PREFIX, '0', '-1', 'WITHSCORES']);
};
