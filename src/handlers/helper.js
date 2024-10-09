import { createTower } from '../models/tower.model.js';

import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  console.log(`User disconnected: ${socket.id}`);
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!! ${uuid} with Socket ID: ${socket.id}`);

  createTower(uuid);

  // 응답
  socket.emit('connection', { uuid });
};

export const handlerEvent = async (io, socket, data) => {
  console.log(' handler Event =>>> ', data);

  const handler = handlerMappings[data.handlerId];

  if (!handler) {
    socket.emit('reponse', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = await handler(data.userId, data.payload);

  console.log('@@ handlerEvent - res =>>> ', response);

  // 브로드캐스트라면 io 사용
  // if (response.broadcast) {
  //   io.emit('response', response);
  //   return;
  // }

  socket.emit('response', response);
};
