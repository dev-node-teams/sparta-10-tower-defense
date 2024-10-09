import { gameEnd, gameStart } from './game.handler.js';
import { towerBuy } from './tower.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  30: towerBuy,
};

export default handlerMappings;
