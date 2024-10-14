import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import { getAllRanks } from '../models/rank.model.js';
import { RanksRepository } from '../repositories/ranks.repository.js';

export class RanksService {
  ranksRepository = new RanksRepository();

  /**
   * 전체 랭킹 조회
   * @returns
   */
  getAllRanks = async () => {
    return await getAllRanks();
  };

  /**
   * 스케쥴러 - 랭킹 이력 저장
   */
  createRankHistory = async () => {
    /**
     * 오늘 일자 랭킹 데이터를 랭킹 테이블에 입력.
     */
    let todayRanks = await getAllRanks();
    console.log('todayRanks =>>', todayRanks);

    const array = [];
    for (let i = 0; i < todayRanks.length; i++) {
      let todayRank = todayRanks[i];
      let firstArr = todayRank.value.split('(');
      let userId = firstArr[1].split(')')[0];
      const result = await this.ranksRepository.createRanking(+userId, todayRank.score);
      array.push(result);
    }

    return array;
  };
}
