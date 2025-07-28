import { ModuleManager } from '../../moduleManager.js';

class WhereEvenAmIModule {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.objects = [];
      this.animationId = null;
      this.colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

      this.config = {
        objects: {
          count: { value: 50, min: 10, max: 200, step: 10, label: 'Count' },
          size: { value: 20, min: 5, max: 50, step: 5, label: 'Size' }
        },
        motion: {
          speed: { value: 5, min: 1, max: 20, step: 1, label: 'Speed' },
          chaos: { value: 0.5, min: 0, max: 1, step: 0.1, label: 'Chaos' }
        },
        appearance: {
          opacity: { value: 0.8, min: 0.1, max: 1, step: 0.1, label: 'Opacity' },
          trails: { value: 0.5, min: 0, max: 0.9, step: 0.1, label: 'Trails' }
        }
      };
    }

    init() {
      this.canvas = document.getElementById('canvas');
      if (!this.canvas) {
        console.error("Canvas not found!");
        return;
      }

      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx = this.canvas.getContext('2d');

      this.createObjects();
      this.animate();

      window.addEventListener('resize', () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      });
    }

    createObjects() {
      this.objects = [];
      for (let i = 0; i < this.config.objects.count.value; i++) {
        this.objects.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * this.config.objects.size.value + 5,
          speedX: (Math.random() - 0.5) * this.config.motion.speed.value * (1 + Math.random() * this.config.motion.chaos.value * 5),
          speedY: (Math.random() - 0.5) * this.config.motion.speed.value * (1 + Math.random() * this.config.motion.chaos.value * 5),
          color: this.colors[Math.floor(Math.random() * this.colors.length)]
        });
      }
    }

    animate() {
      this.ctx.fillStyle = "rgba(0, 0, 0, " + (1 - this.config.appearance.trails.value) + ")";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.objects.length; i++) {
        const obj = this.objects[i];

        obj.x += obj.speedX;
        obj.y += obj.speedY;

        if (obj.x < 0) obj.x = this.canvas.width;
        if (obj.x > this.canvas.width) obj.x = 0;
        if (obj.y < 0) obj.y = this.canvas.height;
        if (obj.y > this.canvas.height) obj.y = 0;

        this.ctx.globalAlpha = this.config.appearance.opacity.value;
        this.ctx.beginPath();
        this.ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
        this.ctx.fillStyle = obj.color;
        this.ctx.fill();
      }

      this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    onConfigUpdate() {
      this.createObjects();
    }

    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(WhereEvenAmIModule);
}