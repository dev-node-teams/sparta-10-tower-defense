import { PrismaClient } from '../../generated/clientGameDB/index.js';
const prisma = new PrismaClient();
export class StagesRepository {
  /**
   *
   * @returns 모든 스테이지의 모든 Colum 정보
   */
  viewEntireStages = async () => {
    console.log('prisma : ', prisma);
    return await prisma.stage.findMany();
  };
}
