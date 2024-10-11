const score = {};

const createScore = (userId) => {
  score[userId] = [];
};

const getScore = (userId) => {
  return score[userId];
};

const setScore = (userId, data) => {
  // 매개변수 이름을 임의로 정한 상태 입니다.
  // 적절한 이름이 생각나면 변경하겠습니다.

  score[userId].push(data);
};

const getTotalScore = (userId) => {
  return score[userId].reduce((acc, cur) => {
    return acc + cur;
  });
};

const clearScore = (userId) => {
  return (score[userId] = []);
};

export { createScore, getScore, setScore, clearScore, getTotalScore };
