import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
import AuthUtils from '../utils/auth.utils.js';

//
const registerHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(' registerHandler userId =>>> ', socket.id);

    let accessToken = decodeURIComponent(socket.handshake.query.accessToken);
    let userId = AuthUtils.verify(accessToken);
    console.log(' userId =>>> ', userId);

    // 연결 초기화
    handleConnection(socket, userId);

    // 응답
    socket.emit('response', 'res');

    // event handler 호출
    socket.on('event', (data) => handlerEvent(io, socket, data));

    // 접속해제시 이벤트
    socket.on('disconnect', () => handleDisconnect(socket, '유저의 jwt 토큰'));
  });
};

export default registerHandler;
