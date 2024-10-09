import { setTower, getTower } from '../models/tower.model.js';
import { findTowers } from '../repositories/towers.repository.js';

export const towerBuy = async (userId, payload) => {
  setTower(userId, payload.position);
  console.log('타워찾기', await findTowers());
  console.log(getTower(userId));
  return { status: 'success', message: ' 타워를 구매했습니다. ', towerbuy: true };
  //
};
