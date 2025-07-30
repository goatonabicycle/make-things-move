import { ModuleManager } from '../../moduleManager.js';

class BouncyModule {
  constructor() {
    this.container = null;
    this.squares = [];
    this.animationId = null;
    this.intervals = [];
    this.eventListeners = [];

    this.config = {
      squares: {
        count: { value: 2, min: 1, max: 20, step: 1, label: 'Square Count' },
        minSize: { value: 50, min: 10, max: 200, step: 5, label: 'Min Size' },
        maxSize: { value: 100, min: 20, max: 300, step: 5, label: 'Max Size' },
        minSpeed: { value: 2, min: 1, max: 10, step: 0.5, label: 'Min Speed' },
        maxSpeed: { value: 5, min: 2, max: 15, step: 0.5, label: 'Max Speed' }
      },
      appearance: {
        trails: { value: false, type: 'boolean', label: 'Trails' },
        colorChange: { value: false, type: 'boolean', label: 'Color Change' }
      }
    };

    this.update = this.update.bind(this);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createSquare() {
    const size = this.getRandomInt(this.config.squares.minSize.value, this.config.squares.maxSize.value);
    const speedX = (Math.random() < 0.5 ? -1 : 1) *
      this.getRandomInt(this.config.squares.minSpeed.value * 10, this.config.squares.maxSpeed.value * 10) / 10;
    const speedY = (Math.random() < 0.5 ? -1 : 1) *
      this.getRandomInt(this.config.squares.minSpeed.value * 10, this.config.squares.maxSpeed.value * 10) / 10;

    const square = document.createElement('div');
    square.className = 'bouncy-square';
    square.style.width = `${size}px`;
    square.style.height = `${size}px`;
    square.style.backgroundColor = this.getRandomColor();
    square.style.left = `${this.getRandomInt(0, window.innerWidth - size)}px`;
    square.style.top = `${this.getRandomInt(0, window.innerHeight - size)}px`;
    square.style.position = 'absolute';
    square.style.zIndex = '10';

    return {
      element: square,
      size: size,
      x: parseFloat(square.style.left),
      y: parseFloat(square.style.top),
      speedX: speedX,
      speedY: speedY,
      color: square.style.backgroundColor
    };
  }

  update() {
    this.squares.forEach(square => {
      square.x += square.speedX;
      square.y += square.speedY;

      if (square.x <= 0 || square.x >= window.innerWidth - square.size) {
        square.speedX *= -1;
        if (this.config.appearance.colorChange.value) {
          square.color = this.getRandomColor();
          square.element.style.backgroundColor = square.color;
        }
      }

      if (square.y <= 0 || square.y >= window.innerHeight - square.size) {
        square.speedY *= -1;
        if (this.config.appearance.colorChange.value) {
          square.color = this.getRandomColor();
          square.element.style.backgroundColor = square.color;
        }
      }

      square.x = Math.max(0, Math.min(window.innerWidth - square.size, square.x));
      square.y = Math.max(0, Math.min(window.innerHeight - square.size, square.y));

      square.element.style.left = `${square.x}px`;
      square.element.style.top = `${square.y}px`;
    });
  }

  createSquares() {
    this.squares.forEach(square => square.element.remove());
    this.squares = [];

    for (let i = 0; i < this.config.squares.count.value; i++) {
      const square = this.createSquare();
      this.container.appendChild(square.element);
      this.squares.push(square);
    }
  }

  async init() {
    this.container = document.getElementById('moduleContainer');
    if (!this.container) return;
    
    this.setupModule();
    this.startAnimation();
  }

  setupModule() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.createSquares();
  }

  startAnimation() {
    const animate = () => {
      this.update();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  onConfigUpdate() {
    if (this.config.appearance.trails.value) {
      this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
    } else {
      this.container.style.backgroundColor = '';
    }
    this.createSquares();
  }

  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];
    this.eventListeners.forEach(({element, event, handler}) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    this.squares.forEach(square => square.element.remove());
    this.squares = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(BouncyModule);
}