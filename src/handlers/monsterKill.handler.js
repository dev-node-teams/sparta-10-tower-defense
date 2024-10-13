import { getMonsters, setMonster } from '../models/monster.model.js';
import { setScore, getTotalScore } from '../models/score.model.js';
import { findMonsters } from '../repositories/monsters.repository.js';
import { setGold, getTotalGold } from '../models/gold.model.js';
import { spawnGoldenGoblin } from '../utils/mymath.js';
import {
  getSpawnSpecialMonsters,
  setSpawnSpecialMonstersElement,
} from '../models/spawnspecialmonster.model.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = async (userId, payload) => {
  const monsterMetadata = await findMonsters();

  const monsters = await getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  // 스페이셜 몬스터 생성 타임 변경
  let specialMonsters = [];
  for (let i = 0; i < specialMonsterSpawn.length; i++) {
    if (monsters.length === specialMonsterSpawn[i]) {
      await setSpawnSpecialMonstersElement(
        userId,
        spawnGoldenGoblin(monsters.length + 10, monsters.length + 25),
        i,
      );
      specialMonsters.push(await getSpecialMonsterDatas());
    }
  }

  const findMonsterId = monsterMetadata.find(
    (monster) => monster.monsterId === payload.monsterId + 1,
  );

  await setScore(userId, findMonsterId.score);
  let totalScore = await getTotalScore(userId);

  await setGold(userId, findMonsterId.point);
  let totalGold = await getTotalGold(userId);

  await setMonster(userId, payload.monsterId, payload.monsterLevel);
  return { status: 'success', handlerId: 21, totalScore, totalGold, specialMonsters };
};

export const specialMonsterKill = async (userId, payload) => {
  const { monsterId, monsterLevel } = payload;
  const specialMonsterSpawn = await getSpawnSpecialMonsters(userId);
};
