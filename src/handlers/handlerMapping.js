import { gameEnd, gameStart } from './game.handler.js';
import { towerBuy, towerSell } from './tower.handler.js';
import { monsterKill, specialMonsterKill } from './monsterKill.handler.js';
import { moveStage } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  4: moveStage,
  21: monsterKill,
  22: specialMonsterKill,
  30: towerBuy,
  31: towerSell,
};

export default handlerMappings;
