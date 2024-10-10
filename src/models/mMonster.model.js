import redisClient from '../init/redis.js';

const KEY_PREFIX = 'monsterdatas:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 몬스터 메타 데이터 저장
 * @param {*} data Towers 테이블 형식
 */
export const setMonsterDatas = async (arr) => {
  for (let i = 0; i < arr.length; i++) {
    await redisClient.rPush(KEY_PREFIX, JSON.stringify(arr[i]), { EX: TTL });
  }
};

/**
 * 몬스터 메타 데이터 조회
 * @returns {array} 데이터 전체 조회
 */
export const getMonsterDatas = async () => {
  let res = await redisClient.lRange(KEY_PREFIX, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

/**
 * 몬스터 메타 데이터 삭제
 */
export const clearMonsterDatas = () => {
  redisClient.del(KEY_PREFIX);
};
