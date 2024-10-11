const golds = {};

const createGold = (userId) => {
  golds[userId] = [];
};

const getGold = (userId) => {
  return golds[userId];
};

const getTotalGold = (userId) => {
  const result = golds[userId].reduce((prev, cur) => {
    return prev + cur;
  });
  return result;
};

const setGold = (userId, data) => {
  // 매개변수 이름을 임의로 정한 상태 입니다.
  // 적절한 이름이 생각나면 변경하겠습니다.
  golds[userId].push(data);
};

const clearGold = (userId) => {
  return (golds[userId] = []);
};

export { createGold, getGold, setGold, clearGold, getTotalGold };
