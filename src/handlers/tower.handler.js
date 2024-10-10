import { setTower, getTower } from '../models/tower.model.js';
import { findTowers } from '../repositories/towers.repository.js';
import { clearGold, getGold, setGold, getTotalGold } from '../models/gold.model.js';

export const towerBuy = async (userId, payload) => {
  const towerMetadata = await findTowers();

  const findTowerId = towerMetadata.find((id) => id.towerId === payload.towerType);
  // 소지금 - findTowerId.price 해서 쌓아두기
  setGold(userId, -findTowerId.price);
  console.log('getTotalGold 확인 => ', getTotalGold(userId));

  // 토탈골드가 마이너스인 경우
  if (getTotalGold(userId) < 0) {
    return { status: 'fail', message: ' 치트 검거 완료 ' };
  }

  setTower(userId, payload.towerType, payload.position);

  console.log(getTower(userId));
  return { status: 'success', message: `${findTowerId.name} 타워를 구매했습니다. ` };
  //
};
