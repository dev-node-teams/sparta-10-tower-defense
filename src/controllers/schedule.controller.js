import schedule from 'node-schedule';
import { RanksService } from '../services/ranks.service.js';
import asyncHandler from 'express-async-handler';

export class ScheduleController {
  rankService = new RanksService();

  /**
   * 랭킹 이력 저장
   */
  createRankHistory = asyncHandler(async () => {
    // 매 시간 저장
    schedule.scheduleJob('0 0 * * * *', async () => {
      // schedule.scheduleJob('0 50 23 * * *', async () => {
      console.log('[ createRankHistory ]====>>>> ');
      const result = await this.rankService.createRankHistory();
      console.log('====>>>> ', result);
    });
  });
}
