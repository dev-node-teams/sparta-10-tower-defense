import { getMonsters, setMonster } from '../models/monster.model.js';

// 몬스터 kill 시 작동하는 핸들러
export const monsterKill = (userId, payload) => {
  const monsters = getMonsters(userId);
  if (!monsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  setMonster(userId, payload.monsterId, payload.monsterLevel);
  return { status: 'success', message: 'Monster died' };
};