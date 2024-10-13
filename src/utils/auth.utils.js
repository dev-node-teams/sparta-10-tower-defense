import jwt from 'jsonwebtoken';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import { getRefreshToken } from '../models/token.model.js';

/**
 * 인증 관련 유틸
 */
export default class AuthUtils {
  /**
   * JWT 복호화
   * @param {*} req.headers.authorization
   * @returns userId
   */
  static verify(authorization) {
    if (!authorization) {
      throw new StatusError('인증이 필요한 기능입니다.', StatusCodes.UNAUTHORIZED);
    } else if (authorization.split(' ').length < 2) {
      throw new StatusError('잘못된 토큰값 입니다.', StatusCodes.UNAUTHORIZED);
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new StatusError('토큰 타입이 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      return decodedToken.userId;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new StatusError('토큰의 유효기간이 지났습니다.', StatusCodes.UNAUTHORIZED);
      } else {
        throw new StatusError('인증이 필요한 기능입니다.', StatusCodes.UNAUTHORIZED);
      }
    }
  }

  /**
   * 리프레시 토큰 복호화
   * @param {*} authorization
   * @returns userId
   */
  static verifyRefresh(authorization) {
    if (!authorization) {
      throw new StatusError('인증이 필요한 기능입니다.', StatusCodes.UNAUTHORIZED);
    } else if (authorization.split(' ').length < 2) {
      throw new StatusError('잘못된 리프레시 토큰값 입니다.', StatusCodes.UNAUTHORIZED);
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new StatusError('토큰 타입이 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }
    try {
      const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
      return decodedToken.userId;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new StatusError('리프레시 토큰의 유효기간이 지났습니다.', StatusCodes.UNAUTHORIZED);
      } else {
        throw new StatusError('인증이 필요한 기능입니다.', StatusCodes.UNAUTHORIZED);
      }
    }
  }

  /**
   * 리프레시 토큰을 이용한, 액세스 토큰 발급
   * @param {*} refreshToken
   */
  static async reissueAccessToken(refreshToken) {
    let result = {};
    try {
      let resfreshUserId = this.verifyRefresh(refreshToken);
      // TODO: refresh token === redis
      let redisToken = await getRefreshToken(resfreshUserId);

      console.log('@@@ resfreshUserId =>> ', resfreshUserId);
      console.log('@@@ refreshToken =>> ', refreshToken);
      console.log('@@@ redisToken =>> ', `Bearer ${redisToken}`);
      if (`Bearer ${redisToken}` !== refreshToken) {
        throw new StatusError('잘못된 토큰입니다.', StatusCodes.UNAUTHORIZED);
      }

      let newAccessToken = jwt.sign(
        {
          userId: resfreshUserId,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: '30m' },
      );
      result.token = `Bearer ${newAccessToken}`;
    } catch (ee) {
      console.error('[ERROR] RE TOKEN CHECK helper.js =>> ', ee);
      console.error('[ERROR] RE TOKEN CHECK helper  =>> ', ee.statusCode);

      result.errorCode = ee.statusCode;
      result.message = ee.message;
    }

    return result;
  }
}
