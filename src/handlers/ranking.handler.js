import {
  getHighScore,
  getUserRank,
  setHighScore,
  setUserRank,
  getAllRanks,
} from '../models/rank.model.js';
import { UsersService } from '../services/users.service.js';

const userService = new UsersService();

/**
 * 유저별 랭킹 최고 점수 저장
 * @param {number} userId
 * @param {object} payload
 */
export const userBestRecord = async (userId, payload) => {
  //
  console.log('userBestRecord =>> ', userId, payload);

  // 유저 정보 조회
  const userName = await userService.getUserName(userId);
  let userKey = `${userName}(${userId})`;
  console.log('userName =>>>>', userName);

  // 유저 최대 점수 조회 및 저장
  const highScore = await getHighScore(userId);
  //   if (payload.score > highScore) {
  await setHighScore(userKey, payload.score);
  await setUserRank(userKey, payload.score);
  //   }

  const userRank = await getUserRank(userKey);
  console.log('userRank =>>> ', userRank);

  const allRanks = await getAllRanks();
  console.log('allRanks ==>> ', allRanks);

  return { status: 'success', message: 'userBestRecord' };
};
