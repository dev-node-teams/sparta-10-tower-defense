import { setTowerDatas, getTowerDatas } from '../models/mTower.model.js';
import { setMonsterDatas, getMonsterDatas } from '../models/mMonster.model.js';
import { setStageDatas, getStageDatas } from '../models/mStages.model.js';
import {
  setCMonsterPerDatasDatas,
  getCMonsterPerDatasDatas,
} from '../models/mCmonsterPerStage.model.js';

import { PrismaClient } from '../../generated/clientGameDB/index.js';
const prisma = new PrismaClient();

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
  //--

  // TOWER
  const towers = await prisma.towers.findMany();
  console.log('towers =>> ', towers);
  await setTowerDatas(towers);
  let towerRes = await getTowerDatas();
  console.log('towerRes =>> ', towerRes);

  // MONSTER
  const monsters = await prisma.monsters.findMany();
  console.log('monsters =>> ', monsters);
  await setMonsterDatas(towers);
  let monsterRes = await getMonsterDatas();
  console.log('monsterRes =>> ', monsterRes);

  // STAGE
  const stages = await prisma.stage.findMany();
  console.log('stages =>> ', stages);
  await setStageDatas(stages);
  let stagesRes = await getStageDatas();
  console.log('stagesRes =>> ', stagesRes);

  // CreateMonsterPerStage
  const createMonsterPerStages = await prisma.createMonsterPerStage.findMany();
  console.log('createMonsterPerStages =>> ', createMonsterPerStages);
  await setCMonsterPerDatasDatas(createMonsterPerStages);
  let createMonsterPerStagesRes = await getCMonsterPerDatasDatas();
  console.log('createMonsterPerStagesRes =>> ', createMonsterPerStagesRes);
}

export default initData;
