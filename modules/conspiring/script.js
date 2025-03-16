(async function () {
  class ConspiringModule {
    constructor() {
      this.container = null;
      this.elements = [];
      this.startTime = Date.now();
      this.timerElement = null;
      this.resetInterval = null;

      this.config = {
        animation: {
          bpm: { value: 190, min: 60, max: 300, step: 5, label: 'BPM' },
          duration: { value: 60, min: 10, max: 120, step: 5, label: 'Duration (s)' }
        },
        elements: {
          count: { value: 20, min: 5, max: 50, step: 1, label: 'Element Count' },
          minSize: { value: 5, min: 1, max: 20, step: 1, label: 'Min Size (vh)' },
          maxSize: { value: 25, min: 5, max: 50, step: 1, label: 'Max Size (vh)' }
        },
        appearance: {
          useCustomChars: { value: 1, min: 0, max: 1, step: 1, label: 'Custom Chars' },
          backgroundColor: { value: 1, min: 0, max: 3, step: 1, label: 'BG Color' }
        },
        orbit: {
          radiusMultiplier: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Radius Multiplier' },
          speedMultiplier: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Speed Multiplier' }
        }
      };
    }

    getRandomDuration(min = 1000, max = 20000) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomCharacters(length = 10, customCharacters = null) {
      const characters = customCharacters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
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
      const radiusMultiplier = this.config.orbit.radiusMultiplier.value;
      const speedMultiplier = this.config.orbit.speedMultiplier.value;

      const radiusX = Math.random() * (window.innerWidth / 2) * radiusMultiplier + 1000;
      const radiusY = Math.random() * (window.innerHeight / 2) * radiusMultiplier + 1000;
      const speed = (Math.random() * 0.01 + 0.005) * speedMultiplier;

      return { centerX, centerY, radiusX, radiusY, speed };
    }

    applyInitialState(element, state) {
      for (const [key, value] of Object.entries(state)) {
        element.style[key] = value;
      }
    }

    applyStyles(element, styles) {
      for (const [key, value] of Object.entries(styles)) {
        element.style[key] = value;
      }
    }

    getCircleStyles() {
      const minSize = this.config.elements.minSize.value;
      const maxSize = this.config.elements.maxSize.value;
      const size = Math.random() * (maxSize - minSize) + minSize;

      return {
        width: `${size}vh`,
        height: `${size}vh`,
        backgroundColor: "#55BBCC",
        borderRadius: "50%",
        position: "absolute",
        transition: "all 1s linear",
        zIndex: Math.floor(Math.random() * 100),
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`
      };
    }

    createElements() {
      this.elements.forEach((item) => {
        const element = document.createElement("div");
        element.id = item.id;
        element.classList.add("centered-text");
        element.innerHTML = `<div>${item.content || ""}</div>`;
        this.applyInitialState(element, item.initialState);
        this.container.appendChild(element);
      });
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
      const elementCount = this.config.elements.count.value;
      const bpm = this.config.animation.bpm.value;
      const durationSec = this.config.animation.duration.value;
      const animationDuration = durationSec * 1000;
      const beatInterval = (60 / bpm) * 1000;
      const numChanges = Math.ceil(animationDuration / beatInterval);
      const useCustomChars = this.config.appearance.useCustomChars.value;

      this.elements = [];

      for (let i = 0; i < elementCount; i++) {
        this.elements.push({
          id: `div${i + 1}`,
          content: this.getRandomCharacters(10, useCustomChars ? "GHIJKLM" : null),
          initialState: {
            width: `${Math.random() * 20 + 5}vh`,
            height: `${Math.random() * 20 + 5}vh`,
            backgroundColor: "#77CCCC",
            borderRadius: "50%",
            position: "absolute",
            transition: "all 1s linear",
            zIndex: Math.floor(Math.random() * 100),
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`
          },
          timeline: {
            change: this.getRandomChanges(
              numChanges,
              beatInterval,
              () => this.getCircleStyles(),
              useCustomChars ? "GHIJKLM" : null
            ),
            orbit: this.getRandomOrbitPath(),
            duration: animationDuration
          }
        });
      }

      return this.elements;
    }

    applyConfigStyles() {
      const bgColors = ["brown", "#1a1a1a", "#003366", "#660033"];
      const bgColor = bgColors[this.config.appearance.backgroundColor.value];

      const styleElement = document.createElement("style");
      styleElement.innerHTML = `
        body {
          background-color: ${bgColor};         
        }
      `;
      document.head.appendChild(styleElement);
    }

    animateElements() {
      this.elements.forEach((item) => {
        const element = document.getElementById(item.id);
        if (item.timeline.orbit) {
          this.animateOrbit(element, item.timeline.orbit);
        }
        if (item.timeline.change) {
          this.handleTimeBasedChanges(element, item.timeline.change, item.timeline.duration, item.initialState);
        }
      });
    }

    resetAndRestart() {
      const elements = this.container.querySelectorAll(".centered-text");
      elements.forEach((element) => element.remove());
      this.createElements();
      this.animateElements();
      this.startTime = Date.now();
    }

    updateTimer() {
      const elapsed = Date.now() - this.startTime;
      const seconds = Math.floor(elapsed / 1000) % 60;
      if (this.timerElement) {
        this.timerElement.textContent = `Time: ${seconds}s`;
      }
      requestAnimationFrame(this.updateTimer.bind(this));
    }

    init() {
      this.container = document.getElementById("grid-container");
      if (!this.container) {
        console.error("Container not found!");
        return;
      }

      this.timerElement = document.createElement("div");
      this.timerElement.style.position = "fixed";
      this.timerElement.style.bottom = "10px";
      this.timerElement.style.left = "10px";
      this.timerElement.style.color = "white";
      this.timerElement.style.zIndex = "1000";
      document.body.appendChild(this.timerElement);

      this.applyConfigStyles();
      this.generateConfig();
      this.createElements();
      this.animateElements();
      this.startTime = Date.now();
      this.updateTimer();

      const maxDuration = Math.max(...this.elements.map((item) => item.timeline.duration));
      this.resetInterval = setInterval(this.resetAndRestart.bind(this), maxDuration);
    }

    onConfigUpdate() {
      if (this.resetInterval) {
        clearInterval(this.resetInterval);
      }

      const elements = this.container.querySelectorAll(".centered-text");
      elements.forEach((element) => element.remove());

      this.applyConfigStyles();
      this.generateConfig();
      this.createElements();
      this.animateElements();
      this.startTime = Date.now();

      const maxDuration = Math.max(...this.elements.map((item) => item.timeline.duration));
      this.resetInterval = setInterval(this.resetAndRestart.bind(this), maxDuration);
    }

    cleanup() {
      if (this.resetInterval) {
        clearInterval(this.resetInterval);
        this.resetInterval = null;
      }

      if (this.timerElement) {
        this.timerElement.remove();
        this.timerElement = null;
      }

      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }

  const moduleManager = new ModuleManager();
  await moduleManager.init(ConspiringModule);
})();