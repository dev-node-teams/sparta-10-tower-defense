import { PrismaClient } from '../../generated/clientGameDB/index.js';
const prisma = new PrismaClient();
export class SpecialMonstersRepository {
  viewEntireSpecialMonsters = async () => {
    return await prisma.specialMonsters.findMany();
  };
}

export const findMonsters = async () => {
  const findMonsters = await prisma.monsters.findMany();
  return findMonsters;
};
