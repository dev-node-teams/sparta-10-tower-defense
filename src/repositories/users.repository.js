// import { prisma } from '../utils/prisma/index.js';
import { PrismaClient } from '../../generated/clientUserDB/index.js';
const prisma = new PrismaClient();

export class UsersRepository {
  /**
   * 유저 생성
   * @param {string} email 이메일
   * @param {string} password 비밀번호
   * @param {string} name 이름
   * @returns 생성유저정보
   */
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

  /**
   * 이메일 기준 유저 정보 조회
   * @param {string} email
   * @returns 유저정보
   */
  isExistUser = async (email) => {
    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    return isExistUser;
  };

  /**
   * 아이디로 유저 찾기
   * @param {*} userId
   * @returns
   */
  findUserByUserId = async (userId) => {
    const user = await prisma.users.findUnique({
      where: {
        userId,
      },
    });
    return user;
  };
}
