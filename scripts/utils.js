export function applyInitialState(element, state) {
  for (const [key, value] of Object.entries(state)) {
    element.style[key] = value;
  }
}

export function applyStyles(element, styles) {
  for (const [key, value] of Object.entries(styles)) {
    element.style[key] = value;
  }
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getRandomDuration() {
  return Math.floor(Math.random() * 20000) + 1000;
}

export function getRandomCharacters(length = 10) {
  const characters =
    "----------ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomRetroColor() {
  const retroColors = [
    "#FF6699",
    "#FF9933",
    "#FFCC33",
    "#99CC33",
    "#66CCCC",
    "#FF6666",
    "#FFCC99",
    "#CCCCFF",
    "#CCFF66",
    "#FFFF66",
  ];
  return retroColors[Math.floor(Math.random() * retroColors.length)];
}

export function getRandomRetroShapeStyles() {
  const shapes = [
    {
      height: `${Math.random() * 20 + 5}vh`,
      width: `${Math.random() * 20 + 5}vw`,
      backgroundColor: getRandomRetroColor(),
      borderRadius: `${Math.random() * 50}%`,
    },
    {
      height: `${Math.random() * 20 + 5}vh`,
      width: `${Math.random() * 20 + 5}vh`,
      backgroundColor: getRandomRetroColor(),
      borderRadius: "50%",
    },
    {
      height: "0",
      width: "0",
      borderLeft: `${Math.random() * 10 + 5}vw solid transparent`,
      borderRight: `${Math.random() * 10 + 5}vw solid transparent`,
    },
    {
      height: `${Math.random() * 20 + 5}vh`,
      width: `${Math.random() * 10 + 5}vw`,
      backgroundColor: getRandomRetroColor(),
    },
    {
      height: `${Math.random() * 20 + 5}vh`,
      width: `${Math.random() * 30 + 10}vw`,
      backgroundColor: getRandomRetroColor(),
      borderRadius: "50%",
    },
  ];

  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    ...shape,
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
    opacity: Math.random(),
    transform: `scale(${Math.random() * 2}) skew(${
      Math.random() * 60 - 30
    }deg, ${Math.random() * 30 - 30}deg)`,
    filter: `blur(${Math.random() * 1}px)`,
  };
}

export function getRandomChanges(numChanges, interval, shapeStylesFn) {
  const changes = [];
  for (let i = 0; i < numChanges; i++) {
    const multiple = Math.pow(2, Math.floor(Math.random() * 3)); // 1x, 2x, or 4x
    changes.push({
      time: i * interval * multiple,
      styles: {
        ...shapeStylesFn(),
        zIndex: Math.floor(Math.random() * 10) + 1,
        transition: "all 0.5s ease-in-out",
      },
      content: getRandomCharacters(),
    });
  }
  return changes;
}

export function getRandomOrbitPath() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radiusX = Math.random() * (window.innerWidth / 2) + 1000;
  const radiusY = Math.random() * (window.innerHeight / 2) + 1000;
  const speed = Math.random() * 0.01 + 0.005;

  return { centerX, centerY, radiusX, radiusY, speed };
}

export function createElements(config) {
  config.forEach((item) => {
    const element = document.createElement("div");
    element.id = item.id;
    element.classList.add("centered-text");
    element.innerHTML = `<div>${item.content || ""}</div>`;
    applyInitialState(element, item.initialState);
    document.body.appendChild(element);
  });
}
