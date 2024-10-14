export const spawnSpecialMonster = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
