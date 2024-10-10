const score = {};

const createScore = (userId) => {
  score[userId] = 0;
};

const getScore = (userId) => {
  return score[userId];
};

const setScore = (userId, data) => {
  // 매개변수 이름을 임의로 정한 상태 입니다.
  // 적절한 이름이 생각나면 변경하겠습니다.

  score[userId] += data;
};

const clearScore = (userId) => {
  return (score[userId] = []);
};

export { createScore, getScore, setScore, clearScore };
