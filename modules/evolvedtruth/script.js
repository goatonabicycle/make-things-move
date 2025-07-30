import { ModuleManager } from '../../moduleManager.js';

class EvolvedTruthModule {
    constructor() {
      this.checkboxContainer = null;
      this.container = null;
      this.middle = null;
      this.allBoxes = [];
      this.animationId = null;
      this.particles = [];
      this.intervals = [];
      this.eventListeners = [];

      this.config = {
        grid: {
          count: { value: 25, min: 10, max: 50, step: 5, label: 'Grid Count' },
          size: { value: 18, min: 10, max: 30, step: 2, label: 'Box Size' },
          spacing: { value: 1.2, min: 0.8, max: 2.0, step: 0.1, label: 'Spacing' }
        },
        animation: {
          rippleSpeed: { value: 80, min: 30, max: 150, step: 10, label: 'Ripple Speed (ms)' },
          glowIntensity: { value: 15, min: 5, max: 30, step: 5, label: 'Glow Intensity' },
          particleCount: { value: 20, min: 5, max: 50, step: 5, label: 'Particles' }
        },
        movement: {
          waveAmplitude: { value: 15, min: 5, max: 40, step: 5, label: 'Wave Amplitude' },
          cascadeChance: { value: 0.7, min: 0.2, max: 1.0, step: 0.1, label: 'Cascade Chance' },
          neighborRange: { value: 2, min: 1, max: 4, step: 1, label: 'Neighbor Range' },
          cascadeDelay: { value: 50, min: 10, max: 200, step: 10, label: 'Cascade Delay (ms)' }
        },
        appearance: {
          colorShift: { value: true, type: 'boolean', label: 'Color Shift' },
          pulseEffect: { value: true, type: 'boolean', label: 'Pulse Effect' },
          trailEffect: { value: true, type: 'boolean', label: 'Trail Effect' }
        }
      };

      this.currentHue = 0;
    }

    setupBackground() {
      this.checkboxContainer.style.position = "relative";
      this.checkboxContainer.style.display = "flex";
      this.checkboxContainer.style.justifyContent = "center";
      this.checkboxContainer.style.alignItems = "center";
      this.checkboxContainer.style.height = "100vh";
      this.checkboxContainer.style.width = "100vw";
      this.checkboxContainer.style.overflow = "hidden";
      this.checkboxContainer.style.background = "radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)";

      this.checkboxContainer.innerHTML = "";

      this.container = document.createElement("div");
      this.container.style.position = "absolute";
      this.container.style.width = "800px";
      this.container.style.height = "800px";
      this.container.style.left = "50%";
      this.container.style.top = "50%";
      this.container.style.transform = "translate(-50%, -50%)";
      this.container.style.display = "flex";
      this.container.style.justifyContent = "center";
      this.container.style.alignItems = "center";
      this.checkboxContainer.appendChild(this.container);
    }

    get count() { return this.config.grid.count.value; }
    get size() { return this.config.grid.size.value; }
    get spacing() { return this.config.grid.spacing.value; }
    get midPos() { return (this.count * this.size * this.spacing) / 2; }

    createCheckbox(id, top, left, gridX = 0, gridY = 0) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.style.position = "absolute";
      checkbox.style.margin = "0";
      checkbox.style.width = this.size + "px";
      checkbox.style.height = this.size + "px";
      checkbox.style.top = top + "px";
      checkbox.style.left = left + "px";
      checkbox.style.appearance = "none";
      checkbox.style.backgroundColor = "#1a1a1a";
      checkbox.style.borderRadius = "50%";
      checkbox.style.cursor = "pointer";
      checkbox.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      checkbox.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(255,255,255,0.1)";
      checkbox.style.border = "1px solid #333";
      checkbox.style.zIndex = "1";

      checkbox.gridX = gridX;
      checkbox.gridY = gridY;
      checkbox.baseX = parseFloat(left);
      checkbox.baseY = parseFloat(top);

      checkbox.onclick = (e) => {
        e.preventDefault();
        this.handleCheckboxClick(checkbox);
        return false;
      };

