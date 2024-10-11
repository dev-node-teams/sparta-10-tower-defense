import { getStageDatas } from '../models/mStages.model.js';
import { getMonsterDatas } from '../models/mMonster.model.js';
import { getCMonsterPerDatasDatas } from '../models/mCmonsterPerStage.model.js';
import { getTowerDatas } from '../models/mTower.model.js';

export class GameStartService {
  async initSendData() {
    const stages = await getStageDatas();
    const monsters = await getMonsterDatas();
    const roundMonsters = await getCMonsterPerDatasDatas();
    const towers = await getTowerDatas();

    return {
      stages,
      monsters,
      roundMonsters,
      towers,
    };
  }
}
