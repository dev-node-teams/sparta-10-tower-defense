import { gameEnd, gameStart } from './game.handler.js';
import { towerBuy, towerSell, towerEnhance } from './tower.handler.js';
import { monsterKill } from './monsterKill.handler.js';
import { moveStage } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  4: moveStage,
  21: monsterKill,
  30: towerBuy,
  31: towerSell,
  32: towerEnhance,
};

export default handlerMappings;
