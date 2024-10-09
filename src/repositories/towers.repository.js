import { prisma } from '../utils/prisma/index.js';

export const findTowers = async () => {
  const findTowers = await prisma.Towers.findMany();
  return findTowers;
};
