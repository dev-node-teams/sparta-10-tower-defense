import { setTower, getTower, deleteTower } from '../models/tower.model.js';
import { findTowers } from '../repositories/towers.repository.js';
import { clearGold, getGold, setGold, getTotalGold } from '../models/gold.model.js';

export const towerBuy = async (userId, payload) => {
  const towerMetadata = await findTowers();

  const findTowerId = towerMetadata.find((id) => id.towerId === payload.towerType);
  // 소지금 - findTowerId.price 해서 쌓아두기
  setGold(userId, -findTowerId.price);
  // 현재 소지금
  const userTotalGold = getTotalGold(userId);

  console.log('타워 구매 후 잔액 => ', userTotalGold);

  // 토탈골드가 마이너스인 경우
  if (userTotalGold < 0) {
    return { status: 'fail', message: ' 치트 검거 완료 ' };
  }

  setTower(userId, payload.towerType, payload.position);

  const myTowers = getTower(userId);
  console.log('타워 구매 후 보유한 타워들', myTowers);
  const towerCount = myTowers.length;

  return {
    status: 'success',
    message: `${findTowerId.name} 타워를 구매했습니다. `,
    handlerId: 5,
    userGold: userTotalGold,
    position: payload.position,
    remaining: towerCount,
  };
  //
};

export const towerSell = async (userId, payload) => {
  const towerMetadata = await findTowers();
  const findTowerId = towerMetadata.find((id) => id.towerId === payload.towerType);
  //판매금액
  const sellPrice = findTowerId.price / 2;
  // 소지금 + findTowerId.price 해서 쌓아두기
  setGold(userId, +sellPrice);

  const userTotalGold = getTotalGold(userId);
  console.log('타워 판매 후 잔액 => ', userTotalGold);

  // deleteTower 가 필요하다..
  // getTower에서 해당 타워 찾기
  const myTowers = getTower(userId);
  const findSellTower = myTowers.find((i) => i.x === payload.x && i.y === payload.y);
  console.log('판매 대상 타워', findSellTower);
  deleteTower(userId, findSellTower);

  const afterMyTowers = getTower(userId);
  console.log('타워 판매 후 보유한 타워들', afterMyTowers);
  const towerCount = afterMyTowers.length;

  return {
    status: 'success',
    message: `${findTowerId.name} 타워를 판매했습니다. `,
    position: payload.position,
    remaining: towerCount,
  };
};
