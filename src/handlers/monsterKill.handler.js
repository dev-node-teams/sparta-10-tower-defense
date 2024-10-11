import { getMonsters, setMonster } from '../models/monster.model.js';
import { getScore, setScore, getTotalScore } from '../models/score.model.js';
import { findMonsters } from '../repositories/monsters.repository.js';
import { getGold, setGold, getTotalGold } from '../models/gold.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = async (userId, payload) => {
  const monsterMetadata = await findMonsters();

  const monsters = getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  const findMonsterId = monsterMetadata.find(
    (monster) => monster.monsterId === payload.monsterId + 1,
  );

  setScore(userId, findMonsterId.point);
  let totalScore = await getTotalScore(userId);
  console.log(`스코어 ----> `, totalScore);

  setGold(userId,  findMonsterId.point);
  let totalGold = await getTotalGold(userId);
  console.log(`골드 ----> `, totalGold);


  setMonster(userId, payload.monsterId, payload.monsterLevel);
  return { status: 'success', handlerId: 21, totalScore, totalGold };
};
