import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getTotalScore } from '../models/score.model.js';
import { getStageDatas } from '../models/mStages.model.js';

export const moveStage = async (userId, payload) => {
  let stages = await getStageDatas(); // 스테이지 메타데이터

  /** 스테이지 검증 시작 */
  if (!stages.some((stage) => stage.stageId === payload.targetStage)) {
    return { status: 'fail', message: '다음 스테이지가 없습니다.' };
  }

  let currentStages = getStage(userId); // 유저가 보유한 스테이지
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
  const currentStage = currentStages[currentStages.length - 1]; // 유저의 현재 스테이지

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: '현재 스테이지가 일치하지 않습니다.' };
  }
  /** 스테이지 검증 끝 */

  /** 잡은 몬스터로 점수 검증 시작 */
  let scoreByMonsters = getTotalScore(userId);

  // 타겟 스테이지 정보
  let targetStageFromData = stages.find((stage) => stage.stageId === payload.targetStage);
  if (scoreByMonsters < targetStageFromData.score) {
    console.log(`!! userId:${userId}가 올바르지 않은 점수로 스테이지 이동 시도`);
    return { status: 'fail', message: '점수가 올바르지 않습니다.' };
  }
  /** 잡은 몬스터로 점수 검증 끝 */

  // 유저의 다음 스테이지 정보 업데이트
  setStage(userId, payload.targetStage);
  return {
    status: 'success',
    message: '스테이지 이동',
    handlerId: 4,
    payload: { targetStage: payload.targetStage },
  };
};
