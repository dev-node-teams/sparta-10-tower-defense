import { PrismaClient } from '../../generated/clientGameDB/index.js';
const prisma = new PrismaClient();
export class MonstersRepository {
  viewEntireMonsters = async () => {
    return await prisma.monsters.findMany();
  };
}
