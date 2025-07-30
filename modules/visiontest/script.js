import { ModuleManager } from '../../moduleManager.js';

class VisionTestModule {
  constructor() {
    this.gridContainer = null;
    this.timerElement = null;
    this.timerRunning = false;
    this.timerAnimationId = null;
    this.startTime = 0;
    this.resetInterval = null;

    this.config = {
      animation: {
        bpm: { value: 90, min: 60, max: 180, step: 5, label: 'BPM' },
        duration: { value: 30, min: 10, max: 60, step: 5, label: 'Duration (s)' }
      },
      shapes: {
        triangles: { value: 3, min: 1, max: 10, step: 1, label: 'Triangles' },
        circles: { value: 5, min: 1, max: 15, step: 1, label: 'Circles' },
        squares: { value: 20, min: 5, max: 50, step: 5, label: 'Squares' }
      }
    };

    this.colours = ["#FF6699", "#FF9933", "#FFCC33", "#99CC33", "#66CCCC", "#FF6666", "#FFCC99", "#CCCCFF", "#CCFF66", "#FFFF66"];
    this.elements = [];
  }

  getRandomRetroColor() {
    return this.colours[Math.floor(Math.random() * this.colours.length)];
  }

  getRandomDuration(min = 1000, max = 20000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomCharacters(length = 10, customCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += customCharacters.charAt(Math.floor(Math.random() * customCharacters.length));
    }
    return result;
  }

  getRandomChanges(numChanges, interval, shapeStylesFn, customCharacters = null) {
    const changes = [];
    for (let i = 0; i < numChanges; i++) {
      changes.push({
        time: i * interval,
        styles: {
          ...shapeStylesFn(),
          zIndex: Math.floor(Math.random() * 10) + 1,
          transition: "all 0.5s ease-in-out"
        },
        content: this.getRandomCharacters(10, customCharacters)
      });
    }
    return changes;
  }

