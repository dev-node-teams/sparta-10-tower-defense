import { getMonsters, setMonster } from '../models/monster.model.js';
import { findMonsters } from '../repositories/monsters.repository.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';
import { setSpecialMonster } from '../models/specialmonster.model.js';
import {
  getMonsterInfo,
  changeSpwanSpecialMonster,
  addScoreAndGold,
} from '../utils/monster.utils.js';
import { getStageDatas } from '../models/mStages.model.js';
import { getMonsterDatas } from '../models/mMonster.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = async (userId, payload) => {
  const { monsterId, monsterLevel } = payload;

  const monsters = await getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }
  const monsterMetadata = await getMonsterDatas();
  // 스페이셜 몬스터 생성 타이밍 확인 및 변경
  let specialMonsters = await changeSpwanSpecialMonster(userId, monsters.length);
  const findMonster = getMonsterInfo(monsterMetadata, monsterId);

  const stagesMetaData = await getStageDatas();
  const findBonusScore = stagesMetaData.find((stage) => stage.stageId === monsterLevel);

  const { totalScore, totalGold } = await addScoreAndGold(userId, findMonster, findBonusScore);


  await setMonster(userId, monsterId, monsterLevel);
  return { status: 'success', handlerId: 21, totalScore, totalGold, specialMonsters };
};

export const specialMonsterKill = async (userId, payload) => {
  const { monsterId, monsterLevel } = payload;

  const specialMonstersMetaData = await getSpecialMonsterDatas(userId);

  if (!specialMonstersMetaData) return { status: 'fail', message: 'Special Monsters not found' };

  console.log('SpecicalMonsterId : ', monsterId);

  const findMonster = getMonsterInfo(specialMonstersMetaData, monsterId);

  const stagesMetaData = await getStageDatas();
  const findBonusScore = stagesMetaData.find((stage) => stage.stageId === monsterLevel);

  const { totalScore, totalGold } = await addScoreAndGold(userId, findMonster, findBonusScore);
  await setSpecialMonster(userId, payload.monsterId, monsterLevel);
  return { status: 'success', handlerId: 22, totalScore, totalGold };
};
