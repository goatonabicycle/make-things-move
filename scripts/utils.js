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
