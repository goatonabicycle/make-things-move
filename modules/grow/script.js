const config = {
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

let panel;
let tree;
let canvas;
let ctx;
let animationFrame;

function createBranch(x, y, angle = -Math.PI / 2, len = canvas.height * config.structure.lengthRatio.value,
  width = config.structure.branchWidth.value, gen = 0, sway = 0) {
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

function growBranch(branch) {
  if (branch.growth < branch.length) {
    branch.growth += config.structure.growthSpeed.value;
  } else if (branch.children.length === 0 &&
    branch.gen < config.structure.maxGen.value &&
    branch.length > config.structure.minLength.value &&
    Math.random() < config.branching.branchChance.value) {

    const count = Math.floor(Math.random() *
      (config.branching.maxBranches.value - config.branching.minBranches.value + 1)) +
      config.branching.minBranches.value;

    const spread = config.branching.branchSpread.value * (1 + (Math.random() - 0.5) * config.branching.randomSpread.value);
    const endX = branch.start.x + Math.cos(branch.angle) * branch.growth;
    const endY = branch.start.y + Math.sin(branch.angle) * branch.growth;

    for (let i = 0; i < count; i++) {
      const spreadOffset = (Math.random() - 0.5) * config.branching.randomSpread.value;
      branch.children.push(createBranch(
        endX,
        endY,
        branch.baseAngle - spread / 2 + (spread * i / (count - 1)) + spreadOffset,
        branch.length * config.structure.lengthDecay.value,
        branch.width * config.structure.widthDecay.value,
        branch.gen + 1,
        branch.angle - branch.baseAngle
      ));
    }
  }

  if (Math.random() < config.packets.spawnChance.value) {
    branch.packets.push({
      pos: 0,
      speed: config.packets.speed.value,
      size: config.packets.size.value,
      hueOffset: Math.random() * 60 - 30
    });
  }
  branch.packets = branch.packets.filter(p => (p.pos += p.speed) < 1);
  branch.children.forEach(growBranch);
}

function drawBranch(branch, time) {
  branch.angle = branch.baseAngle +
    Math.sin(time * config.animation.swaySpeed.value) *
    (config.animation.swayAmount.value - branch.gen * config.animation.swayDecay.value) +
    branch.parentSway;

  const endX = branch.start.x + Math.cos(branch.angle) * branch.growth;
  const endY = branch.start.y + Math.sin(branch.angle) * branch.growth;

  const branchHue = (config.colors.branchHue.value + time * config.packets.colorCycle.value) % 360;

  ctx.beginPath();
  ctx.strokeStyle = `hsla(${branchHue}, ${config.colors.saturation.value}%, 50%, 
                    ${0.2 + Math.sin(time * config.animation.pulseSpeed.value + branch.pulse) * 0.1})`;
  ctx.lineWidth = branch.width;
  ctx.lineCap = 'round';
  ctx.moveTo(branch.start.x, branch.start.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  branch.packets.forEach(p => {
    const x = branch.start.x + (endX - branch.start.x) * p.pos;
    const y = branch.start.y + (endY - branch.start.y) * p.pos;
    const packetHue = (config.colors.packetHue.value + p.hueOffset + time * config.packets.colorCycle.value) % 360;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${packetHue}, ${config.colors.saturation.value}%, 50%, ${1 - p.pos})`;
    ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
    ctx.fill();
  });

  branch.children.forEach(child => drawBranch(child, time));
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  tree = createBranch(canvas.width / 2, canvas.height);
}

function animate(time) {
  ctx.fillStyle = `rgba(0, 0, 0, ${config.animation.fadeAmount.value})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  growBranch(tree);
  drawBranch(tree, time);
  animationFrame = requestAnimationFrame(animate);
}

function init() {
  canvas = document.getElementById('treeCanvas');
  ctx = canvas.getContext('2d');

  panel = new ConfigPanel(config, () => {
    if (tree) resize();
  });

  window.addEventListener('resize', resize);
  canvas.addEventListener('click', resize);

  resize();
  animate(0);
}

function cleanup() {
  if (panel) {
    panel.destroy();
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  window.removeEventListener('resize', resize);
  if (canvas) {
    canvas.removeEventListener('click', resize);
  }
}

init();
window.addEventListener('beforeunload', cleanup);