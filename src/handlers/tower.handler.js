import { setTower, getTower } from '../models/tower.model.js';
import { findTowers } from '../repositories/towers.repository.js';

export const towerBuy = async (userId, payload) => {
  const towerMetadata = await findTowers();

  setTower(userId, payload.towerType, payload.position);

  console.log(getTower(userId));
  return { status: 'success', message: ' 타워를 구매했습니다. ', towerbuy: true };
  //
};
