import { ModuleManager } from '../../moduleManager.js';

class AllHandsModule {
    constructor() {
      this.container = null;
      this.animationId = null;
      this.intervals = [];
      this.eventListeners = [];
      this.hands = [];
      this.mouseX = 0;
      this.mouseY = 0;

      this.config = {
        grid: {
          spacing: { value: 40, min: 15, max: 80, step: 5, label: 'Grid Spacing' },
          size: { value: 24, min: 8, max: 40, step: 2, label: 'Hand Size' }
        },
        behavior: {
          followMouse: { value: true, type: 'boolean', label: 'Follow Mouse' },
          rotateSpeed: { value: 0.3, min: 0.1, max: 5, step: 0.1, label: 'Rotation Speed' }
        },
        effects: {
          colorRadius: { value: 100, min: 50, max: 300, step: 10, label: 'Color Radius' },
          colorIntensity: { value: 0.8, min: 0.1, max: 1.0, step: 0.1, label: 'Color Intensity' }
        }
      };

      this.handEmoji = '👉';
    }

    createGrid() {
      this.hands = [];
      this.container.innerHTML = '';
      
      const spacing = this.config.grid.spacing.value;
      const containerRect = this.container.getBoundingClientRect();
      const cols = Math.floor(containerRect.width / spacing);
      const rows = Math.floor(containerRect.height / spacing);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const hand = document.createElement('div');
          hand.className = 'hand';
          hand.textContent = this.handEmoji;
          
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;
          
          hand.style.position = 'absolute';
          hand.style.left = x + 'px';
          hand.style.top = y + 'px';
          hand.style.fontSize = this.config.grid.size.value + 'px';
          hand.style.userSelect = 'none';
          hand.style.pointerEvents = 'none';
          hand.style.transformOrigin = 'center';
          hand.style.transition = `transform ${this.config.behavior.rotateSpeed.value * 0.1}s ease-out`;
          hand.style.filter = 'grayscale(100%)';
          
          hand.gridX = x;
          hand.gridY = y;
          
          this.container.appendChild(hand);
          this.hands.push(hand);
        }
      }
    }

    updateHandRotations() {
      if (!this.config.behavior.followMouse.value) return;
      
      const colorRadius = this.config.effects.colorRadius.value;
      const colorIntensity = this.config.effects.colorIntensity.value;
      
      this.hands.forEach(hand => {
        const dx = this.mouseX - hand.gridX;
        const dy = this.mouseY - hand.gridY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        hand.style.transform = `rotate(${angle}deg)`;
        
        if (distance <= colorRadius) {
          const proximity = 1 - (distance / colorRadius);
          const hue = (proximity * 240);
          const saturation = 100;
          const lightness = 50 + (proximity * 30);
          const alpha = proximity * colorIntensity;
          
          hand.style.filter = `grayscale(${100 - (proximity * 100)}%) 
                              hue-rotate(${hue}deg) 
                              saturate(${saturation + proximity * 100}%) 
                              brightness(${100 + proximity * 50}%)`;
          hand.style.textShadow = `0 0 ${proximity * 10}px hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        } else {
          hand.style.filter = 'grayscale(100%)';
          hand.style.textShadow = 'none';
        }
      });
    }

    handleMouseMove(event) {
      const rect = this.container.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    }

    animate() {
      this.updateHandRotations();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    async init() {
      this.container = document.getElementById('moduleContainer');
      if (!this.container) return;
      
      this.setupModule();
      this.startAnimation();
    }

    setupModule() {
      this.container.innerHTML = '';
      this.container.style.position = 'relative';
      this.container.style.overflow = 'hidden';
      this.container.style.background = '#000000';
      this.container.style.cursor = 'none';
      
      this.createGrid();
      
      const mouseMoveHandler = (event) => this.handleMouseMove(event);
      this.container.addEventListener('mousemove', mouseMoveHandler);
      this.eventListeners.push({
        element: this.container,
        event: 'mousemove',
        handler: mouseMoveHandler
      });
      
      const resizeHandler = () => {
        this.createGrid();
      };
      
      window.addEventListener('resize', resizeHandler);
      this.eventListeners.push({
        element: window,
        event: 'resize',
        handler: resizeHandler
      });
    }

    startAnimation() {
      this.animate();
    }

    onConfigUpdate() {
      this.createGrid();
      
      this.hands.forEach(hand => {
        hand.style.transition = `transform ${this.config.behavior.rotateSpeed.value}s ease-out, filter 0.2s ease-out`;
      });
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
      this.hands.forEach(hand => hand.remove());
      this.hands = [];
      if (this.container) {
        this.container.innerHTML = '';
      }
    }
}

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(AllHandsModule);
}