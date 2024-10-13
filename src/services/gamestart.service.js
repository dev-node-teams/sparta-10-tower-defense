import { getStageDatas } from '../models/mStages.model.js';
import { getMonsterDatas } from '../models/mMonster.model.js';
import { getTowerDatas } from '../models/mTower.model.js';
import { getSpecialMonsterDatas } from '../models/mSpecialMonster.model.js';
export class GameStartService {
  async initSendData() {
    const stages = await getStageDatas();
    const monsters = await getMonsterDatas();
    const specialMonsters = await getSpecialMonsterDatas();
    const towers = await getTowerDatas();

    return {
      stages,
      monsters,
      specialMonsters,
      towers,
    };
  }
}