  getRandomOrbitPath() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radiusX = Math.random() * (window.innerWidth / 2) + 1000;
    const radiusY = Math.random() * (window.innerHeight / 2) + 1000;
    const speed = Math.random() * 0.01 + 0.005;
    return { centerX, centerY, radiusX, radiusY, speed };
  }

  applyInitialState(element, state) {
    Object.entries(state).forEach(([key, value]) => (element.style[key] = value));
  }

  applyStyles(element, styles) {
    Object.entries(styles).forEach(([key, value]) => (element.style[key] = value));
  }

  getShapeStyles(shape, options = {}) {
    const { color, borderColor, additionalStyles } = options;
    const baseStyles = {
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      opacity: Math.random(),
      transform: `scale(${Math.random() * 2}) skew(${Math.random() * 60 - 30}deg, ${Math.random() * 60 - 30}deg)`,
      filter: `blur(${Math.random() * 4}px)`,
      mixBlendMode: "screen",
      boxShadow: `0 0 ${Math.random() * 20}px ${color}`,
      backgroundColor: color,
      borderColor: borderColor,
      borderStyle: "solid",
      animation: `move ${Math.random() * 10 + 5}s infinite alternate`
    };

    const shapeSpecificStyles = {
      square: { height: `${Math.random() * 20 + 5}vh`, width: `${Math.random() * 20 + 5}vw` },
      circle: { height: `${Math.random() * 20 + 5}vh`, width: `${Math.random() * 20 + 5}vh`, borderRadius: "50%" },
      triangle: {
        height: "0",
        width: "0",
        borderLeft: `${Math.random() * 10 + 5}vw solid transparent`,
        borderRight: `${Math.random() * 10 + 5}vw solid transparent`,
        borderBottom: `${Math.random() * 20 + 10}vh solid ${color}`
      }
    };

    return { ...baseStyles, ...shapeSpecificStyles[shape], ...additionalStyles };
  }

  createElements(config) {
    config.forEach((item) => {
      const element = document.createElement("div");
      element.id = item.id;
      element.classList.add("centered-text");
      element.innerHTML = `<div>${item.content || ""}</div>`;
      this.applyInitialState(element, item.initialState);
      this.gridContainer.appendChild(element);
    });
  }

  animateRotation(element, clockwiseDuration = 5000, anticlockwiseDuration = 5000) {
    if (!clockwiseDuration || !anticlockwiseDuration) return;
    let rotationStartTime = Date.now();
    let clockwise = true;

    const animate = () => {
      const elapsed = Date.now() - rotationStartTime;
      const duration = clockwise ? clockwiseDuration : anticlockwiseDuration;
      const progress = (elapsed % duration) / duration;
      const angle = progress * 360 * (clockwise ? 1 : -1);
      element.style.transform = `rotate(${angle}deg)`;

      if (elapsed >= duration) {
        rotationStartTime = Date.now();
        clockwise = !clockwise;
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

  animateOrbit(element, orbit) {
    const { centerX, centerY, radiusX, radiusY, speed } = orbit;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const angle = elapsed * speed;
      const x = centerX + radiusX * Math.cos(angle) - element.offsetWidth / 2;
      const y = centerY + radiusY * Math.sin(angle) - element.offsetHeight / 2;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  handleTimeBasedChanges(element, changes, duration, initialState) {
    changes.forEach((change) => {
      setTimeout(() => {
        this.applyStyles(element, change.styles);
        if (change.content !== undefined) {
          element.innerHTML = `<div>${change.content}</div>`;
        }
      }, change.time);
    });

    setTimeout(() => {
      this.applyInitialState(element, initialState);
      element.innerHTML = `<div>${initialState.content}</div>`;
      this.handleTimeBasedChanges(element, changes, duration, initialState);
    }, duration);
  }

  generateConfig() {
    const BPM = this.config.animation.bpm.value;
    const ANIMATION_DURATION = this.config.animation.duration.value * 1000;
    const beatInterval = (60 / BPM) * 1000;
    const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);
    const elements = [];

    // Triangles
    for (let i = 0; i < this.config.shapes.triangles.value; i++) {
      elements.push({
        id: `triangle${i + 1}`,
        content: this.getRandomCharacters(10, "ABCDEF"),
        initialState: {
          ...this.getShapeStyles("triangle", { color: i === 2 ? "#FFFFFF" : "#000000", additionalStyles: { borderColor: this.getRandomRetroColor() } }),
          position: "absolute",
          transition: "all 0.5s ease-in-out",
          zIndex: 1
        },
        timeline: {
          rotate: { clockwiseDuration: this.getRandomDuration(5000, 10000), anticlockwiseDuration: this.getRandomDuration(5000, 10000) },
          change: this.getRandomChanges(
            numChanges,
            beatInterval,
            () => this.getShapeStyles("triangle", { color: i === 2 ? "#FFFFFF" : this.getRandomRetroColor(), additionalStyles: { borderColor: this.getRandomRetroColor() } }),
            "ABCDEF"
          ),
          orbit: Math.random() < 0.5 ? this.getRandomOrbitPath() : undefined,
          duration: ANIMATION_DURATION
        }
      });
    }

    // Circles
    for (let i = 0; i < this.config.shapes.circles.value; i++) {
      elements.push({
        id: `circle${i + 1}`,
        content: this.getRandomCharacters(10, "ABCDEF"),
        initialState: {
          ...this.getShapeStyles("circle", { color: "#000000", additionalStyles: { filter: "blur(2px)", color: "#FFFFFF" } }),
          position: "absolute",
          transition: "all 0.5s ease-in-out",
          zIndex: 1
        },
        timeline: {
          rotate: { clockwiseDuration: this.getRandomDuration(5000, 10000), anticlockwiseDuration: this.getRandomDuration(5000, 10000) },
          change: this.getRandomChanges(
            numChanges,
            beatInterval,
            () => this.getShapeStyles("circle", { color: "#000000", additionalStyles: { filter: "blur(2px)", color: "#FFFFFF" } }),
            "ABCDEF"
          ),
          orbit: Math.random() < 0.5 ? this.getRandomOrbitPath() : undefined,
          duration: ANIMATION_DURATION
        }
      });
    }

    // Squares
    for (let i = 0; i < this.config.shapes.squares.value; i++) {
      const color = i < 7 ? "#FF0000" : i < 14 ? "#0000FF" : this.getRandomRetroColor();
      const borderColor = i % 2 === 0 ? "#FFFFFF" : "#000000";
      elements.push({
        id: `square${i + 1}`,
        content: this.getRandomCharacters(10, "ABCDEF"),
        initialState: {
          ...this.getShapeStyles("square", { color, borderColor, additionalStyles: { boxShadow: `0 0 10px ${color}` } }),
          position: "absolute",
          transition: "all 0.5s ease-in-out",
          zIndex: 1
        },
        timeline: {
          rotate: { clockwiseDuration: this.getRandomDuration(5000, 10000), anticlockwiseDuration: this.getRandomDuration(5000, 10000) },
          change: this.getRandomChanges(
            numChanges,
            beatInterval,
            () => this.getShapeStyles("square", { color: this.getRandomRetroColor(), borderColor, additionalStyles: { boxShadow: `0 0 10px ${this.getRandomRetroColor()}` } }),
            "ABCDEF"
          ),
          orbit: Math.random() < 0.5 ? this.getRandomOrbitPath() : undefined,
          duration: ANIMATION_DURATION
        }
      });
    }

    return elements;
  }

  animateElements(config) {
    config.forEach((item) => {
      const element = document.getElementById(item.id);
      if (item.timeline.rotate) {
        const { clockwiseDuration, anticlockwiseDuration } = item.timeline.rotate;
        this.animateRotation(element, clockwiseDuration, anticlockwiseDuration);
      }
      if (item.timeline.orbit) {
        this.animateOrbit(element, item.timeline.orbit);
      }
      if (item.timeline.change) {
        this.handleTimeBasedChanges(element, item.timeline.change, item.timeline.duration, item.initialState);
      }
    });
  }

  resetAndRestart() {
    const elements = this.gridContainer.querySelectorAll(".centered-text");
    elements.forEach((element) => element.remove());
    this.elements = this.generateConfig();
    this.createElements(this.elements);
    this.animateElements(this.elements);
    this.startTime = Date.now();
  }

  updateTimer() {
    if (!this.timerRunning) return;
    const elapsed = Date.now() - this.startTime;
    const seconds = Math.floor(elapsed / 1000) % 60;
    this.timerElement.textContent = `Time: ${seconds}s`;
    this.timerAnimationId = requestAnimationFrame(() => this.updateTimer());
  }

  init() {
    this.gridContainer = document.getElementById("moduleContainer");
    
    this.timerElement = document.createElement("div");
    this.timerElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      color: white;
      font-size: 18px;
      z-index: 1000;
      background: rgba(0,0,0,0.5);
      padding: 10px;
      border-radius: 5px;
    `;
    this.timerElement.textContent = "Time: 0s";
    document.body.appendChild(this.timerElement);

    this.elements = this.generateConfig();
    this.createElements(this.elements);
    this.animateElements(this.elements);
    this.startTime = Date.now();
    this.timerRunning = true;
    this.updateTimer();
    
    const maxDuration = Math.max(...this.elements.map((item) => item.timeline.duration));
    this.resetInterval = setInterval(() => this.resetAndRestart(), maxDuration);
  }

  onConfigUpdate() {
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
    }

    const elements = this.gridContainer.querySelectorAll(".centered-text");
    elements.forEach((element) => element.remove());

    this.elements = this.generateConfig();
    this.createElements(this.elements);
    this.animateElements(this.elements);
    this.startTime = Date.now();

    const maxDuration = Math.max(...this.elements.map((item) => item.timeline.duration));
    this.resetInterval = setInterval(() => this.resetAndRestart(), maxDuration);
  }

  cleanup() {
    this.timerRunning = false;
    if (this.timerAnimationId) {
      cancelAnimationFrame(this.timerAnimationId);
    }
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
    }
    if (this.timerElement && this.timerElement.parentNode) {
      this.timerElement.remove();
    }
    if (this.gridContainer) {
      this.gridContainer.innerHTML = '';
    }
  }
}

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(VisionTestModule);
}