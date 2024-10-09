const towers = {};

//초기화
export const createTower = (uuid) => {
  towers[uuid] = [];
};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const setTower = (uuid, position) => {
  return towers[uuid].push({ position });
};

export const clearTower = (uuid) => {
  return (towers[uuid] = []);
};
