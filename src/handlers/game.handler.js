import { clearGold, getTotalGold, setGold } from '../models/gold.model.js';
import { clearScore, getTotalScore, setScore } from '../models/score.model.js';
import { clearStage, setStage } from '../models/stage.model.js';
import { clearMonsters, getMonsters } from '../models/monster.model.js';
import { GameStartService } from '../services/gamestart.service.js';
import {
  clearSpawnSpecialMonsters,
  setSpawnSpecialMonsters,
  getSpawnSpecialMonsters,
} from '../models/spawnspecialmonster.model.js';
import { spawnGoldenGoblin } from '../utils/mymath.js';

const gameStartService = new GameStartService();
export const gameStart = async (userId, payload) => {
  // 게임이 시작할 경우 호출되는 Handler

  await clearStage(userId);
  await clearGold(userId);
  await clearScore(userId);
  await clearMonsters(userId);
  await clearSpawnSpecialMonsters(userId);

  await setStage(userId, 1);
  await setScore(userId, 0);
  await setGold(userId, 2000);

  let specialMonsterSpawnTime = [];

  const init = await gameStartService.initSendData();

  for (let i = 0; i < init.specialMonsters.length; i++)
    specialMonsterSpawnTime.push(spawnGoldenGoblin(10, 25));

  await setSpawnSpecialMonsters(userId, specialMonsterSpawnTime);

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

  console.log(`@@ gameStartHandler =>>> `, init.stages);
  console.log(`@@ gameStartHandler =>>> `, init.towers);
  console.log(`@@ gameStartHandler =>>> `, init.monsters);
  console.log(`@@ gameStartHandler =>>> `, init.specialMonsters);

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

  //유저 초기 점수, 유저 초기 보유 금액 추가하기
  init.initData = { score: await getTotalScore(userId), gold: await getTotalGold(userId) };

  if (!init.stages.length) console.log('@@ gameStartHandler - 서버에 스테이지 정보가 없습니다.');
  else if (!init.monsters.length)
    console.log('@@ gameStartHandler - 서버에 몬스터 정보가 없습니다.');
  else if (!init.specialMonsters.length)
    console.log('@@ gameStartHandler - 서버에 스페이셜 몬스터 정보가 없습니다.');
  else if (!init.towers.length) console.log('@@ gameStartHandler - 서버에 타워 정보가 없습니다.');

  return { status: 'success', handlerId: 2, ...init };
};

export const gameEnd = async (userId, payload) => {
  const userMonsters = await getMonsters(userId);

  // if (!userMonsters) {
  //   return { status: 'fail', message: 'Monsters not found' };
  // }

  // let verificationScore = 0;
  // for (let i = 0; i < userMonsters.length; i++) {
  //   verificationScore += (userMonsters[i].level + 1) * 100;
  // }
  // if (verificationScore !== payload.score) {
  //   return { status: 'fail', message: 'Score verification failed' };
  // }
  return { status: 'success', message: 'Game Over' };
};
