import express from 'express';
import { RanksController } from '../controllers/ranks.controller.js';

const router = express.Router();
const ranksController = new RanksController();

// 랭킹 조회
router.get('/ranks', ranksController.getRanks);

export default router;
