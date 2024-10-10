import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
import AuthUtils from '../utils/auth.utils.js';
import { addUser } from '../models/user.model.js';

//
const registerHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(' registerHandler userId =>>> ', socket.id);

    let accessToken = decodeURIComponent(socket.handshake.query.accessToken);
    let userId = AuthUtils.verify(accessToken);
    console.log(' userId =>>> ', userId);
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
