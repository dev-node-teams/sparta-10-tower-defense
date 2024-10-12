import redisClient from '../init/redis.js';

const KEY_PREFIX = 'users:';
const TTL = 60 * 60 * 24 * 7; // 7일

// 유저가 접속하면 호출되는 함수
const addUser = async (user) => {
  await redisClient.set(KEY_PREFIX + user.userId, JSON.stringify(user), TTL);
};

// 유저가 접속 해제 할 때 호출되는 함수
const removeUser = async (userId) => {
  await redisClient.del(KEY_PREFIX + userId);
};

// 유저 조회하면 호출됨
const getUser = async () => {
  // userId로 구분된 키들 전체 조회 어떻게 하죠???????????????????????????
};

export { addUser, getUser, removeUser };
