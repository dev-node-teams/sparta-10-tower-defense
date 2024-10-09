const towers = {};

//초기화
export const createTower = (userId) => {
  towers[userId] = [];
};

export const getTower = (userId) => {
  return towers[userId];
};

export const setTower = (userId, position) => {
  return towers[userId].push({ position });
};

export const clearTower = (userId) => {
  return (towers[userId] = []);
};
