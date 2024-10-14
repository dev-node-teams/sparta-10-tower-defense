import { setGold, getTotalGold } from '../models/gold.model.js';
import { setScore, getTotalScore } from '../models/score.model.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';
import {
  getSpawnSpecialMonsters,
  setSpawnSpecialMonstersElement,
} from '../models/spawnspecialmonster.model.js';
import { spawnSpecialMonster } from './mymath.js';

export const getMonsterInfo = (monsterMetaData, monsterId) => {
  return monsterMetaData.find((monster) => monster.monsterId === monsterId);
};

export const addScoreAndGold = async (userId, findMonster) => {
  await setScore(userId, findMonster.score);
  const totalScore = await getTotalScore(userId);

  await setGold(userId, findMonster.point);
  const totalGold = await getTotalGold(userId);

  return { totalScore, totalGold };
};

export const changeSpwanSpecialMonster = async (userId, userKillMonster) => {
  const specialMonsterSpawn = await getSpawnSpecialMonsters(userId);
  let specialMonsters = [];
  for (let i = 0; i < specialMonsterSpawn.length; i++) {
    if (userKillMonster === specialMonsterSpawn[i]) {
      await setSpawnSpecialMonstersElement(
        userId,
        spawnSpecialMonster(userKillMonster + 20, userKillMonster + 30),
        i,
      );
      specialMonsters.push(await getSpecialMonsterDatas());
    }
  }
  return specialMonsters;
};
