import bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';

export class UsersService {
  usersRepository = new UsersRepository();

  createUser = async (email, password, name) => {
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

  findUser = async (email, password) => {
    const findUser = await this.usersRepository.findUser(email, password);
    return {
      email: findUser.email,
      name: findUser.name,
    };
  };
}
