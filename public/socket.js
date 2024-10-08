const socket = io('http://localhost:3005', {
  auth: {
    token: 'jwt token url',
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('연결되었어요: ', data);
  userId = data; // jwt 토큰이 들어가야 함
});

const sendEvent = async (handlerId, payload) => {
  socket.emit('event', {
    userId,
    handlerId,
    payload,
  });
};

export { sendEvent, userId };
