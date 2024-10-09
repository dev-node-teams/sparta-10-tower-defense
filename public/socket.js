let socket = io('http://localhost:3005', {
  auth: {
    token: 'jwt token url',
  },
});

let userId = 555;
let CLIENT_VERSION = '1.0.0';
const sendEvent = (handlerId, payload) => {
  const res = socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });

  console.log('res =>> ', res);
};

const getSocket = () => {
  return socket;
};

const socketConnection = () => {
  socket.on('connection', (data) => {
    console.log('연결되었어요: ', data);
    userId = data; // jwt 토큰이 들어가야 함
  });
};

export { sendEvent, getSocket, socketConnection };
