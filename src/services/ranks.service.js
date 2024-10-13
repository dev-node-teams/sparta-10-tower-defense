import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import { getAllRanks } from '../models/rank.model.js';

export class RanksService {
  getAllRanks = async () => {
    return await getAllRanks();
  };
}
