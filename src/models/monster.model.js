const monsters = {};

// 게임 시작 시 몬스터 기록 초기화
export const createMonsters = (userId) => {
  monsters[userId] = [];
};

// 몬스터 기록 확인
export const getMonsters = (userId) => {
  console.log(`여기 1 ----->`, monsters)
  return monsters[userId];
};

// 새로운 몬스터 추가 확인 
export const setMonster = (userId, id, level) => {
  console.log(`여기 2 ----->`, monsters)
  return monsters[userId].push({ id, level });
};

// 몬스터 기록 초기화
export const clearMonsters = (userId) => {
  return (monsters[userId] = []);
};