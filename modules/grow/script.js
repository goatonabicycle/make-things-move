import { ModuleManager } from '../../moduleManager.js';

class GrowModule {
  constructor() {
    this.tree = null;
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;

    this.config = {
      structure: {
        branchWidth: { value: 8, min: 1, max: 40, step: 1, label: 'Width' },
        lengthRatio: { value: 0.2, min: 0.05, max: 1, step: 0.05, label: 'Length' },
        lengthDecay: { value: 0.8, min: 0.3, max: 1.2, step: 0.05, label: 'Length Decay' },
        widthDecay: { value: 0.7, min: 0.3, max: 1.2, step: 0.05, label: 'Width Decay' },
        maxGen: { value: 8, min: 2, max: 15, step: 1, label: 'Max Gen' },
        minLength: { value: 15, min: 2, max: 50, step: 1, label: 'Min Length' },
        growthSpeed: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Growth' }
      },
      branching: {
        branchChance: { value: 0.8, min: 0, max: 1, step: 0.05, label: 'Branch Chance' },
        minBranches: { value: 2, min: 2, max: 5, step: 1, label: 'Min Branches' },
        maxBranches: { value: 3, min: 2, max: 7, step: 1, label: 'Max Branches' },
        branchSpread: { value: 1.25, min: 0.1, max: Math.PI, step: 0.1, label: 'Spread' },
        randomSpread: { value: false, type: 'boolean', label: 'Random Spread' }
      },
      animation: {
        swaySpeed: { value: 0.001, min: 0, max: 0.01, step: 0.0001, label: 'Sway Speed' },
        swayAmount: { value: 0.05, min: 0, max: 0.5, step: 0.01, label: 'Sway Size' },
        swayDecay: { value: 0.005, min: 0, max: 0.05, step: 0.001, label: 'Sway Decay' },
        pulseSpeed: { value: 0.003, min: 0, max: 0.02, step: 0.001, label: 'Pulse' },
        fadeAmount: { value: 0.1, min: 0.01, max: 0.5, step: 0.01, label: 'Fade' }
      },
      packets: {
        spawnChance: { value: 0.02, min: 0, max: 0.3, step: 0.01, label: 'Spawn Rate' },
        speed: { value: 0.02, min: 0.01, max: 0.2, step: 0.01, label: 'Speed' },
        size: { value: 2, min: 1, max: 10, step: 0.5, label: 'Size' },
        colorCycle: { value: 0, min: 0, max: 0.1, step: 0.001, label: 'Color Cycle' }
      },
      colors: {
        branchHue: { value: 140, min: 0, max: 360, step: 1, label: 'Branch Hue' },
        packetHue: { value: 180, min: 0, max: 360, step: 1, label: 'Packet Hue' },
        saturation: { value: 100, min: 0, max: 100, step: 5, label: 'Saturation' }
      }
    };
  }

  createBranch(x, y, angle = -Math.PI / 2, len = this.canvas.height * this.config.structure.lengthRatio.value,
    width = this.config.structure.branchWidth.value, gen = 0, sway = 0) {
    return {
      start: { x, y },
      baseAngle: angle,
      length: len,
      growth: 0,
      width,
      gen,
      parentSway: sway,
      pulse: Math.random() * Math.PI * 2,
      children: [],
      packets: []
    };
  }

  growBranch(branch) {
    if (branch.growth < branch.length) {
      branch.growth += this.config.structure.growthSpeed.value;
    } else if (branch.children.length === 0 &&
      branch.gen < this.config.structure.maxGen.value &&
      branch.length > this.config.structure.minLength.value &&
      Math.random() < this.config.branching.branchChance.value) {

      const count = Math.floor(Math.random() *
        (this.config.branching.maxBranches.value - this.config.branching.minBranches.value + 1)) +
        this.config.branching.minBranches.value;

      const spread = this.config.branching.branchSpread.value * (1 + (Math.random() - 0.5) * this.config.branching.randomSpread.value);
      const endX = branch.start.x + Math.cos(branch.angle) * branch.growth;
      const endY = branch.start.y + Math.sin(branch.angle) * branch.growth;

      for (let i = 0; i < count; i++) {
        const spreadOffset = (Math.random() - 0.5) * this.config.branching.randomSpread.value;
        branch.children.push(this.createBranch(
          endX,
          endY,
          branch.baseAngle - spread / 2 + (spread * i / (count - 1)) + spreadOffset,
          branch.length * this.config.structure.lengthDecay.value,
          branch.width * this.config.structure.widthDecay.value,
          branch.gen + 1,
          branch.angle - branch.baseAngle
        ));
      }
    }

    if (Math.random() < this.config.packets.spawnChance.value) {
      branch.packets.push({
        pos: 0,
        speed: this.config.packets.speed.value,
        size: this.config.packets.size.value,
        hueOffset: Math.random() * 60 - 30
      });
    }
    branch.packets = branch.packets.filter(p => (p.pos += p.speed) < 1);
    branch.children.forEach(child => this.growBranch(child));
  }

  drawBranch(branch, time) {
    branch.angle = branch.baseAngle +
      Math.sin(time * this.config.animation.swaySpeed.value) *
      (this.config.animation.swayAmount.value - branch.gen * this.config.animation.swayDecay.value) +
      branch.parentSway;

    const endX = branch.start.x + Math.cos(branch.angle) * branch.growth;
    const endY = branch.start.y + Math.sin(branch.angle) * branch.growth;

    const branchHue = (this.config.colors.branchHue.value + time * this.config.packets.colorCycle.value) % 360;

    this.ctx.beginPath();
    this.ctx.strokeStyle = `hsla(${branchHue}, ${this.config.colors.saturation.value}%, 50%, 
                      ${0.2 + Math.sin(time * this.config.animation.pulseSpeed.value + branch.pulse) * 0.1})`;
    this.ctx.lineWidth = branch.width;
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(branch.start.x, branch.start.y);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    branch.packets.forEach(p => {
      const x = branch.start.x + (endX - branch.start.x) * p.pos;
      const y = branch.start.y + (endY - branch.start.y) * p.pos;
      const packetHue = (this.config.colors.packetHue.value + p.hueOffset + time * this.config.packets.colorCycle.value) % 360;

      this.ctx.beginPath();
      this.ctx.fillStyle = `hsla(${packetHue}, ${this.config.colors.saturation.value}%, 50%, ${1 - p.pos})`;
      this.ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    branch.children.forEach(child => this.drawBranch(child, time));
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.tree = this.createBranch(this.canvas.width / 2, this.canvas.height);
  }

  animate(time) {
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.config.animation.fadeAmount.value})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.growBranch(this.tree);
    this.drawBranch(this.tree, time);
    this.animationFrame = requestAnimationFrame((t) => this.animate(t));
  }

  async init() {
    this.canvas = document.getElementById('treeCanvas');
    this.ctx = this.canvas.getContext('2d');

    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('click', () => this.resize());

    this.resize();
    this.animate(0);
  }

  onConfigUpdate() {
    if (this.tree) this.resize();
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', () => this.resize());
    if (this.canvas) {
      this.canvas.removeEventListener('click', () => this.resize());
    }
  }
}

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(GrowModule);
}