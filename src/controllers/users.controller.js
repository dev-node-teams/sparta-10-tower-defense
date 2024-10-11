import { UsersService } from '../services/users.service.js';
import JoiUtils from '../utils/joi.utils.js';
import asyncHandler from 'express-async-handler';

export class UsersController {
  usersService = new UsersService();

  /**
   * 회원가입
   */
  signUp = asyncHandler(async (req, res, next) => {
    // joi check
    const { email, password, name } = await JoiUtils.validateSignUp(req.body);

    // 회원가입
    const createUser = await this.usersService.signUp(email, password, name);

    return res.status(201).json({ message: '회원가입이 완료되었습니다.', data: createUser });
  });

  /**
   * 로그인
   */
  signIn = asyncHandler(async (req, res, next) => {
    // joi check
    const { email, password } = await JoiUtils.validateSignIn(req.body);

    // 토큰 생성
    const { accessToken, refreshToken } = await this.usersService.signIn(email, password);

    console.log(' AT1 =>>>> ', accessToken);
    console.log(' AT2 =>>>> ', refreshToken);

    // 쿠키 저장
    res.cookie('accessToken', accessToken, {
      httpOnly: false, // 브라우저의 JavaScript에서 접근 가능하게 설정
    });

    res.cookie('refreshToken', refreshToken);

    return res.status(200).json({ message: '정상적으로 로그인이 되었습니다.', data: accessToken });
  });
}
