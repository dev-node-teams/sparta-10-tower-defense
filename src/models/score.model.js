// const score = {};

// const createScore = (userId) => {
//   score[userId] = [];
// };

// const getScore = (userId) => {
//   return score[userId];
// };

// const setScore = (userId, data) => {
//   // 매개변수 이름을 임의로 정한 상태 입니다.
//   // 적절한 이름이 생각나면 변경하겠습니다.

//   score[userId].push(data);
// };

// const getTotalScore = (userId) => {
//   return score[userId].reduce((acc, cur) => {
//     return acc + cur;
//   });
// };

// const clearScore = (userId) => {
//   return (score[userId] = []);
// };

import redisClient from '../init/redis.js';

const KEY_PREFIX = 'scoredatas:';
const TTL = 60 * 60 * 24 * 7; // 7일

// Redis 리스트 빈 배열로 저장
const createScore = async (userId) => {
  await redisClient.lTrim(KEY_PREFIX + userId, 1, 0); // 빈 리스트로 초기화
};

// Redis 리스트 모든 요소 조회
const getScore = async (userId) => {
  const res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

// Redis 리스트 Score 요소 총합 계산
const getTotalScore = async (userId) => {
  const ScoreArray = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);

  // 빈 배열이면 0원
  if (!ScoreArray || ScoreArray.length === 0) {
    return 0;
  }

  const totalScore = ScoreArray.map((e) => JSON.parse(e)).reduce((acc, cur) => acc + cur, 0);

  return totalScore;
};

// Redis 리스트 요소 추가
const setScore = async (userId, data) => {
  await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify(data), { EX: TTL });
};

// Redis 리스트 빈 배열로
const clearScore = async (userId) => {
  await redisClient.lTrim(KEY_PREFIX + userId, 1, 0);
};

export { createScore, getScore, setScore, clearScore, getTotalScore };
