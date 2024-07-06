(function () {
  const gridContainer = document.getElementById("grid-container");
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.style.position = "fixed";
  timerElement.style.top = "10px";
  timerElement.style.left = "10px";
  timerElement.style.fontSize = "20px";
  timerElement.style.color = "white";
  document.body.appendChild(timerElement);

  const BPM = 90;
  const ANIMATION_DURATION = 30000;
  const beatInterval = (60 / BPM) * 1000;
  const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

  const colours = ["#FF6699", "#FF9933", "#FFCC33", "#99CC33", "#66CCCC", "#FF6666", "#FFCC99", "#CCCCFF", "#CCFF66", "#FFFF66"];

  function getRandomRetroColor() {
    return colours[Math.floor(Math.random() * colours.length)];
  }

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

  function getShapeStyles(shape, options = {}) {
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

    switch (shape) {
      case "square":
        return {
          ...baseStyles,
          height: `${Math.random() * 20 + 5}vh`,
          width: `${Math.random() * 20 + 5}vw`,
          ...additionalStyles
        };
      case "circle":
        return {
          ...baseStyles,
          height: `${Math.random() * 20 + 5}vh`,
          width: `${Math.random() * 20 + 5}vh`,
          borderRadius: "50%",
          ...additionalStyles
        };
      case "triangle":
        return {
          ...baseStyles,
          height: "0",
          width: "0",
          borderLeft: `${Math.random() * 10 + 5}vw solid transparent`,
          borderRight: `${Math.random() * 10 + 5}vw solid transparent`,
          borderBottom: `${Math.random() * 20 + 10}vh solid ${color}`,
          ...additionalStyles
        };
      default:
        return { ...baseStyles, ...additionalStyles };
    }
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

  function animateRotation(element, clockwiseDuration = 5000, anticlockwiseDuration = 5000) {
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

  function generateConfig1() {
    const elements = [];

    for (let i = 0; i < 3; i++) {
      elements.push({
        id: `triangle${i + 1}`,
        content: getRandomCharacters(10, "ABCDEF"),
        initialState: {
          ...getShapeStyles("triangle", {
            color: i === 2 ? "#FFFFFF" : "#000000",
            additionalStyles: { borderColor: getRandomRetroColor() }
          }),
          position: "absolute",
          transition: "all 0.5s ease-in-out",
          zIndex: 1
        },
        timeline: {
          rotate: {
            clockwiseDuration: getRandomDuration(5000, 10000),
            anticlockwiseDuration: getRandomDuration(5000, 10000)
          },
          change: getRandomChanges(
            numChanges,
            beatInterval,
            () =>
              getShapeStyles("triangle", {
                color: i === 2 ? "#FFFFFF" : getRandomRetroColor(),
                additionalStyles: { borderColor: getRandomRetroColor() }
              }),
            "ABCDEF"
          ),
          orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
          duration: ANIMATION_DURATION
        }
      });
    }

    for (let i = 0; i < 5; i++) {
      elements.push({
        id: `circle${i + 1}`,
        content: getRandomCharacters(10, "ABCDEF"),
        initialState: {
          ...getShapeStyles("circle", {
            color: "#000000",
            additionalStyles: { filter: "blur(2px)", color: "#FFFFFF" }
          }),
          position: "absolute",
          transition: "all 0.5s ease-in-out",
          zIndex: 1
        },
        timeline: {
          rotate: {
            clockwiseDuration: getRandomDuration(5000, 10000),
            anticlockwiseDuration: getRandomDuration(5000, 10000)
          },
          change: getRandomChanges(
            numChanges,
            beatInterval,
            () =>
              getShapeStyles("circle", {
                color: "#000000",
                additionalStyles: { filter: "blur(2px)", color: "#FFFFFF" }
              }),
            "ABCDEF"
          ),
          orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
          duration: ANIMATION_DURATION
        }
      });
    }

    for (let i = 0; i < 20; i++) {
      const color = i < 7 ? "#FF0000" : i < 14 ? "#0000FF" : getRandomRetroColor();
      const borderColor = i % 2 === 0 ? "#FFFFFF" : "#000000";
      elements.push({
        id: `square${i + 1}`,
        content: getRandomCharacters(10, "ABCDEF"),
        initialState: {
          ...getShapeStyles("square", {
            color,
            borderColor,
            additionalStyles: { boxShadow: `0 0 10px ${color}` }
          }),
          position: "absolute",
          transition: "all 0.5s ease-in-out",
          zIndex: 1
        },
        timeline: {
          rotate: {
            clockwiseDuration: getRandomDuration(5000, 10000),
            anticlockwiseDuration: getRandomDuration(5000, 10000)
          },
          change: getRandomChanges(
            numChanges,
            beatInterval,
            () =>
              getShapeStyles("square", {
                color: getRandomRetroColor(),
                borderColor,
                additionalStyles: {
                  boxShadow: `0 0 10px ${getRandomRetroColor()}`
                }
              }),
            "ABCDEF"
          ),
          orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
          duration: ANIMATION_DURATION
        }
      });
    }

    return elements;
  }

  const config = generateConfig1();

  function animateElements(config) {
    config.forEach((item) => {
      const element = document.getElementById(item.id);
      if (item.timeline.rotate) {
        const { clockwiseDuration, anticlockwiseDuration } = item.timeline.rotate;
        animateRotation(element, clockwiseDuration, anticlockwiseDuration);
      }
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

  createElements(config);
  animateElements(config);
  let startTime = Date.now();
  updateTimer();
  const maxDuration = Math.max(...config.map((item) => item.timeline.duration));
  setInterval(resetAndRestart, maxDuration);
})();
