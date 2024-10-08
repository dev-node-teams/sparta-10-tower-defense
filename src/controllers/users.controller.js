import { UsersService } from '../services/users.service.js';
import JoiUtils from '../utils/joi/index.js';

export class UsersController {
  usersService = new UsersService();

  createUser = async (req, res, next) => {
    try {
      // joi check
      const { email, password, name } = await JoiUtils.validateSignUp(req.body);

      // 서비스 계층에 구현된 createPost 로직을 실행합니다.
      const createUser = await this.usersService.createUser(email, password, name);

      return res.status(201).json({ data: createUser });
    } catch (err) {
      next(err);
    }
  };
}
