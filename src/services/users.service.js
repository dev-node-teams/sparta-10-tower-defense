import { UsersRepository } from '../repositories/users.repository.js';

export class UsersService {
  usersRepository = new UsersRepository();

  createUser = async (email, password, name) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createUser = await this.usersRepository.createUser(email, password, name);

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      email: createUser.email,
      name: createUser.name,
    };
  };

  findUser = async (email, password) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const findUser = await this.usersRepository.findUser(email, password);

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      email: findUser.email,
      name: findUser.name,
    };
  };
}
