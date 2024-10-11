import { clearTower } from '../models/tower.model.js';
import { createGold } from '../models/gold.model.js';
import { createScore } from '../models/score.model.js';
import { clearStage, createStage } from '../models/stage.model.js';
import handlerMappings from './handlerMapping.js';
import AuthUtils from '../utils/auth.utils.js';
import jwt from 'jsonwebtoken';

export const handleDisconnect = async (socket, userId) => {
  console.log(`User disconnected: socket ID=${socket.id} / user ID=${userId}`);
  await clearStage(userId);
};

export const handleConnection = async (socket, userId) => {
  console.log(`New user connected!! ${userId} with Socket ID: ${socket.id}`);

  await clearTower(userId);

  await createStage(userId);
  // 1 스테이지 생성
  await createGold(userId);
  // 골드 생성
  await createScore(userId);
  // 점수 생성

  socket.emit('connection', { userId });
};

export const handlerEvent = async (io, socket, data) => {
  console.log(' handler Event =>>> ', data);

  let newAccessToken;
  try {
    let checkToken = AuthUtils.verify(data.token);
  } catch (e) {
    console.log('[ERROR] handlerEvent =>> ', e);
    if (e.statusCode === 401 && e.message === '토큰의 유효기간이 지났습니다.') {
      let result = AuthUtils.reissueAccessToken(data.refreshToken);
      if (result.token) {
        console.log('result token =....  new >>>> ', result.token);
        data.token = result.token;
        newAccessToken = result.token.split(' ')[1];
      } else {
        socket.emit('response', {
          status: 'fail',
          errorCode: result.errorCode,
          message: result.message,
        });
        return;
      }
    }
  }

  try {
    const handler = handlerMappings[data.handlerId];

    if (!handler) {
      socket.emit('response', { status: 'fail', message: 'Handler not found' });
      return;
    }

    console.log('data.token =>>> ', data.token);
    const userId = AuthUtils.verify(data.token);
    console.log('userId =>>> ', userId);

    const response = await handler(userId, data.payload);

    console.log('@@ handlerEvent - res =>>> ', response);

    // 브로드캐스트라면 io 사용
    // if (response.broadcast) {
    //   io.emit('response', response);
    //   return;
    // }

    if (newAccessToken) {
      response.accessToken = newAccessToken;
    }
    if (data.handlerId) {
      response.handlerId = data.handlerId;
    }

    socket.emit('response', response);
  } catch (e) {
    console.error('[ERROR] helper.js =>> ', e);
    console.error('[ERROR] helper  =>> ', e.statusCode);
    socket.emit('response', {
      status: 'fail',
      errorCode: e.statusCode,
      message: e.message,
    });
    return;
  }
};
