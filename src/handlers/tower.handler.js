import { setTower, getTower, updateTower, enhanceTower } from '../models/tower.model.js';
import { clearGold, getGold, setGold, getTotalGold } from '../models/gold.model.js';
import { getTowerDatas } from '../models/mTower.model.js';
import { getEnhanceDatas } from '../models/mEnhance.model.js';

// #30 타워 구매 핸들러
export const towerBuy = async (userId, payload) => {
  //★★ 타워 갯수 제한
  const towerLimit = 12;
  const beforeTowers = await getTower(userId);

  if (beforeTowers.length >= towerLimit) {
    return {
      status: 'fail',
      message: ` 더 이상 타워를 구매할 수 없습니다.  <${towerLimit} 개 제한> `,
      error: true,
    };
  }

  const towerMetaData = await getTowerDatas();
  const findTowerId = towerMetaData.find((id) => id.towerId === payload.towerType);
  const beforeTotalGold = await getTotalGold(userId);

  if (beforeTotalGold < findTowerId.price) {
    return { status: 'fail', message: ' 골드가 부족합니다. ', error: true };
  }

  // 소지금 - findTowerId.price 해서 쌓아두기
  await setGold(userId, -findTowerId.price);

  const totalGold = await getTotalGold(userId);

  await setTower(userId, payload.towerType, payload.position, 0);
  console.log('현재 타워 목록', await getTower(userId));

  return {
    status: 'success',
    message: `${findTowerId.name} 타워를 구매했습니다. `,
    towerType: findTowerId.towerId,
    position: payload.position,
    totalGold,
  };
  //
};

// #31 타워 판매 핸들러
export const towerSell = async (userId, payload) => {
  const towerMetaData = await getTowerDatas();
  const enhanceMetaData = await getEnhanceDatas();
  const beforeTowers = await getTower(userId);

  //판매 대상
  const targetTower = beforeTowers.find(
    (i) => i.position.x === payload.position.x && i.position.y === payload.position.y,
  );

  const findTowerId = towerMetaData.find((id) => id.towerId === targetTower.towerType);

  if (!targetTower || !findTowerId) {
    return { status: 'fail', message: ' 잘못된 대상입니다. ', error: true };
  }

  // 강화 비용에 대한 서비스
  const targetMetaData = enhanceMetaData.filter((i) => i.towerId === findTowerId.towerId);
  let enahncePrice = 0;
  for (let i = targetTower.enhanceLevel - 1; i >= 0; i--) {
    enahncePrice += targetMetaData[i].price;
  }

  //팔고 남은 타워
  const remainingTowers = beforeTowers.filter((i) => i !== targetTower);

  await updateTower(userId, remainingTowers);

  const afterTowers = await getTower(userId);
  console.log('타워 판매 후 보유한 타워들', afterTowers);
  const towerCount = afterTowers.length;

  // 정산 하기 (타워구매+강화에 들어간 골드의 절반)
  const sellPrice = (findTowerId.price + enahncePrice) / 2;
  await setGold(userId, +sellPrice);
  const totalGold = await getTotalGold(userId);
  console.log('타워 판매 후 잔액 => ', totalGold);

  return {
    status: 'success',
    message: `${findTowerId.name} 타워를 판매했습니다.  +${sellPrice} 골드 획득 ! `,
    position: payload.position,
    remaining: towerCount,
    totalGold,
  };
};

// #32 타워 강화 핸들러
export const towerEnhance = async (userId, payload) => {
  const towerMetadata = await getTowerDatas();
  const beforeTowers = await getTower(userId);
  const enhanceMetaData = await getEnhanceDatas();

  const targetTower = beforeTowers.find(
    (i) => i.position.x === payload.position.x && i.position.y === payload.position.y,
  );

  const targetTowerIndex = beforeTowers.findIndex(
    (i) => i.position.x === payload.position.x && i.position.y === payload.position.y,
  );

  const findTower = towerMetadata.find((id) => id.towerId === targetTower.towerType);

  if (targetTowerIndex === -1 || !targetTower) {
    return { status: 'fail', message: ' 대상을 찾을 수 없습니다. ', error: true };
  }

  // 강화 대상 단계 데이터
  const enhanceTargetInfo = enhanceMetaData.find(
    (i) => i.towerId === findTower.towerId && i.enhanceLevel === targetTower.enhanceLevel + 1,
  );

  if (!enhanceTargetInfo) {
    return { status: 'fail', message: ' 더 이상 강화 할 수 없습니다. ', error: true };
  }

  // 비용 정산
  const currentGold = await getTotalGold(userId);
  console.log('강화 비용', enhanceTargetInfo.price);

  if (currentGold < enhanceTargetInfo.price) {
    return { status: 'fail', message: ' 골드가 부족합니다. ', error: true };
  }

  await setGold(userId, -enhanceTargetInfo.price);

  const totalGold = await getTotalGold(userId);

  await enhanceTower(userId, targetTowerIndex);

  console.log('강화 후 타워 보유 목록', await getTower(userId));
  return {
    status: 'success',
    message: ` ${findTower.name} 타워를 강화했습니다. ${targetTower.enhanceLevel} 강화 => ${enhanceTargetInfo.enhanceLevel} 강화`,
    position: payload.position,
    enhanceData: enhanceTargetInfo,
    totalGold,
  };
};
