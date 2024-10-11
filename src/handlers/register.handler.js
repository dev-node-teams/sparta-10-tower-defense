import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
import AuthUtils from '../utils/auth.utils.js';
import { addUser } from '../models/user.model.js';

//
const registerHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(' registerHandler socket ID =>>> ', socket.id);

    let userId;
    try {
      //
      let accessToken = decodeURIComponent(socket.handshake.query.accessToken);
      userId = AuthUtils.verify(accessToken);
      console.log(' userId =>>> ', userId);
      //

      // 접속한 유저 아이디 서버에 저장
      addUser({ userId, socketId: socket.id });

      // 연결 초기화
      handleConnection(socket, userId);

      // 응답
      //socket.emit('response', 'res');

      // event handler 호출
      socket.on('event', (data) => handlerEvent(io, socket, data));

      // 접속해제시 이벤트
      socket.on('disconnect', () => handleDisconnect(socket, userId));
    } catch (e) {
      console.error('[ERROR] register.handler.js  =>> ', e);
      console.error('[ERROR] register.handler.js  =>> ', e.statusCode);
      socket.emit('response', {
        status: 'fail',
        errorCode: e.statusCode,
        message: e.message,
      });
      return;
    }
  });
};

export default registerHandler;
