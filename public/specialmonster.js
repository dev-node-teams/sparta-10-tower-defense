export class SpecialMonster {
  constructor(path, specialMonster, specialMonsterImage, level) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    if (!path) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }
    this.specialMonsterInfo = specialMonster;
    this.monsterId = this.specialMonsterInfo.monsterId;
    this.path = path; // 몬스터가 이동할 경로
    this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
    this.x = path.x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.y = path.y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.width = this.specialMonsterInfo.width; // 몬스터 이미지 가로 길이
    this.height = this.specialMonsterInfo.height; // 몬스터 이미지 세로 길이
    this.speed = this.specialMonsterInfo.speed; // 몬스터의 이동 속도
    this.image = specialMonsterImage; // 몬스터 이미지
    this.level = level; // 몬스터 레벨

    // 초기 랜덤 방향 결정
    this.directionX = Math.round() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;
    this.init(level);
  }

  init(level) {
    this.maxHp = this.specialMonsterInfo.maxHp + 10 * level; // 몬스터의 현재 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.attackPower = this.specialMonsterInfo.attackPower + 5 * level; // 몬스터의 공격력 (기지에 가해지는 데미지)
  }

  move(canvas) {
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    // x축 방향과 스피드로 이동
    this.x += this.directionX * this.speed;
    // y축 방향과 스피드로 이동
    this.y += this.directionY * this.speed;

    // x축 경계에 도달한 경우 (왼쪽 또는 오른쪽 벽에 부딪힘)
    if (this.x <= 0 || this.x + this.width >= canvasWidth) {
      this.directionX *= -1; // x축 반대 방향으로 변경
    }

    // y축 경계에 도달한 경우 (위쪽 또는 아래쪽 벽에 부딪힘)
    if (this.y <= 0 || this.y + this.height >= canvasHeight) {
      this.directionY *= -1; // y축 반대 방향으로 변경
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(레벨 ${this.level}) ${this.hp}/${this.maxHp}`, this.x, this.y - 5);
  }
}
