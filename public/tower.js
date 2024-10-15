export class Tower {
  attackColor = ['#FF1493', '#ADD8E6', '#6495ED', '#8B008B', '#191970'];

  constructor(x, y, attackPower, attackRange, attackSpeed, cost, image, type, name) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.enhancePower = 0;
    this.enhanceRange = 0;
    this.enhanceSpeed = 0;
    this.attackPower = attackPower; // 타워 공격력
    this.attackRange = attackRange; // 타워 사거리
    this.attackSpeed = attackSpeed; // 타워 공격속도
    this.cost = cost; // 타워 구입 비용
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.cooldown = 0;
    this.image = image;
    this.type = type;
    this.enhanceLevel = 0;
    this.name = name;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = this.attackColor[this.type % 5];
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.x - 22, this.y + 155, 120, 27);

    ctx.fillStyle = 'yellow';
    ctx.fillText(
      `${'★'.repeat(this.enhanceLevel)}` + `${'☆'.repeat(5 - this.enhanceLevel)}`,
      this.x + 37,
      this.y + 175,
    );
  }

  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower + this.enhancePower;
      this.cooldown = this.attackSpeed - this.enhanceSpeed; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  enhance(data) {
    this.enhancePower = data.increasePower;
    this.enhanceRange = data.increaseRange;
    this.enhanceSpeed = data.increaseSpeed;
    this.enhanceLevel = data.enhanceLevel;
    // this.image = 강화 이미지 계획은 폐기
  }
}
