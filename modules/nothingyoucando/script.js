import { ModuleManager } from '../../moduleManager.js';

class NothingYouCanDoModule {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.enemies = [];
    this.lastTime = 0;
    this.animationFrame = null;
    this.spawnInterval = null;

    this.config = {
      enemies: {
        spawnRate: { value: 1000, min: 100, max: 3000, step: 100, label: 'Spawn Rate (ms)' },
        speed: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Enemy Speed' }
      }
    };
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.getElementById('grid-container').appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.base = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };

    this.startGameLoop();
    this.startEnemySpawning();
  }

  update(deltaTime) {
    this.enemies.forEach(enemy => {
      let dx = this.base.x - enemy.x;
      let dy = this.base.y - enemy.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        enemy.x += (dx / distance) * enemy.speed * deltaTime;
        enemy.y += (dy / distance) * enemy.speed * deltaTime;
      }
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw base
    this.ctx.fillStyle = '#2196F3';
    this.ctx.beginPath();
    this.ctx.arc(this.base.x, this.base.y, 20, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw enemies
    this.ctx.fillStyle = '#f44336';
    this.enemies.forEach(enemy => {
      this.ctx.beginPath();
      this.ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = (timestamp - this.lastTime) / 56;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();
    this.animationFrame = requestAnimationFrame((t) => this.gameLoop(t));
  }

  startEnemySpawning() {
    this.spawnInterval = setInterval(() => {
      let side = Math.floor(Math.random() * 4);
      let x, y;

      switch (side) {
        case 0: // top
          x = Math.random() * this.canvas.width;
          y = 0;
          break;
        case 1: // right
          x = this.canvas.width;
          y = Math.random() * this.canvas.height;
          break;
        case 2: // bottom
          x = Math.random() * this.canvas.width;
          y = this.canvas.height;
          break;
        case 3: // left
          x = 0;
          y = Math.random() * this.canvas.height;
          break;
      }

      this.enemies.push({
        x: x,
        y: y,
        speed: this.config.enemies.speed.value
      });
    }, this.config.enemies.spawnRate.value);
  }

  startGameLoop() {
    this.animationFrame = requestAnimationFrame((t) => this.gameLoop(t));
  }

  onConfigUpdate() {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    this.startEnemySpawning();
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(NothingYouCanDoModule);
}