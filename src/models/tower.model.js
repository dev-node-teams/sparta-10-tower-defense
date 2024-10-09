const towers = {};

//초기화
export const createTower = (uuid) => {
  towers[555] = [];
};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const setTower = (uuid, position) => {
  return towers[555].push({ position });
};

export const clearTower = (uuid) => {
  return (towers[uuid] = []);
};
