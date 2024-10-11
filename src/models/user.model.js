import redisClient from '../init/redis.js';

const KEY_PREFIX = 'users:';
const TTL = 60 * 60 * 24 * 7; // 7일

// 유저가 접속하면 호출되는 함수
const addUser = async (user) => {
  /**
   * hash 자료구조로 저장 (rdb 테이블과 유사)
   * KEY_PREFIX -> 기본키
   * user.socketId -> 컬럼
   * JSON.stringify(user) -> 값
   */
  await redisClient.hSet(KEY_PREFIX, user.socketId, JSON.stringify(user), { EX: TTL });
};

// 유저가 접속 해제 할 때 호출되는 함수
const removeUser = async (socketId) => {
  /**
   * KEY_PREFIX 기본키, 접속 해제한 유저의 socketId 컬럼 조회
   */
  const user = await redisClient.hGet(KEY_PREFIX, socketId);

  /**
   * 조회된 유저의 데이터 삭제
   */
  if (user) {
    await redisClient.hDel(KEY_PREFIX, socketId);
    return JSON.parse(user);
  }

  return null;
};

// 유저 조회하면 호출됨
// @@@ 얘도 참조하는 파일이 없습니다
const getUser = async () => {
  /**
   * KEY_PREFIX 기본키 전체 조회
   */
  const users = await redisClient.hGetAll(KEY_PREFIX);

  // 가져온 데이터가 객체로 반환되므로 값을 배열로 변환합니다.
  return Object.values(users).map((user) => JSON.parse(user));
};

export { addUser, getUser, removeUser };
