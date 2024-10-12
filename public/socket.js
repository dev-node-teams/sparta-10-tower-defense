import {
  setMonsters,
  setStages,
  setTowers,
  setUserInfo,
  setMonstersScore,
  setMonstersGold,
  setSpecialMonsters,
  spawnSpecialMonster,
} from './game.js';
import { moveStage, diplayEvent } from './game.js';

const IP = 'http://localhost:3005';

let socket = null;

let token = `Bearer ${getCookie('accessToken')}`;
let refreshToken = `Bearer ${getCookie('refreshToken')}`;
let CLIENT_VERSION = '1.0.0';

let targetStage = 0;

const sendEvent = (handlerId, payload) => {
  const res = socket.emit('event', {
    token,
    refreshToken,
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

    // token
    if (data && data.accessToken) {
      console.log('@@ 토큰 재발급 !! =>>>> ', data.accessToken);
      token = `Bearer ${data.accessToken}`;
      setCookie('accessToken', data.accessToken);
    }

    // 에러 처리
    if (data && data.status === 'fail') {
      console.log('ERROR - FIAIL >>> ', data);

      switch (data.errorCode) {
        case 401:
          if (data.message === '토큰의 유효기간이 지났습니다.' && data.handlerId) {
            //
            console.log('....................>> ', data);
            return;
          }
          alert('로그인을 해주세요!');
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          window.location.href = 'index.html';
          return;
        default:
          console.error('[ERROR] =>>> ', data);
      }
    }

    if (data && data.handlerId) {
      switch (data.handlerId) {
        case 2:
          console.log(data);
          setUserInfo(data.initData.score, data.initData.gold);
          setStages(data.stages);
          setMonsters(data.monsters);
          setTowers(data.towers);
          setSpecialMonsters(data.specialMonsters);
          break;

        case 4: // 스테이지 이동
          targetStage = data.payload.targetStage;
          diplayEvent(`${targetStage} 스테이지! `, 'yellow', 50, 100);
          moveStage(targetStage);
          break;

        case 21:
          setMonstersScore(data.totalScore);
          setMonstersGold(data.totalGold);
          if (data.specialMonsters.length) spawnSpecialMonster(data.specialMonsters);
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

export { sendEvent, getSocket, socketConnection, targetStage };
