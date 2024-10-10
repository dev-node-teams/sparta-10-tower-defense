import { setTowerDatas, getTowerDatas, clearTowerDatas } from '../models/mTower.model.js';
import { setMonsterDatas, getMonsterDatas, clearMonsterDatas } from '../models/mMonster.model.js';
import { setStageDatas, getStageDatas, clearStageDatas } from '../models/mStages.model.js';
import {
  setCMonsterPerDatasDatas,
  getCMonsterPerDatasDatas,
  clearCMonsterPerDatasDatas,
} from '../models/mCmonsterPerStage.model.js';
import { getDataVersion, setDataVersion, clearDataVersion } from '../models/mVersion.model.js';
import { TowersRepository } from '../repositories/towers.repository.js';

import { PrismaClient } from '../../generated/clientGameDB/index.js';
import { MonstersRepository } from '../repositories/monsters.repository.js';
import { StagesRepository } from '../repositories/stages.repository.js';

const prisma = new PrismaClient();

const towersRepository = new TowersRepository();
const monstersRepository = new MonstersRepository();
const stagesRepository = new StagesRepository();

/**
 * 서버 최초 기동 시,
 * 게임 데이터 레디스에 등록
 */
export async function initData() {
  // TODO: prisma - repository로 수정할 것
  // TODO: redis - model.js로 수정할 것
  /**
   * Towers +
   * Monsters
   * Stage
   * CreateMonsterPerStage
   */

  const DATA_VERSION = '1.0.0';
  const isVersion = await getDataVersion();

  console.log('is Version =>>> ', isVersion);

  let towerRes = await getTowerDatas();
  let monsterRes = await getMonsterDatas();
  let stagesRes = await getStageDatas();
  let createMonsterPerStagesRes = await getCMonsterPerDatasDatas();

  console.log('towerRes =>> ', towerRes);
  console.log('monsterRes =>> ', monsterRes);
  console.log('stagesRes =>> ', stagesRes);
  console.log('createMonsterPerStagesRes =>> ', createMonsterPerStagesRes);

  if (
    isVersion &&
    isVersion === DATA_VERSION &&
    towerRes &&
    monsterRes &&
    stagesRes &&
    createMonsterPerStagesRes
  ) {
    console.log('@@@ 같은 버전의 게임 데이터가 레디스에 존재합니다.');
  } else {
    // clear
    Promise.all([
      clearTowerDatas(),
      clearStageDatas(),
      clearMonsterDatas(),
      clearCMonsterPerDatasDatas(),
      clearDataVersion(),
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

      // CreateMonsterPerStage
      const createMonsterPerStages = await prisma.createMonsterPerStage.findMany();
      await setCMonsterPerDatasDatas(createMonsterPerStages);

      await setDataVersion(DATA_VERSION);
    });
  }
}

export default initData;
