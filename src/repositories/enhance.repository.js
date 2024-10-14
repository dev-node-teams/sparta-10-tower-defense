import { PrismaClient } from '../../generated/clientGameDB/index.js';

const prisma = new PrismaClient();
export class EnhanceRepository {
  /**
   *
   * @returns 타워 강화정보 Colum
   *    */
  viewEntireEnhance = async () => {
    return await prisma.TowerEnhance.findMany();
  };
}

export const findEnhance = async () => {
  const findEnhance = await prisma.TowerEnhance.findMany();
  return findEnhance;
};
