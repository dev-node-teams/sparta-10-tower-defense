import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getMonsters } from '../models/monster.model.js';
import { getTower } from '../models/tower.model.js';
import { StagesRepository } from '../repositories/stages.repository.js';

export const moveStage = (userId, payload) => {
  // 다음 스테이지의 존재 여부 확인
  const stages = [
    { id: 1, score: 100, bonusScore: 0 },
    { id: 2, score: 500, bonusScore: 50 },
    { id: 3, score: 1000, bonusScore: 100 },
    { id: 4, score: 3000, bonusScore: 300 },
    { id: 5, score: 5000, bonusScore: 500 },
  ];
  // let stages = new StagesRepository();
  // stages.viewEntireStages();

  // console.log('콘솔을 찍으셧나요?: ', stages);

  /** 스테이지 검증 시작 */
  if (!stages.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: '다음 스테이지가 없습니다.' };
  }

  let currentStages = getStage(userId);
  if (!currentStages) {
    createStage(userId);
    currentStages = getStage(userId);
  }

  if (!currentStages.length) {
    return { status: 'fail', message: '스테이지가 없습니다.' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  if (currentStages.length > 0) {
    currentStages.sort((a, b) => a.id - b.id);
  }
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: '현재 스테이지가 일치하지 않습니다.' };
  }
  /** 스테이지 검증 끝 */

  /** 잡은 몬스터로 골드 검증 시작 */
  // 잡은 몬스터 배열
  // let currentMonsters = getMonsters(userId);
  // let currentMonsters = [
  //   { id: 1, point: 50 },
  //   { id: 2, point: 60 },
  //   { id: 3, point: 70 },
  //   { id: 4, point: 80 },
  //   { id: 5, point: 90 },
  // ];

  // // 잡은 몬스터 배열로 점수 합계
  // let scoreByMonsters = currentMonsters.reduce((acc, cur) => {
  //   return (acc += Number(cur.point));
  // }, 0);
  // // 타겟 스테이지 정보
  // let targetStageFromData = stages.filter((stage) => stage.id === payload.targetStage);

  // if (scoreByMonsters < targetStageFromData[0].score) {
  //   console.log(`!! ${userId}가 올바르지 않은 점수로 스테이지 이동 시도`);
  //   return { status: 'fail', message: '점수가 올바르지 않습니다.' };
  // }
  /** 잡은 몬스터로 골드 검증 끝 */

  /** 타워 구입 이력 검증 시작 */
  let placeTower = getTower(userId);
  console.log('@@@@@@@@@@@@@@@:', placeTower);
  /** 타워 구입 이력 검증 끝 */

  // 유저의 다음 스테이지 정보 업데이트
  setStage(userId, payload.targetStage);
  return {
    status: 'success',
    message: '스테이지 이동',
    handlerId: 4,
    payload: { targetStage: payload.targetStage },
  };
};
