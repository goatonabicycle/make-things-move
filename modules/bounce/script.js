(async function () {
  class BouncyModule {
    constructor() {
      this.container = null;
      this.squares = [];
      this.animationId = null;

      this.config = {
        squares: {
          count: { value: 2, min: 1, max: 20, step: 1, label: 'Square Count' },
          minSize: { value: 50, min: 10, max: 200, step: 5, label: 'Min Size' },
          maxSize: { value: 100, min: 20, max: 300, step: 5, label: 'Max Size' },
          minSpeed: { value: 2, min: 1, max: 10, step: 0.5, label: 'Min Speed' },
          maxSpeed: { value: 5, min: 2, max: 15, step: 0.5, label: 'Max Speed' }
        },
        appearance: {
          trails: { value: 0, min: 0, max: 1, step: 0.01, label: 'Trails' },
          colorChange: { value: 0, min: 0, max: 1, step: 0.01, label: 'Color Change' }
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

      this.container.appendChild(square);

      return {
        element: square,
        x: parseFloat(square.style.left),
        y: parseFloat(square.style.top),
        speedX: speedX,
        speedY: speedY,
        size: size,
        color: square.style.backgroundColor,
        lastUpdate: performance.now(),
        colorChangeTimer: 0
      };
    }

    update(timestamp) {
      if (this.config.appearance.trails.value === 0) {
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 1)';
      } else {
        this.container.style.backgroundColor = `rgba(0, 0, 0, ${1 - this.config.appearance.trails.value})`;
      }

      this.squares.forEach(square => {
        const deltaTime = (timestamp - square.lastUpdate) / 16;
        square.lastUpdate = timestamp;

        square.x += square.speedX * deltaTime;
        square.y += square.speedY * deltaTime;

        if (square.x <= 0) {
          square.x = 0;
          square.speedX = Math.abs(square.speedX);
        } else if (square.x + square.size >= window.innerWidth) {
          square.x = window.innerWidth - square.size;
          square.speedX = -Math.abs(square.speedX);
        }

        if (square.y <= 0) {
          square.y = 0;
          square.speedY = Math.abs(square.speedY);
        } else if (square.y + square.size >= window.innerHeight) {
          square.y = window.innerHeight - square.size;
          square.speedY = -Math.abs(square.speedY);
        }

        square.element.style.left = `${square.x}px`;
        square.element.style.top = `${square.y}px`;

        if (this.config.appearance.colorChange.value > 0) {
          square.colorChangeTimer += deltaTime * this.config.appearance.colorChange.value;
          if (square.colorChangeTimer > 10) {
            square.element.style.backgroundColor = this.getRandomColor();
            square.colorChangeTimer = 0;
          }
        }
      });

      this.animationId = requestAnimationFrame(this.update);
    }

    generateSquares() {
      this.clearSquares();

      for (let i = 0; i < this.config.squares.count.value; i++) {
        this.squares.push(this.createSquare());
      }
    }

    clearSquares() {
      this.squares.forEach(square => {
        if (square.element && square.element.parentNode) {
          square.element.remove();
        }
      });
      this.squares = [];
    }

    init() {
      this.container = document.getElementById('animationContainer');
      if (!this.container) {
        console.error("Container not found!");
        return;
      }

      this.container.style.backgroundColor = '#000';
      this.container.style.position = 'relative';

      this.generateSquares();

      this.animationId = requestAnimationFrame(this.update);

      window.addEventListener('resize', this.generateSquares.bind(this));
    }

    onConfigUpdate() {
      this.generateSquares();
    }

    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      this.clearSquares();
      window.removeEventListener('resize', this.generateSquares);
    }
  }

  const moduleManager = new ModuleManager();
  await moduleManager.init(BouncyModule);
})();