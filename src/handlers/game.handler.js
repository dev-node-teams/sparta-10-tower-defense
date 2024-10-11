import { clearGold, getTotalGold, setGold } from '../models/gold.model.js';
import { clearScore, getTotalScore, setScore } from '../models/score.model.js';
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
