const IP = 'http://localhost:3005';

let socket = null;

let token = `Bearer ${getCookie('accessToken')}`;
let CLIENT_VERSION = '1.0.0';

const sendEvent = (handlerId, payload) => {
  const res = socket.emit('event', {
    token,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });

  console.log('res =>> ', res);
};

const getSocket = () => {
  // 소켓 연결 실패 시
  if (!socket.connected) {
    return null;
  }

  return socket;
};

const socketConnection = () => {
  socket = io(IP, {
    auth: {
      token: 'jwt token url',
    },
    query: {
      accessToken: token,
    },
  });

  socket.on('connection', (data) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
      console.error('소켓 연결 실패 새로고침해주세요.');
      return;
    }

    console.log('연결되었어요: ', data);
    userId = data.userId; // jwt 토큰이 들어가야 함
  });

  socket.on('response', (data) => {
    console.log('@@ response: =>>>  ', data);
  });
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export { sendEvent, getSocket, socketConnection };
