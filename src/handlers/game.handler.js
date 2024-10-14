import { clearGold, getTotalGold, setGold } from '../models/gold.model.js';
import { clearScore, getTotalScore, setScore } from '../models/score.model.js';
import { clearStage, setStage } from '../models/stage.model.js';
import { clearMonsters, getMonsters } from '../models/monster.model.js';
import { GameStartService } from '../services/gamestart.service.js';
import {
  clearSpawnSpecialMonsters,
  setSpawnSpecialMonsters,
} from '../models/spawnspecialmonster.model.js';
import { spawnSpecialMonster } from '../utils/mymath.js';
import { getSpecialMonsters, clearSpecialMonsters } from '../models/specialmonster.model.js';
import { getMonsterDatas } from '../models/mMonster.model.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';
import { getStageDatas } from '../models/mStages.model.js';

const gameStartService = new GameStartService();
export const gameStart = async (userId, payload) => {
  // 게임이 시작할 경우 호출되는 Handler

  await clearStage(userId);
  await clearGold(userId);
  await clearScore(userId);
  await clearMonsters(userId);
  await clearSpecialMonsters(userId);
  await getSpecialMonsters(userId);

  await setStage(userId, 1);
  await setScore(userId, 0);
  await setGold(userId, 2000);

  let specialMonsterSpawnTime = [];

  const init = await gameStartService.initSendData();

  for (let i = 0; i < init.specialMonsters.length; i++)
    specialMonsterSpawnTime.push(spawnSpecialMonster(20, 30));

  await setSpawnSpecialMonsters(userId, specialMonsterSpawnTime);

  //유저 초기 점수, 유저 초기 보유 금액 추가하기
  init.initData = {
    score: await getTotalScore(userId),
    gold: await getTotalGold(userId),
    stageThreshHold: 1000,
  };

  if (!init.stages.length) console.log('@@ gameStartHandler - 서버에 스테이지 정보가 없습니다.');
  else if (!init.monsters.length)
    console.log('@@ gameStartHandler - 서버에 몬스터 정보가 없습니다.');
  else if (!init.specialMonsters.length)
    console.log('@@ gameStartHandler - 서버에 스페이셜 몬스터 정보가 없습니다.');
  else if (!init.towers.length) console.log('@@ gameStartHandler - 서버에 타워 정보가 없습니다.');

  return { status: 'success', handlerId: 2, ...init };
};

export const gameEnd = async (userId, payload) => {
  const { score } = payload;

  const monsters = await getMonsters(userId);
  const specialMonsters = await getSpecialMonsters(userId);

  console.log('죽인 monsters : ', monsters, ',죽인 specialMonsters : ', specialMonsters);

  const monsterMetaData = await getMonsterDatas();

  console.log('monsterMetaData : ', monsterMetaData);
  const specialMonsterMetaData = await getSpecialMonsterDatas();
  const stagesMetaData = await getStageDatas();

  let totalScore = 0;
  for (let i = 0; i < monsters.length; i++) {
    const findMonsterMetaData = monsterMetaData.find(
      (metaData) => metaData.monsterId === monsters[i].monsterId,
    );
    //TODO: 스테이지에 따른 보너스 점수 조회 및 추가
    console.log('findMonsterMetaData : ', findMonsterMetaData, 'monster : ', monsters[i]);
    totalScore += findMonsterMetaData.score; //+ //findStagesMetaData.bonusScore;
  }

  for (let i = 0; i < specialMonsters.length; i++) {
    const findSpecialMetaData = specialMonsterMetaData.find(
      (metaData) => metaData.monsterId === specialMonsters[i].monsterId,
    );
    //TODO: 스테이지에 따른 보너스 점수 조회 및 추가
    console.log('findSpecialMetaData : ', findSpecialMetaData);
    totalScore += findSpecialMetaData.score; // + //findStagesMetaData.bonusScore;
  }
  console.log('일반, 스페이셜 몬스터 죽일 경우 최종 점수 : ', totalScore);

  console.log('score : ', score, 'totalScore : ', totalScore);

  return { status: 'success', message: 'Game Over', score: payload.score };
};
