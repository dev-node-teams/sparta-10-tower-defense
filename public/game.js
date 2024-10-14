import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import { socketConnection, sendEvent } from './socket.js';
import { SpecialMonster } from './specialmonster.js';
import './gameUtils.js';
import { towerMenu } from './gameUtils.js';

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let userGold = 0; // 유저 골드

let base; // 기지 객체
let baseHp = 100; // 기지 체력

let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 1000; // 몬스터 생성 주기
const GOLIDEN_GOBLIN_DISAPPEAR = 15000; // 황금 고블린 사라지는 시간
let goldenGoblineTempTimer = 0;
let goblineStartTime = null;
const monsters = [];
const specialMonsters = [];

let towers = [];

let monsterData = [];
let specialMonsterData = [];
let towerData;
let stagesData = [];
let enhanceData = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let loopLevel = 0; // 마지막 스테이지 이후 회귀한 횟수
let scoreAtLastStage = 0; // 지난 스테이지에서의 점수, 스테이지 오를 때마다 score로 갱신됨
let stageThreshHold = null;
let isInitGame = false;

let moveStageFlag = true;
let settedEnd = null;
let timerEnd = (boo = true) => {
  settedEnd = boo;
};

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

let isDestroyed;

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

// 텍스트 출력
export function diplayEvent(text, color, position, fontSize) {
  const eventText = text;
  const x = canvas.width / 2;
  const y = (canvas.height / 100) * position;

  const duration = 1500; // 1.5초 동안 표시

  let startTime = Date.now();

  function textDraw(text) {
    const elapsedTime = Date.now() - startTime;
    ctx.lineWidth = 2; // 외곽선 두께 설정
    ctx.strokeStyle = 'black'; // 외곽선 색상
    ctx.font = `${fontSize}px Times New Roman`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(eventText, x, y);
    ctx.strokeText(eventText, x, y);

    if (elapsedTime < duration) {
      requestAnimationFrame(textDraw);
    }
  }

  // 처음 호출 시 텍스트를 그리기 시작
  textDraw();
}

export function moveStage(targetStage, updatedLoopLevel) {
  monsterLevel = targetStage;
  scoreAtLastStage = score;
  loopLevel = updatedLoopLevel;
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
    x: posX * 0.95,
    y: posY + offsetY,
  };
}

// 타워 구매 함수 #30
function towerBuy(shopNumber) {
  const { x, y } = getRandomPositionNearPath(200);

  sendEvent(30, {
    towerType: shopNumber + 1,
    position: { x, y },
  });
}

// 타워 구매 승인
export function towerBuyAgree(data, position) {
  const { x, y } = position;

  const tower = new Tower(
    x,
    y,
    data.attackPower,
    data.attackRange,
    data.attackSpeed,
    data.price,
    towerImage[data.towerId - 1],
    data.towerId,
    data.name,
  );
  towers.push(tower);
  tower.draw(ctx);
}

// 타워 판매 함수
export function towerSellAgree(target) {
  towers = towers.filter((t) => t.x !== target.x && t.y !== target.y);
}

// 타워 강화 함수
export function towerEnhanceAgree(position, data) {
  const findTower = towers.find((i) => i.x === position.x && i.y === position.y);
  findTower.enhance(data);
  towerMenu(findTower);
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  monsters.push(new Monster(monsterPath, monsterData, monsterImages, monsterLevel + loopLevel));
}

