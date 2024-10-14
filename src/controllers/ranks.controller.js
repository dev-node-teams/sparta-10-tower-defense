import { RanksService } from '../services/ranks.service.js';
import asyncHandler from 'express-async-handler';

export class RanksController {
  ranksService = new RanksService();

  /**
   * 랭킹 조회
   */
  getRanks = asyncHandler(async (req, res, next) => {
    const allRanks = await this.ranksService.getAllRanks();

    console.log('ranks.controller.js =>>> ', allRanks);

    return res.status(200).json({ message: '정상적으로 조회되었습니다.', data: allRanks });
  });
}
