import { getMonsters, setMonster } from '../models/monster.model.js';
import { setScore, getTotalScore } from '../models/score.model.js';
import { findMonsters } from '../repositories/monsters.repository.js';
import { setGold, getTotalGold } from '../models/gold.model.js';
import { spawnGoldenGoblin } from '../utils/mymath.js';
import {
  setSpecialMonsters,
  getSpecialMonsters,
  setSpecialMonstersElement,
} from '../models/specialmonster.model.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = async (userId, payload) => {
  const monsterMetadata = await findMonsters();

  const monsters = await getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }
  const specialMonsterSpawn = await getSpecialMonsters(userId);

  //console.log('배열 확인 : ', specialMonsterSpawn);
  let specialMonsters = [];
  for (let i = 0; i < specialMonsterSpawn.length; i++) {
    if (monsters.length === specialMonsterSpawn[i]) {
      console.log('생성하자!!');
      await setSpecialMonstersElement(
        userId,
        spawnGoldenGoblin(monsters.length + 10, monsters.length + 25),
        i,
      );
      specialMonsters.push(await getSpecialMonsterDatas());

      console.log('소환될 스페이셜 몬스터 : ', specialMonsters[i]);
    } else {
      console.log('########################################');
      console.log(
        `special ${i} 번 째 몬스터 잡아야 하는 수 : `,
        monsters.length,
        `, need Kill : `,
        specialMonsterSpawn[i],
      );
      console.log('########################################');
    }
  }
  // if (monsters.length === spawn) {
  //   console.log('생성하자!!');
  //   check = true;
  //   await setSpecialMonsters(userId, spawnGoldenGoblin(monsters.length + 10, monsters.length + 15));
  // } else {
  //   console.log('########################################');
  //   console.log('몬스터 잡아야 하는 수 : ', monsters.length, ', spawn : ', spawn);
  //   console.log('########################################');
  // }

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
