import { TowersRepository } from '../repositories/towers.repository.js';
import { CreateMonsterRepository } from '../repositories/createmonster.repository.js';
import { MonstersRepository } from '../repositories/monsters.repository.js';
import { StagesRepository } from '../repositories/stages.repository.js';

export class GameStartService {
  stagesRepository = new StagesRepository();
  monstersRepository = new MonstersRepository();
  createMonsterRepository = new CreateMonsterRepository();
  towersRepository = new TowersRepository();

  async initSendData() {
    let stages = await this.stagesRepository.viewEntireStages();
    let monsters = await this.monstersRepository.viewEntireMonsters();
    let createMonsters = await this.createMonsterRepository.viewEntireCreateMonsterPerStage();
    let towers = await this.towersRepository.viewEntireTowers();

    console.log('-------------------------------------------------------');
    console.log('테스트 스테이지 : ', stages);
    console.log('테스트 몬스터 : ', monsters);
    console.log('테스트 생성 몬스터 : ', createMonsters);
    console.log('테스트 타워 : ', towers);
    console.log('-------------------------------------------------------');

    return {
      stages: stages,
      monsters: monsters,
      roundMonsters: createMonsters,
      towers: towers,
    };
  }
}
