const towers = {};

//초기화
export const createTower = (uuid) => {
  towers[uuid] = [];
};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const setTower = (uuid, itemId, score, timestamp) => {
  return items[uuid].push({ itemId, score, timestamp });
};

export const clearTower = (uuid) => {
  return (items[uuid] = []);
};
