import { getMonsters, setMonster } from '../models/monster.model.js';
import { findMonsters } from '../repositories/monsters.repository.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';
import { setSpecialMonster } from '../models/specialmonster.model.js';
import {
  getMonsterInfo,
  changeSpwanSpecialMonster,
  addScoreAndGold,
} from '../utils/monster.utils.js';
import { getStage } from '../models/stage.model.js';
import { getStageDatas } from '../models/mStages.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = async (userId, payload) => {
  let currentStages = await getStage(userId); // 유저가 보유한 스테이지
  if (!currentStages) {
    await createStage(userId);
    currentStages = await getStage(userId);
  }

  if (!currentStages.length) {
    return { status: 'fail', message: '스테이지가 없습니다.' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  if (currentStages.length > 0) {
    currentStages.sort((a, b) => a.id - b.id);
  }

  const currentStage = currentStages[currentStages.length - 1].id; // 유저의 현재 스테이지 id number
  const stageDatas = await getStageDatas();
  const bonusScore = stageDatas.find((stage) => stage.stageId === currentStage)?.bonusScore;

  const monsterMetadata = await findMonsters();

  const monsters = await getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  // 스페이셜 몬스터 생성 타이밍 확인 및 변경
  let specialMonsters = await changeSpwanSpecialMonster(userId, monsters.length);

  const findMonster = monsterMetadata.find((monster) => monster.monsterId === payload.monsterId);

  const { totalScore, totalGold } = await addScoreAndGold(userId, findMonster, bonusScore);

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
