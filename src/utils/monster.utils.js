import { setGold, getTotalGold } from '../models/gold.model.js';
import { setScore, getTotalScore } from '../models/score.model.js';

export const getMonsterInfo = (monsterMetaData, monsterId) => {
  return monsterMetaData.find((monster) => monster.monsterId === monsterId);
};

export const AddScoreAndGold = async (userId, findMonster) => {
  await setScore(userId, findMonster.score);
  const totalScore = await getTotalScore(userId);

  await setGold(userId, findMonster.point);
  const totalGold = await getTotalGold(userId);

  return { totalScore, totalGold };
};
