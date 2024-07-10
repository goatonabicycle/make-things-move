(function () {
  const gridContainer = document.getElementById("grid-container");

  const BPM = 190;
  const ANIMATION_DURATION = 60000;
  const beatInterval = (60 / BPM) * 1000;
  const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

  function getRandomDuration(min = 1000, max = 20000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomCharacters(length = 10, customCharacters = null) {
    const characters = customCharacters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  function getRandomChanges(numChanges, interval, shapeStylesFn, customCharacters = null) {
    const changes = [];
    for (let i = 0; i < numChanges; i++) {
      changes.push({
        time: i * interval,
        styles: {
          ...shapeStylesFn(),
          zIndex: Math.floor(Math.random() * 10) + 1,
          transition: "all 0.5s ease-in-out"
        },
        content: getRandomCharacters(10, customCharacters)
      });
    }
    return changes;
  }

  function getRandomOrbitPath() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radiusX = Math.random() * (window.innerWidth / 2) + 1000;
    const radiusY = Math.random() * (window.innerHeight / 2) + 1000;
    const speed = Math.random() * 0.01 + 0.005;

    return { centerX, centerY, radiusX, radiusY, speed };
  }

  function applyInitialState(element, state) {
    for (const [key, value] of Object.entries(state)) {
      element.style[key] = value;
    }
  }

  function applyStyles(element, styles) {
    for (const [key, value] of Object.entries(styles)) {
      element.style[key] = value;
    }
  }

  function getCircleStyles() {
    return {
      width: `${Math.random() * 20 + 5}vh`,
      height: `${Math.random() * 20 + 5}vh`,
      backgroundColor: "#55BBCC",
      borderRadius: "50%",
      position: "absolute",
      transition: "all 1s linear",
      zIndex: Math.floor(Math.random() * 100),
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`
    };
  }

  function createElements(config) {
    config.forEach((item) => {
      const element = document.createElement("div");
      element.id = item.id;
      element.classList.add("centered-text");
      element.innerHTML = `<div>${item.content || ""}</div>`;
      applyInitialState(element, item.initialState);
      gridContainer.appendChild(element);
    });
  }

  function animateOrbit(element, orbit) {
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

  function handleTimeBasedChanges(element, changes, duration, initialState) {
    changes.forEach((change) => {
      setTimeout(() => {
        applyStyles(element, change.styles);
        if (change.content !== undefined) {
          element.innerHTML = `<div>${change.content}</div>`;
        }
      }, change.time);
    });

    setTimeout(() => {
      applyInitialState(element, initialState);
      element.innerHTML = `<div>${initialState.content}</div>`;
      handleTimeBasedChanges(element, changes, duration, initialState);
    }, duration);
  }

  function generateConfig2() {
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: `div${i + 1}`,
        content: getRandomCharacters(10, "GHIJKLM"),
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
          change: getRandomChanges(numChanges, beatInterval, getCircleStyles, "GHIJKLM"),
          orbit: getRandomOrbitPath(),
          duration: ANIMATION_DURATION
        }
      });
    }
    return elements;
  }

  const config = generateConfig2();

  function applyConfigStyles() {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      body {
        background-color: brown;         
      }
    `;
    document.head.appendChild(styleElement);
  }

  function animateElements(config) {
    config.forEach((item) => {
      const element = document.getElementById(item.id);
      if (item.timeline.orbit) {
        animateOrbit(element, item.timeline.orbit);
      }
      if (item.timeline.change) {
        handleTimeBasedChanges(element, item.timeline.change, item.timeline.duration, item.initialState);
      }
    });
  }

  function resetAndRestart() {
    const elements = gridContainer.querySelectorAll(".centered-text");
    elements.forEach((element) => element.remove());
    createElements(config);
    animateElements(config);
    startTime = Date.now();
  }

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000) % 60;
    timerElement.textContent = `Time: ${seconds}s`;
    requestAnimationFrame(updateTimer);
  }

  applyConfigStyles();
  createElements(config);
  animateElements(config);
  let startTime = Date.now();
  updateTimer();
  const maxDuration = Math.max(...config.map((item) => item.timeline.duration));
  setInterval(resetAndRestart, maxDuration);
})();
