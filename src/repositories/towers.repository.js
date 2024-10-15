import { PrismaClient } from '../../generated/clientGameDB/index.js';

const prisma = new PrismaClient();
export class TowersRepository {
  viewEntireTowers = async () => {
    return await prisma.towers.findMany();
  };
}
