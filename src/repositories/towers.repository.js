import { PrismaClient } from '../../generated/clientGameDB/index.js';

const prisma = new PrismaClient();

export const findTowers = async () => {
  const findTowers = await prisma.Towers.findMany();
  return findTowers;
};
