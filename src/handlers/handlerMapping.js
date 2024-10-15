import { gameEnd, gameStart } from './game.handler.js';
import { towerBuy, towerSell, towerEnhance } from './tower.handler.js';
import { monsterKill, specialMonsterKill } from './monster.handler.js';
import { moveStage } from './stage.handler.js';
import { userBestRecord } from './ranking.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  4: moveStage,
  21: monsterKill,
  22: specialMonsterKill,
  30: towerBuy,
  31: towerSell,
  32: towerEnhance,
  90: userBestRecord,
};

export default handlerMappings;
