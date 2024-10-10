import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
import AuthUtils from '../utils/auth.utils.js';
import { addUser } from '../models/user.model.js';

//
const registerHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(' registerHandler userId =>>> ', socket.id);

    let userId;
    try {
      //
      let accessToken = decodeURIComponent(socket.handshake.query.accessToken);
      userId = AuthUtils.verify(accessToken);
      console.log(' userId =>>> ', userId);
      //
    } catch (e) {
      console.error('[ERROR] =>> ', e);
      socket.emit('response', {
        status: 'fail',
        errorCode: 401,
        message: '인증이 필요한 기능입니다.',
      });
      return;
    }
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
  });
};

export default registerHandler;
