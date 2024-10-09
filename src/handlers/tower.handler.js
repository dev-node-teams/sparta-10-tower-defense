import { setTower } from '../models/tower.model.js';

export const towerBuy = (userId, payload) => {
  console.log('타워 구입', payload.position);
  setTower(userId, payload.position);
  //
};