      this.container.appendChild(checkbox);
      this.allBoxes.push(checkbox);
      return checkbox;
    }

    handleCheckboxClick(clickedBox) {
      clickedBox.checked = !clickedBox.checked;
      this.updateCheckboxVisual(clickedBox);

      this.cascadeToNeighbors(clickedBox);
    }

    cascadeToNeighbors(sourceBox, intensity = 1, visited = new Set()) {
      if (intensity <= 0 || visited.has(sourceBox.id)) return;
      visited.add(sourceBox.id);

      const neighbors = this.getNeighbors(sourceBox);

      neighbors.forEach((neighbor, index) => {
        setTimeout(() => {
          const cascadeChance = this.config.movement.cascadeChance.value * intensity;
          if (Math.random() < cascadeChance) {
            neighbor.checked = !neighbor.checked;
            this.updateCheckboxVisual(neighbor);
            this.animateCheckbox(neighbor, intensity);

            if (intensity > 0.3) {
              this.cascadeToNeighbors(neighbor, intensity * 0.6, visited);
            }
          }
        }, index * this.config.movement.cascadeDelay.value);
      });
    }

    getNeighbors(box) {
      const neighbors = [];
      const range = this.config.movement.neighborRange.value;

      this.allBoxes.forEach(otherBox => {
        if (otherBox === box) return;

        const dx = Math.abs(otherBox.gridX - box.gridX);
        const dy = Math.abs(otherBox.gridY - box.gridY);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= range) {
          neighbors.push(otherBox);
        }
      });

      return neighbors.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.gridX - box.gridX, 2) + Math.pow(a.gridY - box.gridY, 2));
        const distB = Math.sqrt(Math.pow(b.gridX - box.gridX, 2) + Math.pow(b.gridY - box.gridY, 2));
        return distA - distB;
      });
    }

    animateCheckbox(checkbox, intensity = 1) {
      const amplitude = this.config.movement?.waveAmplitude?.value || 10;
      const duration = 600;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const wave = Math.sin(progress * Math.PI * 4) * (1 - progress);

          const offsetX = wave * amplitude * intensity * 0.5;
          const offsetY = wave * amplitude * intensity * 0.3;

          checkbox.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + wave * 0.3})`;

          requestAnimationFrame(animate);
        } else {
          checkbox.style.transform = 'translate(0px, 0px) scale(1)';
        }
      };

      requestAnimationFrame(animate);
    }

    updateCheckboxVisual(checkbox) {
      if (checkbox.checked) {
        const color = this.getColorForDistance(0, this.count);
        checkbox.style.backgroundColor = color;
        checkbox.style.boxShadow = `0 0 ${this.config.animation.glowIntensity.value}px ${color}`;
        checkbox.style.transform = 'scale(1.2)';
      } else {
        checkbox.style.backgroundColor = "#1a1a1a";
        checkbox.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(255,255,255,0.1)";
        checkbox.style.transform = 'scale(1)';
      }
    }

    createParticle(x, y, color) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = "4px";
      particle.style.height = "4px";
      particle.style.backgroundColor = color;
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "5";

      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      const life = 1.0;

      this.container.appendChild(particle);

      return {
        element: particle,
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: life,
        maxLife: life
      };
    }

    updateParticles() {
      this.particles = this.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        const opacity = particle.life / particle.maxLife;
        particle.element.style.left = particle.x + "px";
        particle.element.style.top = particle.y + "px";
        particle.element.style.opacity = opacity;

        if (particle.life <= 0) {
          particle.element.remove();
          return false;
        }
        return true;
      });
    }

    getColorForDistance(distance, maxDistance) {
      if (!this.config.appearance.colorShift.value) {
        return `hsl(280, 70%, 60%)`;
      }

      const normalizedDistance = distance / maxDistance;
      const hue = (this.currentHue + normalizedDistance * 120) % 360;
      const saturation = 70 + normalizedDistance * 30;
      const lightness = 40 + normalizedDistance * 20;

      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    createGrid() {
      this.allBoxes.forEach(box => box.remove());
      this.allBoxes = [];

      // Create center checkbox
      this.middle = this.createCheckbox("middle", this.midPos - this.size / 2, this.midPos - this.size / 2, 0, 0);

      this.middle.style.backgroundColor = "#ff4444";
      this.middle.style.border = "2px solid #ff6666";
      this.middle.style.transform = "scale(1.4)";
      this.middle.style.zIndex = "10";
      this.middle.style.boxShadow = `0 0 ${this.config.animation.glowIntensity.value}px rgba(255,68,68,0.8)`;

      if (this.config.appearance.pulseEffect.value) {
        this.middle.style.animation = "pulse 2s ease-in-out infinite";
      }

      // Create grid pattern instead of just lines
      const gridSize = Math.ceil(this.count / 2);

      for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
          if (x === 0 && y === 0) continue; // Skip center (already created)

          const distance = Math.sqrt(x * x + y * y);
          if (distance > this.count / 2) continue; // Only create within radius

          const pixelX = this.midPos - this.size / 2 + x * this.size * this.spacing;
          const pixelY = this.midPos - this.size / 2 + y * this.size * this.spacing;

          this.createCheckbox(`grid_${x}_${y}`, pixelY, pixelX, x, y);
        }
      }
    }

    createRippleEffect() {
      this.handleCheckboxClick(this.middle);

      for (let i = 0; i < this.config.animation.particleCount.value; i++) {
        const particle = this.createParticle(
          this.midPos,
          this.midPos,
          this.getColorForDistance(0, this.count)
        );
        this.particles.push(particle);
      }
    }

    animate() {
      this.updateParticles();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    async init() {
      this.checkboxContainer = document.getElementById("moduleContainer");
      if (!this.checkboxContainer) return;
      
      this.setupModule();
      this.startAnimation();
    }

    setupModule() {
      this.setupBackground();
      this.createGrid();
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1.4); }
          50% { transform: scale(1.6); }
        }
      `;
      document.head.appendChild(style);
    }

    startAnimation() {
      this.animate();
    }

    onConfigUpdate() {
      this.createGrid();
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
      this.particles.forEach(p => p.element.remove());
      this.particles = [];
      this.allBoxes.forEach(box => box.remove());
      this.allBoxes = [];
      if (this.checkboxContainer) {
        this.checkboxContainer.innerHTML = '';
      }
    }
  }

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(EvolvedTruthModule);
}
