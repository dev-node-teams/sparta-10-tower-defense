import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import { socketConnection, sendEvent } from './socket.js';
import { SpecialMonster } from './specialmonster.js';

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 0; // 유저 골드

let base; // 기지 객체
let baseHp = 100; // 기지 체력

let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 1500; // 몬스터 생성 주기
const monsters = [];
const specialMonsters = [];

let towers = [];

let monsterData = [];
let specialMonsterData = [];
let towerData;
let stagesData = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

const NUM_OF_TOWERS = 5; // 타워의 종류
let moveStageFlag = true;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const towerImage = [];

const monsterImages = [];
const specialMonsterImages = [];

let monsterPath;

// export function displayLevelUpText(level) {
//   const levelUpText = `${level} 스테이지!`;
//   const x = canvas.width / 2;
//   const y = canvas.height / 2;

//   const duration = 1500; // 1.5초 동안 표시

//   let startTime = Date.now();

//   function renderLevelUpText() {
//     const elapsedTime = Date.now() - startTime;

//     ctx.font = '100px Times New Roman';
//     ctx.fillStyle = 'yellow';
//     ctx.textAlign = 'center';
//     ctx.fillText(levelUpText, x, y);

//     if (elapsedTime < duration) {
//       requestAnimationFrame(renderLevelUpText);
//     }
//   }

//   // 처음 호출 시 텍스트를 그리기 시작
//   renderLevelUpText();
// }

// 텍스트 출력 이벤트?
export function diplayEvent(text, color, position, fontSize) {
  const eventText = text;
  const x = canvas.width / 2;
  const y = (canvas.height / 100) * position;

  const duration = 1500; // 1.5초 동안 표시

  let startTime = Date.now();

  function textDraw(text) {
    const elapsedTime = Date.now() - startTime;

    ctx.font = `${fontSize}px Times New Roman`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(eventText, x, y);

    if (elapsedTime < duration) {
      requestAnimationFrame(textDraw);
    }
  }

  // 처음 호출 시 텍스트를 그리기 시작
  textDraw();
}

export function moveStage(targetStage) {
  monsterLevel = targetStage;
  moveStageFlag = true;
}

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function placeNewTower() {
  const getShop = document.getElementById('shopModal');
  getShop.style.display = 'block';

  window.buybutton = (shopNumber) => {
    buytower(shopNumber);
  };
}

function buytower(shopNumber) {
  const { x, y } = getRandomPositionNearPath(200);

  if (userGold < towerData[shopNumber].price) {
    diplayEvent('골드가 부족합니다', 'red', 65, 70);
  } else {
    userGold -= towerData[shopNumber].price;

    const tower = new Tower(
      x,
      y,
      towerData[shopNumber].attackPower,
      towerData[shopNumber].attackRange,
      towerData[shopNumber].attackSpeed,
      towerData[shopNumber].price,
      towerImage[shopNumber],
      towerData[shopNumber].towerId,
    );
    towers.push(tower);
    tower.draw(ctx);

    sendEvent(30, {
      towerType: towerData[shopNumber].towerId,
      position: { x, y },
    });
  }
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  console.log('monsterData', monsterData);
  monsters.push(new Monster(monsterPath, monsterData, monsterImages, monsterLevel));
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.attackRange) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    const specialMonster = specialMonsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        sendEvent(3, { score });
        alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
        location.reload();
        return;
      }
      monster.draw(ctx);
      if (specialMonster) specialMonster.draw(ctx);
    } else if (monster.hp === -Infinity) {
      // 몬스터가 기지를 공격한 후
      monsters.splice(i, 1);
    } else {
      console.log(' monsters =>> ', monsters);

      /* 몬스터가 죽었을 때 */
      // 몬스터 제거
      monsters.splice(i, 1);

      // 서버에 이벤트 전송
      sendEvent(21, { monsterId: monster.monsterId, monsterLevel });

      console.log(' monsters =>> ', monsters);
    }
  }
  // for (let i = 0; i < monsters.length; i++) {}

  /* 특정 점수 도달 시 스테이지 이동 */
  if (monsterLevel < stagesData.length && score > stagesData[monsterLevel].score && moveStageFlag) {
    moveStageFlag = false;
    sendEvent(4, { score, currentStage: monsterLevel, targetStage: monsterLevel + 1, userGold });
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (isInitGame) {
    return;
  }

  isInitGame = true;
  sendEvent(2, { timestamp: Date.now() });
  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeBase(); // 기지 배치

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),

  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  // new Promise((resolve) => (towerImage.onload = resolve)),
  ...towerImage.map((img) => new Promise((resolve) => (img.onload = resolve))),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */

  socketConnection();

  // setSocket(serverSocket);
  // socketConnection();

  if (!isInitGame) {
    initGame();
  }

  /* 
    서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다! 
    e.g. serverSocket.on("...", () => {...});
    이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다! 
    if (!isInitGame) {
      initGame();
    }
  */
});

