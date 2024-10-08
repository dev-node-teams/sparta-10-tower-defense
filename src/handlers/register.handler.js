import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
//
const registerHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(' registerHandler userId =>>> ', socket.handshake.query.userId);

    // 연결 초기화
    handleConnection(socket, 'userUUID');

    // 응답
    socket.emit('response', 'res');

    // event handler 호출
    socket.on('event', (data) => handlerEvent(io, socket, data));

    // 접속해제시 이벤트
    socket.on('disconnect', () => handleDisconnect(socket, 'userUUID'));
  });
};

export default registerHandler;
