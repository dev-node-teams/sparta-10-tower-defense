import { setTowerDatas, getTowerDatas, clearTowerDatas } from '../models/mTower.model.js';
import { setMonsterDatas, getMonsterDatas, clearMonsterDatas } from '../models/mMonster.model.js';
import { setStageDatas, getStageDatas, clearStageDatas } from '../models/mStages.model.js';
import { getDataVersion, setDataVersion, clearDataVersion } from '../models/mVersion.model.js';
import { setEnhanceDatas, getEnhanceDatas, clearEnhanceDatas } from '../models/mEnhance.model.js';

import { PrismaClient } from '../../generated/clientGameDB/index.js';
import { MonstersRepository } from '../repositories/monsters.repository.js';
import { StagesRepository } from '../repositories/stages.repository.js';
import { TowersRepository } from '../repositories/towers.repository.js';
import { EnhanceRepository } from '../repositories/enhance.repository.js';

const prisma = new PrismaClient();

const towersRepository = new TowersRepository();
const monstersRepository = new MonstersRepository();
const stagesRepository = new StagesRepository();
const enhanceRepository = new EnhanceRepository();

/**
 * 서버 최초 기동 시,
 * 게임 데이터 레디스에 등록
 */
export async function initData() {
  /**
   * Towers +
   * Monsters
   * Stage
   * CreateMonsterPerStage
   * TowerEnhance
   */

  const DATA_VERSION = '1.0.0';
  const isVersion = await getDataVersion();

  console.log('is Version =>>> ', isVersion);

  let towerRes = await getTowerDatas();
  let monsterRes = await getMonsterDatas();
  let stagesRes = await getStageDatas();
  let enhanceRes = await getEnhanceDatas();

  if (
    isVersion &&
    isVersion === DATA_VERSION &&
    towerRes.length &&
    monsterRes.length &&
    stagesRes.length &&
    enhanceRes.length
  ) {
    console.log('@@@ 같은 버전의 게임 데이터가 레디스에 존재합니다.');
  } else {
    // clear
    Promise.all([
      clearTowerDatas(),
      clearStageDatas(),
      clearMonsterDatas(),
      clearDataVersion(),
      clearEnhanceDatas(),
    ]).then(async () => {
      //--
      // TOWER
      const towers = await towersRepository.viewEntireTowers();
      await setTowerDatas(towers);

      // MONSTER
      const monsters = await monstersRepository.viewEntireMonsters();
      await setMonsterDatas(monsters);

      // STAGE
      const stages = await stagesRepository.viewEntireStages();
      await setStageDatas(stages);

      await setDataVersion(DATA_VERSION);

      // TOWER_ENHANCE
      const towerEnhance = await enhanceRepository.viewEntireEnhance();
      await setEnhanceDatas(towerEnhance);
    });
  }
}

export default initData;
