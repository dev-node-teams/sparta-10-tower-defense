import { PrismaClient } from '../../generated/clientUserDB/index.js';
const prisma = new PrismaClient();

export class RanksRepository {
  createRanking = async (userId, score) => {
    const createdRanks = await prisma.ranking.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        score,
        stage: 0,
      },
      update: {
        score,
      },
    });

    return createdRanks;
  };
}
