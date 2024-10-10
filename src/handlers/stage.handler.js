import { createStage, getStage, setStage } from '../models/stage.model.js';
import { StagesRepository } from '../repositories/stages.repository.js';

export const moveStage = (userId, payload) => {
  // 다음 스테이지의 존재 여부 확인
  // const stages = [
  //   { id: 1, score: 0, bonusScore: 0 },
  //   { id: 2, score: 100, bonusScore: 0 },
  //   { id: 3, score: 300, bonusScore: 0 },
  //   { id: 4, score: 500, bonusScore: 0 },
  //   { id: 5, score: 800, bonusScore: 0 },
  // ];
  const stages = new StagesRepository();
  stages.viewEntireStages();

  console.log('콘솔을 찍으셧나요?: ', stages.viewEntireStages);

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

  // 유저의 다음 스테이지 정보 업데이트
  setStage(userId, payload.targetStage);
  return {
    status: 'success',
    message: '스테이지 이동',
    handlerId: 4,
    payload: { targetStage: payload.targetStage },
  };
};