function gameLoop() {
  // console.log(stagesData);
  // {stageId: 1, score: 100, bonusScore: 0, versionGroupId: 1}

  // {stageId: 2, score: 200, bonusScore: 50, versionGroupId: 1}

  // {stageId: 3, score: 300, bonusScore: 100, versionGroupId: 1}

  // {stageId: 4, score: 500, bonusScore: 150, versionGroupId: 1}

  // {stageId: 5, score: 800, bonusScore: 200, versionGroupId: 1}

  // {stageId: 6, score: 1000, bonusScore: 300
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.textAlign = 'left';
  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  const elapsedTime = Date.now() - goblineStartTime; // 경과 시간 계산
  let leftTime = !settedEnd ? Math.max(0, goldenGoblineTempTimer - elapsedTime) : 0;
  ctx.font = '40px Times New Roman';
  ctx.fillStyle = 'yellow';
  ctx.lineWidth = 4; // 외곽선 두께 설정
  ctx.strokeStyle = 'black'; // 외곽선 색상
  ctx.textAlign = 'center';
  const centerX = canvas.width / 2;

  if (leftTime > 0) {
    const timeText = `🕒황금 고블린 남은 시간: ${(leftTime / 1000).toFixed(1)}초`; // 소수점 1자리
    ctx.strokeText(timeText, centerX, 1000); // 외곽선 텍스트 그리기
    ctx.fillText(timeText, centerX, 1000); // 안쪽 텍스트 그리기
  } else {
    const findingText = `황금 고블린 찾는 중...`;
    ctx.strokeText(findingText, centerX, 1000); // 외곽선 텍스트 그리기
    ctx.fillText(findingText, centerX, 1000); // 안쪽 텍스트 그리기
  }

  ctx.font = '25px Times New Roman';

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx);
    tower.updateCooldown();

    // 공격 범위 내에 황금 고블린이 있으면 먼저 황금 고블린을 때리게 수정
    let targetMonster = findTargetInRange(tower, specialMonsters)
      ? findTargetInRange(tower, specialMonsters)
      : findTargetInRange(tower, monsters);
    if (targetMonster) tower.attack(targetMonster);
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  if (!isDestroyed) {
    CheckmonsterProgress(monsters);
    if (specialMonsters.length) CheckmonsterProgress(specialMonsters);
  } else {
    diplayEvent(`게임 오버`, 'red', 50, 100);
    diplayEvent(`스파르타 본부를 지키지 못했다...ㅠㅠ`, 'red', 60, 100);

    // 게임종료 후 버튼 [ 뒤로가기 ]
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // 뒤로가기
    const backButton = document.createElement('button');
    backButton.textContent = '뒤로가기';
    backButton.style.position = 'absolute';
    backButton.style.bottom = y / 2 + 'px'; //'350px';
    backButton.style.right = x / 2 + 420 + 'px'; //'30px';
    backButton.style.padding = '10px 20px';
    backButton.style.fontSize = '20px';
    backButton.style.cursor = 'pointer';

    backButton.addEventListener('click', () => {
      location.reload();
    });
    document.getElementById('mainCanvas').appendChild(backButton);

    return;
  }

  /* 특정 점수 도달 시 스테이지 이동 */
  if (monsterLevel < stagesData.length && score > stagesData[monsterLevel].score && moveStageFlag) {
    moveStageFlag = false;
    sendEvent(4, { score, currentStage: monsterLevel, targetStage: monsterLevel + 1 });
  } else if (
    monsterLevel === stagesData.length &&
    score - scoreAtLastStage >= stageThreshHold &&
    moveStageFlag
  ) {
    moveStageFlag = false;
    sendEvent(4, { score, currentStage: monsterLevel, targetStage: monsterLevel, loopLevel });
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function findTargetInRange(tower, enemies) {
  for (let enemy of enemies) {
    const distance = Math.sqrt(Math.pow(tower.x - enemy.x, 2) + Math.pow(tower.y - enemy.y, 2));
    if (distance < tower.attackRange) {
      return enemy;
    }
  }
  return null;
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
  ...specialMonsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
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

function CheckmonsterProgress(monsters) {
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      isDestroyed = monster.monsterId >= 256 ? monster.move(canvas) : monster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        sendEvent(3, { score });
        return;
      }
      monster.draw(ctx);
    } else if (monster.hp === -Infinity) {
      // 몬스터가 기지를 공격한 후
      monsters.splice(i, 1);
    } else {
      /* 몬스터가 죽었을 때 */
      // 몬스터 제거
      monsters.splice(i, 1);
      // 서버에 이벤트 전송
      if (monster.monsterId >= 256) {
        sendEvent(22, { monsterId: monster.monsterId, monsterLevel });
      } else sendEvent(21, { monsterId: monster.monsterId, monsterLevel });
    }
  }
}

export function setStages(stageList, stageThresh) {
  stagesData = stageList;
  stageThreshHold = stageThresh;
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
    const imgDiv = document.getElementById(`shopimg${i + 1}`);

    const img = new Image();
    img.src = towerData[i].image;
    towerImage.push(img);
    // 상점 UI 갱신
    document.getElementById(`productName${i + 1}`).innerHTML =
      `== ${towerData[i].name} ==<br> 가격 : ${towerData[i].price}G`;

    // 타워 구매 버튼
    const div = document.getElementById(`productName${i + 1}`);
    const productButton = document.createElement('button');
    productButton.textContent = '구매';
    // productButton.style.position = 'absolute';
    productButton.style.bottom = '20px';
    productButton.style.padding = '5px 5px 5px 5px';
    productButton.style.fontSize = '20px';
    productButton.style.cursor = 'pointer';
    productButton.addEventListener('click', () => {
      towerBuy(i);

      // 상점 이미지 갱신
    });
    imgDiv.appendChild(img);
    div.appendChild(productButton);
  }
}

export function setEnhance(enhance) {
  enhanceData = enhance;
}

export function setSpecialMonsters(specialMonsterList) {
  specialMonsterData = specialMonsterList;
  for (let i = 0; i < specialMonsterData.length; i++) {
    const img = new Image();
    img.src = specialMonsterData[i].imageUrl;
    specialMonsterImages.push(img);
  }
}

export function spawnSpecialMonster(specialMonster) {
  const temp = specialMonster;
  for (let i = 0; i < temp.length; i++) {
    const specialMonster = new SpecialMonster(
      monsterPath[0],
      specialMonsterData[i],
      specialMonsterImages[i],
      monsterLevel,
    );

    specialMonsters.push(specialMonster);
    diplayEvent('황금 고블린 출현!!', 'darkorange', 50, 100);
    timerEnd(false);

    // 황금 고블린 Id를 바탕으로 다른 황금 고블린이 생성돼도
    // 문제 없이 먼저 태어난 황금 고블인이 사라집니다.
    removeSpecialMonster(specialMonster.monsterId, GOLIDEN_GOBLIN_DISAPPEAR);
  }
}

function removeSpecialMonster(monsterId, delay) {
  goldenGoblineTempTimer = GOLIDEN_GOBLIN_DISAPPEAR;
  goblineStartTime = Date.now();
  setTimeout(() => {
    goldenGoblineTempTimer = 0;
    const index = specialMonsters.findIndex(
      (specialMonster) => specialMonster.monsterId === monsterId,
    );
    if (index != -1) {
      specialMonsters.splice(index, 1);
      diplayEvent('황금 고블린이 도망갔다..', 'darkorange', 50, 100);
    }
  }, delay);
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

export function setHighScore(score) {
  highScore = score;
}

export { monsterLevel, towers, enhanceData, towerData, timerEnd };
