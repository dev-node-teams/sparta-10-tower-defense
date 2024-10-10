import { gameEnd, gameStart } from './game.handler.js';
import { towerBuy } from './tower.handler.js';
import { monsterKill } from './monsterKill.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  21: monsterKill,
  30: towerBuy,
};

export default handlerMappings;
