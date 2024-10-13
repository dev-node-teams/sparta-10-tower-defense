import redisClient from '../init/redis.js';

const KEY_PREFIX = 'spawnspecialmonsters:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 *
 * @param {String} userId  유저 아이디
 * @param {Int} count 특별한 몬스터 죽인 수
 */
export const setSpawnSpecialMonsters = async (userId, array) => {
  for (let i = 0; i < array.length; i++)
    await redisClient.rPush(KEY_PREFIX + userId, JSON.stringify(array[i]), { EX: TTL });
};

export const setSpawnSpecialMonstersElement = async (userId, count, index) => {
  await redisClient.lSet(KEY_PREFIX + userId, index, JSON.stringify(count));
};

/**
 *
 * @param {String} userId 유저의 아이디
 * @param {Int} randomNum 랜덤 넘버
 * @returns
 */
export const getSpawnSpecialMonsters = async (userId) => {
  let res = await redisClient.lRange(KEY_PREFIX + userId, 0, -1);
  res = res.map((element) => JSON.parse(element));
  return res;
};

/**
 *
 * User의 SpecialMonster 초기화
 */
export const clearSpawnSpecialMonsters = async (userId) => {
  await redisClient.del(KEY_PREFIX + userId);
};
