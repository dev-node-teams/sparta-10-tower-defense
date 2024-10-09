import { clearGold, getGold, setGold } from '../models/gold.model.js';
import { clearScore, getScore, setScore } from '../models/score.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { prisma } from '../utils/prisma/index.js';
import AuthUtils from '../utils/auth.utils.js';

export const gameStart = async (token, payload) => {
  // 게임이 시작할 경우 호출되는 Handler

  console.log('------------------------------------');
  console.log('token : ', token);
  const userId = AuthUtils.verify(token);
  console.log('userId : ', userId);
  console.log('------------------------------------');
  clearStage(userId);
  clearGold(userId);
  clearScore(userId);

  setStage(userId, 1);
  setScore(userId, 0);
  setGold(userId, 2000);

  //스테이지 모두 정보 조회
  const stage = await prisma.Stage.findMany();
  // score는 충죽해야하는 점수, bonusScore는 스테이지 당 보너스 점수

  const roundMonster = await prisma.CreateMonsterPerStage.findMany();
  // 스테이지 별 생성 돼야 하는 몬스터 정보 제공

  const monsterArray = await prisma.Monsters.findFirst();
  // 각각의 몬스터 정보 모두 가져온다.

  const towerArray = await prisma.Towers.findMany();
  // 각각의 타워 정보 모두 가져오기

  const initInfo = { gold: getGold(userId), socre: getScore(userId) };

  // prisma의 동작 과정이 터미널에 출력 되기 때문에 로그를 함께 출력했습니다.
  console.log(`@@ gameStartHandler - ${1} Stage =>>> `, initInfo);
  //console.log(`@@ gameStartHandler - ${1} Stage =>>> `, stage);
  console.log(`@@ gameStartHandler - ${1} StageMonsters =>>> `, monsterArray);
  console.log(`@@ gameStartHandler - ${1} StageTower =>>> `, towerArray);
  // 나중에 initInfo 추가하기
  return { status: 'success', initInfo, stage, roundMonster, towerArray };
};

export const gameEnd = async (uuid, payload) => {
  //
  // 이 함수 호출들은 맨 마지막 return 위에 존재 해야 합니다.
  // deteleStage(uuid);
  // deleteGold(uuid);
  // deleteScore(uuid);
};
