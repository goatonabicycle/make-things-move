const BPM = 90;
const ANIMATION_DURATION = 30000; // Total animation duration in milliseconds

const beatInterval = (60 / BPM) * 1000; // Interval in milliseconds
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval); // Number of changes over the entire duration

const randomElementsConfig = generateRandomElements(25, beatInterval);

export const elementsConfig = [...randomElementsConfig];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomDuration() {
  return Math.floor(Math.random() * 20000) + 1000;
}

function getRandomRotation() {
  return Math.random() > 0.5
    ? {
        clockwiseDuration: getRandomDuration(),
        anticlockwiseDuration: getRandomDuration(),
      }
    : null;
}

function getRandomCharacters(length = 10) {
  const characters =
    "----------ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getRandomRetroColor() {
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

function getRandomRetroShapeStyles() {
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

function getRandomChanges(numChanges, interval) {
  const changes = [];
  for (let i = 0; i < numChanges; i++) {
    const multiple = Math.pow(2, Math.floor(Math.random() * 3)); // 1x, 2x, or 4x
    changes.push({
      time: i * interval * multiple,
      styles: {
        ...getRandomRetroShapeStyles(),
        zIndex: Math.floor(Math.random() * 10) + 1,
        transition: "all 0.5s ease-in-out",
      },
      content: getRandomCharacters(),
    });
  }
  return changes;
}

function generateRandomElements(num, interval) {
  const elements = [];
  for (let i = 0; i < num; i++) {
    elements.push({
      id: `div${i + 2}`,
      content: getRandomCharacters(),
      initialState: {
        ...getRandomRetroShapeStyles(),
        position: "absolute",
        transition: "all 0.5s ease-in-out",
        zIndex: 1,
      },
      timeline: {
        rotate: getRandomRotation(),
        change: getRandomChanges(numChanges, interval),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

function getRandomOrbitPath() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radiusX = Math.random() * (window.innerWidth / 2) + 1000;
  const radiusY = Math.random() * (window.innerHeight / 2) + 1000;
  const speed = Math.random() * 0.01 + 0.005;

  return { centerX, centerY, radiusX, radiusY, speed };
}
