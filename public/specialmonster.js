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

    this.setRandomDirection();
    this.init(level);
  }

  init(level) {
    this.maxHp = this.specialMonsterInfo.maxHp + 10 * level; // 몬스터의 현재 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.attackPower = this.specialMonsterInfo.attackPower + 5 * level; // 몬스터의 공격력 (기지에 가해지는 데미지)
  }

  setRandomDirection() {
    let randomAngle = Math.random() * 2 * Math.PI; // 0부터 2파이(360) 사이의 랜덤한 각도
    this.moveX = Math.abs(Math.cos(randomAngle) * this.speed);
    this.moveY = Math.sin(randomAngle) * this.speed;
  }

  move(canvas) {
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    this.x += this.moveX;
    this.y += this.moveY;

    if (this.x <= 0 || this.x + this.width >= canvasWidth) {
      this.moveX *= -1;
      // x축 반대 방향으로 변경
    }

    if (this.y <= 0 || this.y + this.height >= canvasHeight) {
      this.moveY *= -1;
      // y축 반대 방향으로 변경
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(레벨 ${this.level}) ${this.hp}/${this.maxHp}`, this.x, this.y - 5);
  }
}