export function setStages(stageList) {
  stagesData = stageList;
}

export function setUserInfo(score, gold) {
  userGold = gold;
  score = score;
}

export function setMonsters(monsterList) {
  monsterData = monsterList;
  for (let i = 0; i < monsterData.length; i++) {
    // 인덱스를 0부터 시작하도록 변경
    const img = new Image();
    img.src = monsterData[i].imageUrl;
    monsterImages.push(img);
  }
}

export function setTowers(towerList) {
  towerData = towerList;
  for (let i = 0; i < towerData.length; i++) {
    const img = new Image();
    img.src = towerData[i].image;
    towerImage.push(img);
  }
}

export function setSpecialMonsters(specialMonsterList) {
  specialMonsterData = specialMonsterList;
  for (let i = 0; i < specialMonsterData.length; i++) {
    const img = new Image();
    img.src = specialMonsterData[i].imageUrl;
    specialMonsterImages.push(img);
  }
  //console.log('스페이셜 몬스터 이미지 : ', specialMonsterImages);
}

export function spawnSpecialMonster(specialMonster) {
  for (let i = 0; i < specialMonster.length; i++) {
    specialMonsters.push(
      new SpecialMonster(monsterPath, specialMonsterData[i], specialMonsterImages[i], monsterLevel),
    );
  }
}

export function setMonstersScore(setMonsterScoreList) {
  score = setMonsterScoreList;
}

export function setMonstersGold(setMonsterGoldList) {
  userGold = setMonsterGoldList;
}

export function spawnGoldenGoblin(isGoldenGobline) {
  monsters.push(new Monster(monsterPath, monsterData, monsterImages, monsterLevel));
}

// 상점 열기 버튼
const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.bottom = '50px';
buyTowerButton.style.right = '30px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '20px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', placeNewTower);

document.getElementById('mainCanvas').appendChild(buyTowerButton);

// 클릭 이벤트
const cCanvas = document.getElementById('gameCanvas');
const buttonContainer = document.getElementById('buttonContainer');

cCanvas.addEventListener('click', (event, tower) => {
  //클릭한 위치 찾기
  const rectCanvas = cCanvas.getBoundingClientRect();
  const x = event.clientX - rectCanvas.left;
  const y = event.clientY - rectCanvas.top;

  // 클릭한 곳에 타워가 포함되는지
  const findClick = towers.find(
    (i) => x > i.x && x < i.x + i.width && y > i.y && y < i.y + i.height,
  );

  if (findClick) {
    towerMenu(findClick);
  } else {
    buttonContainer.innerHTML = '';
  }
});

function towerMenu(tower) {
  buttonContainer.innerHTML = '';

  // 판매 버튼 생성
  const sellButton = document.createElement('button');
  sellButton.textContent = '타워 판매';
  sellButton.style.position = 'absolute';
  sellButton.style.left = `${tower.x + 80}px`; // 사각형 근처에 위치
  sellButton.style.top = `${tower.y + 80}px`;
  sellButton.style.width = '80px';
  sellButton.style.height = '30px';

  // 강화 버튼 생성
  const enhanceButton = document.createElement('button');
  enhanceButton.textContent = '타워 강화';
  enhanceButton.style.position = 'absolute';
  enhanceButton.style.left = `${tower.x + 80}px`; // 사각형 근처에 위치
  enhanceButton.style.top = `${tower.y + 30}px`;
  enhanceButton.style.width = '80px';
  enhanceButton.style.height = '30px';

  // 판매 버튼 기능
  sellButton.addEventListener('click', () => {
    sellTower(tower);
    buttonContainer.innerHTML = '';
  });

  // 버튼을 컨테이너에 추가
  buttonContainer.appendChild(sellButton);
  buttonContainer.appendChild(enhanceButton);
}

// 타워 판매 함수 ##
function sellTower(tower) {
  towers = towers.filter((t) => t !== tower);

  // 돈 계산 해야함 (구매 가격의 절반?)

  const x = tower.x;
  const y = tower.y;
  sendEvent(31, { towerType: tower.type, position: { x, y } });
}

export { monsterLevel };
