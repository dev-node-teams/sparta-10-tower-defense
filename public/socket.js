import {
  setMonsters,
  setStages,
  setTowers,
  setUserInfo,
  setMonstersScore,
  setMonstersGold,
  setSpecialMonsters,
  spawnSpecialMonster,
  towerBuyAgree,
  moveStage,
  diplayEvent,
  towerSellAgree,
  towerEnhanceAgree,
} from './game.js';

const IP = 'http://localhost:3005';

let socket = null;

let token = `Bearer ${getCookie('accessToken')}`;
let refreshToken = `Bearer ${getCookie('refreshToken')}`;
let CLIENT_VERSION = '1.0.0';

let userInfo = null;
let stages = null;
let towers = null;
let monsters = null;
let roundMonsters = null;
let score = null;
let userGold = null;

let targetStage = 0;
let updatedLoopLevel = 0;

const sendEvent = (handlerId, payload) => {
  const res = socket.emit('event', {
    token,
    refreshToken,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });

  // console.log('#sendEvent - res =>> ', res);
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

        case 3: // 게임종료
          console.log('게임종료 검증 완료 =>>>> ', data);
          /** 최고 점수 저장 */
          sendEvent(90, { score: data.score });

          break;

        case 4: // 스테이지 이동
          targetStage = data.payload.targetStage;
          updatedLoopLevel = data.payload.updatedLoopLevel || 0;
          diplayEvent(`${targetStage} 스테이지! `, 'yellow', 50, 100);
          moveStage(targetStage, updatedLoopLevel);
          break;

        case 21:
          setMonstersScore(data.totalScore);
          setMonstersGold(data.totalGold);
          spawnSpecialMonster(data.specialMonsters);
          break;

        case 22:
          diplayEvent('황금 고블린 처치', 'darkorange', 50, 100);
          setMonstersScore(data.totalScore);
          setMonstersGold(data.totalGold);
          break;

        case 30: // 타워 구매
          if (data.status === 'fail' && data.error) {
            diplayEvent(data.message, 'crimson', 65, 70);
          } else {
            diplayEvent(data.message, 'black', 25, 35);
            towerBuyAgree(data.towerType - 1, data.position);
            setMonstersGold(data.totalGold);
          }
          break;

        case 31: // 타워 판매
          if (data.status === 'fail' && data.error) {
            diplayEvent(data.message, 'red', 65, 70);
          } else {
            diplayEvent(data.message, 'black', 30, 35);
            towerSellAgree(data.position);
            setMonstersGold(data.totalGold);
          }
          break;

        case 32: // 타워 강화
          if (data.status === 'fail' && data.error) {
            diplayEvent(data.message, 'crimson', 55, 40);
          } else {
            diplayEvent(data.message, 'blue', 35, 40);
            towerEnhanceAgree(data.position, data.enhanceData);
            setMonstersGold(data.totalGold);
          }
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
