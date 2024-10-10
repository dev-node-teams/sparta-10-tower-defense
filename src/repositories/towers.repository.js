import { PrismaClient } from '../../generated/clientGameDB/index.js';
const prisma = new PrismaClient();
export class TowersRepository {
  /**
   *
   * @returns 모든 타워의 모든 Colum 정보
   */
  viewEntireTowers = async () => {
    return await prisma.towers.findMany();
  };
}
