// scripts/config.js

const BPM = 220; // Change this value to your desired BPM
const ANIMATION_DURATION = 30000; // Total animation duration in milliseconds

const beatInterval = (60 / BPM) * 1000; // Interval in milliseconds
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval); // Number of changes over the entire duration

const randomElementsConfig = generateRandomElements(10, beatInterval);

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
  return Math.floor(Math.random() * 3000) + 1000; // Between 1 and 4 seconds
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
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getRandomShapeStyles() {
  const shapes = [
    {
      height: "10vh",
      width: "10vw",
      backgroundColor: getRandomColor(),
      borderRadius: "0%",
    },
    {
      height: "10vh",
      width: "10vh",
      backgroundColor: getRandomColor(),
      borderRadius: "50%",
    },
    {
      height: "0",
      width: "0",
      borderLeft: "5vw solid transparent",
      borderRight: "5vw solid transparent",
      borderBottom: `10vh solid transparent`,
    },
    {
      height: "10vh",
      width: "5vw",
      backgroundColor: getRandomColor(),
    },
    {
      height: "10vh",
      width: "15vw",
      backgroundColor: getRandomColor(),
      borderRadius: "50%",
    },
  ];

  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    ...shape,
    top: `${Math.random() * 90}vh`,
    left: `${Math.random() * 90}vw`,
    opacity: Math.random(),
    transform: `scale(${Math.random() * 1.5 + 0.5}) skew(${
      Math.random() * 20 - 10
    }deg, ${Math.random() * 20 - 10}deg)`,
    filter: `blur(${Math.random() * 3}px)`,
  };
}

function getRandomChanges(numChanges, interval) {
  const changes = [];
  for (let i = 0; i < numChanges; i++) {
    const multiple = Math.pow(2, Math.floor(Math.random() * 3)); // 1x, 2x, or 4x
    changes.push({
      time: i * interval * multiple,
      styles: {
        ...getRandomShapeStyles(),
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
        ...getRandomShapeStyles(),
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
  const radiusX = Math.random() * (window.innerWidth / 2) + 150;
  const radiusY = Math.random() * (window.innerHeight / 2) + 150;
  const speed = Math.random() * 0.01 + 0.005;

  return { centerX, centerY, radiusX, radiusY, speed };
}
