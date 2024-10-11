import { clearGold, getGold, setGold, getTotalGold } from '../models/gold.model.js';
import { clearScore, getScore, setScore, getTotalScore } from '../models/score.model.js';
import { clearStage, setStage } from '../models/stage.model.js';
import { clearMonsters } from '../models/monster.model.js';
import { GameStartService } from '../services/gamestart.service.js';

const gameStartService = new GameStartService();

export const gameStart = async (userId, payload) => {
  // 게임이 시작할 경우 호출되는 Handler

  clearStage(userId);
  clearGold(userId);
  clearScore(userId);
  clearMonsters(userId);

  setStage(userId, 1);
  setScore(userId, 0);
  setGold(userId, 2000);
  //스테이지 모두 정보 조회

  const init = await gameStartService.initSendData();

  // prisma의 동작 과정이 터미널에 출력 되기 때문에 로그를 함께 출력했습니다.
  console.log(`@@ gameStartHandler =>>> `, init.stages);
  console.log(`@@ gameStartHandler =>>> `, init.roundMonsters);
  console.log(`@@ gameStartHandler =>>> `, init.monsters);
  console.log(`@@ gameStartHandler =>>> `, init.towers);
  // 나중에 initInfo 추가하기
  // 유저 초기 점수, 유저 초기 금액
  init.initData = { score: getTotalScore(userId), gold: getTotalGold(userId) };

  if (!init.stages.length) console.log('@@ gameStartHandler - 서버에 스테이지 정보가 없습니다.');
  else if (!init.roundMonsters.length)
    console.log('@@ gameStartHandler - 서버에 라운드 별 몬스터 정보가 없습니다.');
  else if (!init.monsters.length)
    console.log('@@ gameStartHandler - 서버에 몬스터 정보가 없습니다.');
  else if (!init.towers.length) console.log('@@ gameStartHandler - 서버에 타워 정보가 없습니다.');

  return { status: 'success', handlerId: 2, init };
};

export const gameEnd = async (uuid, payload) => {
  //  const userMonsters = getMonsters(userId);
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
  // return { status: 'success', message: 'Game Over' };
};
