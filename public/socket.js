import { displayLevelUpText } from './game.js';

const IP = 'http://localhost:3005';

let socket = null;

let token = `Bearer ${getCookie('accessToken')}`;
let userId = null;
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

    //userId = data.userId;
  });

  socket.on('response', (data) => {
    console.log('@@ response: =>>>  ', data);
    if (data && data.handlerId) {
      console.log('sib: ', data.handlerId);
      switch (data.handlerId) {
        // case 2:
        //   userInfo = data.init.initData;
        //   stages = data.init.stages;
        //   monsters = data.init.monsters;
        //   towers = data.init.towers;
        //   roundMonsters = data.init.roundMonsters;
        //   setUserInfo(userInfo.score, userInfo.gold);
        //   setStages(stages);
        //   setMonsters(monsters);
        //   setTowers(towers);
        //   setRountMonsters(roundMonsters);
        //   break;

        case 4:
          displayLevelUpText(data.payload.targetStage);
          break;

        default:
          console.log('!! 일치하는 핸들러가 없습니다.');
          break;
      }
    }
  });
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export { sendEvent, getSocket, socketConnection };
