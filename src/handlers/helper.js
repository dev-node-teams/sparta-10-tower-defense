import { createTower } from '../models/tower.model.js';
import { createGold } from '../models/gold.model.js';
import { createScore } from '../models/score.model.js';
import { createStage } from '../models/stage.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, userId) => {
  console.log(`User disconnected: ${socket.id}`);
};

export const handleConnection = (socket, userId) => {
  console.log(`New user connected!! ${userId} with Socket ID: ${socket.id}`);

  createTower(userId);

  createStage(userId);
  // 1 스테이지 생성
  createGold(userId);
  // 골드 생성
  createScore(userId);
  // 점수 생성

  socket.emit('connection', { userId });
};

export const handlerEvent = async (io, socket, data) => {
  console.log(' handler Event =>>> ', data);

  const handler = handlerMappings[data.handlerId];

  if (!handler) {
    socket.emit('reponse', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = await handler(data.token, data.payload);

  console.log('@@ handlerEvent - res =>>> ', response);

  // 브로드캐스트라면 io 사용
  // if (response.broadcast) {
  //   io.emit('response', response);
  //   return;
  // }

  socket.emit('response', response);
};
