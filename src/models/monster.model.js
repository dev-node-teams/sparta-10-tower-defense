// const monsters = {};

// // 게임 시작 시 몬스터 기록 초기화
// export const createMonsters = (userId) => {
//   monsters[userId] = [];
// };

// // 몬스터 기록 확인
// export const getMonsters = (userId) => {
//   console.log(`여기 1 ----->`, monsters)
//   return monsters[userId];
// };

// // 새로운 몬스터 추가 확인 
// export const setMonster = (userId, id, level) => {
//   console.log(`여기 2 ----->`, monsters)
//   return monsters[userId].push({ id, level });
// };

// // 몬스터 기록 초기화
// export const clearMonsters = (userId) => {
//   return (monsters[userId] = []);
// };

import redisClient from '../init/redis.js';

const KEY_PREFIX = 'monsters:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 몬스터 메타 데이터 저장
 * @param {*} data
 */
export const setMonster = async (userId, id, level) => {
  await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify({ id, level }), { EX: TTL })
};

/**
 * 몬스터 메타 데이터 조회
 * @returns {array} 데이터 전체 조회
 */
export const getMonsters = async (userId) => {
  let res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

/**
 * 몬스터 메타 데이터 삭제
 */
export const clearMonsters = async (userId) => {
  await redisClient.del(KEY_PREFIX + userId);
};