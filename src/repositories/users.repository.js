import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  createUser = async (email, password, name) => {
    const createdUser = await prisma.users.create({
      data: {
        email,
        password,
        name,
      },
    });

    return createdUser;
  };

  findUser = async (email, password) => {
    const findUser = await prisma.users.findFirst({
      where: {
        email,
        password,
      },
      select: {
        userId: true,
        name: true,
      },
    });

    return findUser;
  };
}
