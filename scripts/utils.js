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

export function getRandomDuration(min = 1000, max = 20000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomCharacters(length = 10, customCharacters = null) {
  const characters =
    customCharacters ||
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomChanges(
  numChanges,
  interval,
  shapeStylesFn,
  customCharacters = null
) {
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
      content: getRandomCharacters(10, customCharacters),
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

export function getShapeStyles(shape, options = {}) {
  const { color, borderColor, additionalStyles } = options;

  const baseStyles = {
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
    opacity: Math.random(),
    transform: `scale(${Math.random() * 2}) skew(${
      Math.random() * 60 - 30
    }deg, ${Math.random() * 60 - 30}deg)`,
    filter: `blur(${Math.random() * 4}px)`,
    mixBlendMode: "screen",
    boxShadow: `0 0 ${Math.random() * 20}px ${color}`,
    backgroundColor: color,
    borderColor: borderColor,
    borderStyle: "solid",
    animation: `move ${Math.random() * 10 + 5}s infinite alternate`,
  };

  switch (shape) {
    case "square":
      return {
        ...baseStyles,
        height: `${Math.random() * 20 + 5}vh`,
        width: `${Math.random() * 20 + 5}vw`,
        ...additionalStyles,
      };
    case "circle":
      return {
        ...baseStyles,
        height: `${Math.random() * 20 + 5}vh`,
        width: `${Math.random() * 20 + 5}vh`,
        borderRadius: "50%",
        ...additionalStyles,
      };
    case "triangle":
      return {
        ...baseStyles,
        height: "0",
        width: "0",
        borderLeft: `${Math.random() * 10 + 5}vw solid transparent`,
        borderRight: `${Math.random() * 10 + 5}vw solid transparent`,
        borderBottom: `${Math.random() * 20 + 10}vh solid ${color}`,
        ...additionalStyles,
      };
    case "ellipse":
      return {
        ...baseStyles,
        height: `${Math.random() * 20 + 5}vh`,
        width: `${Math.random() * 30 + 10}vw`,
        borderRadius: "50%",
        ...additionalStyles,
      };
    case "pentagon":
      return {
        ...baseStyles,
        height: `${Math.random() * 20 + 5}vh`,
        width: `${Math.random() * 20 + 5}vh`,
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        ...additionalStyles,
      };
    case "hexagon":
      return {
        ...baseStyles,
        height: `${Math.random() * 20 + 5}vh`,
        width: `${Math.random() * 20 + 5}vh`,
        clipPath:
          "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        ...additionalStyles,
      };
    default:
      return { ...baseStyles, ...additionalStyles };
  }
}

export function createSpecificShape(shape, options) {
  return getShapeStyles(shape, options);
}

export function createRandomShape(options) {
  const shapes = [
    "square",
    "circle",
    "triangle",
    "ellipse",
    "pentagon",
    "hexagon",
  ];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return getShapeStyles(shape, options);
}
