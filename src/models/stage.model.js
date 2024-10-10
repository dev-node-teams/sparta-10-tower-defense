const stages = {};

const createStage = (userId) => {
  stages[userId] = [{ id: 1 }];
};

const getStage = (userId) => {
  return stages[userId];
};

const setStage = (userId, data) => {
  // 매개변수 이름을 임의로 정한 상태 입니다.
  // 적절한 이름이 생각나면 변경하겠습니다.

  return stages[userId].push({ id: data });
};

const clearStage = (userId) => {
  stages[userId] = [];
  // return (stages[userId] = []);
  // 기존 개인 과제에서는 stages[uuid] = []으로, key에 따른 빈 배열은 남겼지만,
  // delete stages[uuid]로 게임이 종료될 때, key와 value를 그냥 객체에서 지워버린다.
};

export { createStage, getStage, setStage, clearStage };
