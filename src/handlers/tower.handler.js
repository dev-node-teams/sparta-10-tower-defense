import { setTower, getTower, updateTower } from '../models/tower.model.js';
import { clearGold, getGold, setGold, getTotalGold } from '../models/gold.model.js';
import { getTowerDatas } from '../models/mTower.model.js';

// 타워 구매 핸들러
export const towerBuy = async (userId, payload) => {
  const towerMetadata = await getTowerDatas();
  const findTowerId = towerMetadata.find((id) => id.towerId === payload.towerType);

  // 소지금 - findTowerId.price 해서 쌓아두기
  setGold(userId, -findTowerId.price);
  const totalGold = await getTotalGold(userId);

  // 토탈골드가 마이너스인 경우
  if (totalGold < 0) {
    return { status: 'fail', message: ' 치트 검거 완료 ' };
  }

  await setTower(userId, payload.towerType, payload.position);
  console.log('겟 타워 확인', await getTower(userId));

  return {
    status: 'success',
    message: `${findTowerId.name} 타워를 구매했습니다. `,
    totalGold,
  };
  //
};

// 타워 판매 핸들러
export const towerSell = async (userId, payload) => {
  const towerMetadata = await getTowerDatas();
  const findTowerId = towerMetadata.find((id) => id.towerId === payload.towerType);

  //판매금액
  const sellPrice = findTowerId.price / 2;
  // 소지금 + findTowerId.price 해서 쌓아두기
  setGold(userId, +sellPrice);

  const totalGold = await getTotalGold(userId);
  console.log('타워 판매 후 잔액 => ', totalGold);
  const beforeTowers = await getTower(userId);

  //판매 대상
  const tarGetTower = beforeTowers.find((i) => i.x === payload.x && i.y === payload.y);

  //팔고 남은 타워
  const remainingTowers = beforeTowers.filter((i) => i !== tarGetTower);

  await updateTower(userId, remainingTowers);

  const afterTowers = await getTower(userId);
  console.log('타워 판매 후 보유한 타워들', afterTowers);
  const towerCount = afterTowers.length;

  return {
    status: 'success',
    message: `${findTowerId.name} 타워를 판매했습니다. `,
    position: payload.position,
    remaining: towerCount,
    totalGold,
  };
};
