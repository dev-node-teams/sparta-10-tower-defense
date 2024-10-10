import { PrismaClient } from '../../generated/clientGameDB/index.js';
const prisma = new PrismaClient();
export class CreateMonsterRepository {
  /**
   *
   * @returns 모든 스테이지에 생성될 monster 정보
   */
  viewEntireCreateMonsterPerStage = async () => {
    return await prisma.createMonsterPerStage.findMany();
  };
}
