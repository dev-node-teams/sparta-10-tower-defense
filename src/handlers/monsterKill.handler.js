import { getMonsters, setMonster } from '../models/monster.model.js';
import { findMonsters } from '../repositories/monsters.repository.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';
import { setSpecialMonster } from '../models/specialmonster.model.js';
import {
  getMonsterInfo,
  changeSpwanSpecialMonster,
  addScoreAndGold,
} from '../utils/monster.utils.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = async (userId, payload) => {
  const monsterMetadata = await findMonsters();

  const monsters = await getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  // 스페이셜 몬스터 생성 타이밍 확인 및 변경
  let specialMonsters = await changeSpwanSpecialMonster(userId, monsters.length);

  const findMonster = monsterMetadata.find((monster) => monster.monsterId === payload.monsterId);

  const { totalScore, totalGold } = await addScoreAndGold(userId, findMonster);

  await setMonster(userId, payload.monsterId, payload.monsterLevel);
  return { status: 'success', handlerId: 21, totalScore, totalGold, specialMonsters };
};

export const specialMonsterKill = async (userId, payload) => {
  const { monsterId, monsterLevel } = payload;

  const specialMonstersMetaData = await getSpecialMonsterDatas(userId);

  if (!specialMonstersMetaData) return { status: 'fail', message: 'Special Monsters not found' };

  console.log('SpecicalMonsterId : ', monsterId);

  const findMonster = getMonsterInfo(specialMonstersMetaData, monsterId);

  const { totalScore, totalGold } = await addScoreAndGold(userId, findMonster);
  await setSpecialMonster(userId, payload.monsterId, monsterLevel);
  return { status: 'success', handlerId: 22, totalScore, totalGold };
};
