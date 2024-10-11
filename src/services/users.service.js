import bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { storeRefreshToken } from '../models/token.model.js';

export class UsersService {
  usersRepository = new UsersRepository();

  /**
   * 회원가입
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @returns
   */
  signUp = async (email, password, name) => {
    // 중복 여부 확인
    const isExistUser = await this.usersRepository.isExistUser(email);
    if (isExistUser) {
      throw new StatusError('이미 존재하는 이메일입니다.', StatusCodes.CONFLICT);
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const createUser = await this.usersRepository.createUser(email, hashedPassword, name);

    return {
      email: createUser.email,
      name: createUser.name,
    };
  };

  /**
   * 로그인
   * @param {string} email
   * @param {string} password
   * @returns
   */
  signIn = async (email, password) => {
    // 유저 정보 확인
    const user = await this.usersRepository.isExistUser(email);
    if (!user) {
      throw new StatusError('잘못된 계정 정보 입니다.', StatusCodes.UNAUTHORIZED);
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new StatusError('비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    // 토큰 생성
    const accessToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '30m' },
    );

    // 토큰 생성
    const refreshToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' },
    );

    storeRefreshToken(refreshToken, user.userId);

    return { accessToken, refreshToken };
  };
}
