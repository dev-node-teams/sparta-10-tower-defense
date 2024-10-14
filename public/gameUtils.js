import { towers, enhanceData, towerData } from './game.js';
import { sendEvent } from './socket.js';
// 상점 UI 열기
function openTowerShop() {
  const getShop = document.getElementById('shopModal');
  getShop.style.display = 'block';
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

buyTowerButton.addEventListener('click', openTowerShop);

document.getElementById('mainCanvas').appendChild(buyTowerButton);

// 클릭 이벤트
const cCanvas = document.getElementById('gameCanvas');
const buttonContainer = document.getElementById('buttonContainer');
const towerRangeDiv = document.getElementById('towerRange');

cCanvas.addEventListener('click', (event) => {
  // 클릭한 위치 찾기
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
    buttonContainer.style.display = 'none';
    towerRangeDiv.style.display = 'none';
  }
});

// 타워 클릭 시 메뉴
function towerMenu(tower) {
  buttonContainer.innerHTML = '';
  buttonContainer.style.display = 'block';
  towerRangeDiv.style.display = 'block';

  let enhanceCost = {};
  let enhanceTotal = 0;

  // 판매 버튼 생성
  const sellButton = document.createElement('button');
  sellButton.textContent = '타워 판매';
  sellButton.style.position = 'absolute';
  sellButton.style.left = '53%';
  sellButton.style.bottom = '20px';
  sellButton.style.width = '90px';
  sellButton.style.height = '45px';
  sellButton.style.fontSize = '16px';
  sellButton.style.fontWeight = '1000';
  sellButton.style.zIndex = '4';

  // 강화 버튼 생성
  const enhanceButton = document.createElement('button');
  enhanceButton.textContent = '타워 강화';
  enhanceButton.style.position = 'absolute';
  enhanceButton.style.left = '5%';
  enhanceButton.style.bottom = '20px';
  enhanceButton.style.width = '90px';
  enhanceButton.style.height = '45px';
  enhanceButton.style.fontSize = '16px';
  enhanceButton.style.fontWeight = '1000';
  enhanceButton.style.zIndex = '4';

  // 메뉴 뒷판 생성
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.width = '220px';
  buttonContainer.style.height = '280px';
  buttonContainer.style.left = `${tower.x + 115}px`;
  buttonContainer.style.top = `${tower.y}px`;
  buttonContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.66)';
  buttonContainer.style.border = '3px solid black';
  buttonContainer.style.borderRadius = '14px';
  buttonContainer.style.fontSize = '22px';
  buttonContainer.style.fontWeight = '700';
  buttonContainer.style.color = 'white';
  buttonContainer.style.padding = '10px';
  buttonContainer.style.zIndex = '3';

  // 타워 사거리 그리기
  const towerX = tower.x;
  const towerY = tower.y;
  const towerWidth = tower.width;
  const towerHeight = tower.height;
  const CenterX = towerX + towerWidth / 2;
  const CenterY = towerY + towerHeight / 2;

  towerRangeDiv.style.position = 'absolute';
  towerRangeDiv.style.width = `${tower.attackRange * 2}px`;
  towerRangeDiv.style.height = `${tower.attackRange * 2}px`;
  towerRangeDiv.style.borderRadius = '50%'; // 원 모양
  towerRangeDiv.style.border = '10px solid red'; // 테두리
  towerRangeDiv.style.left = `${CenterX - tower.attackRange}px`;
  towerRangeDiv.style.top = `${CenterY - tower.attackRange}px`;
  towerRangeDiv.style.pointerEvents = 'none';
  towerRangeDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  towerRangeDiv.style.zIndex = '1';

  if (tower.enhanceLevel === 5) {
    enhanceCost.price = '최대 강화';
  } else {
    enhanceCost = enhanceData.find(
      (i) => i.towerId === tower.type && i.enhanceLevel === tower.enhanceLevel + 1,
    );
  }

  // 강화 비용 계산
  const targetMetaData = enhanceData.filter((i) => i.towerId === tower.type);
  for (let i = tower.enhanceLevel - 1; i >= 0; i--) {
    enhanceTotal += targetMetaData[i].price;
  }
  enhanceTotal = Math.floor((enhanceTotal + towerData[tower.type - 1].price) / 2);
  buttonContainer.innerHTML = `${tower.name} (+${tower.enhanceLevel})<br>공격력 : ${tower.attackPower}<br>연사력 : ${tower.attackSpeed}<br> 사거리 : ${tower.attackRange}<br><br>강화 비용 : ${enhanceCost.price}<br>판매 금액 : ${enhanceTotal} `;

  // 판매 버튼 기능 #31
  sellButton.addEventListener('click', () => {
    const x = tower.x;
    const y = tower.y;
    sendEvent(31, { position: { x, y } });
    buttonContainer.innerHTML = '';
    buttonContainer.style.display = 'none';
    towerRangeDiv.style.display = 'block';
  });

  // 강화 버튼 기능 #32
  enhanceButton.addEventListener('click', () => {
    const x = tower.x;
    const y = tower.y;
    sendEvent(32, { position: { x, y } });
    buttonContainer.innerHTML = '';
    buttonContainer.style.display = 'none';
    towerRangeDiv.style.display = 'block';
  });

  // 버튼을 컨테이너에 추가
  buttonContainer.appendChild(sellButton);
  buttonContainer.appendChild(enhanceButton);
}
