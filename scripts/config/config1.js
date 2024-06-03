import {
  getRandomCharacters,
  getRandomChanges,
  getRandomOrbitPath,
  getRandomDuration,
} from "../utils.js";

const BPM = 90;
const ANIMATION_DURATION = 30000;

const beatInterval = (60 / BPM) * 1000;
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

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

function getRandomRetroColor() {
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
    filter: `blur(${Math.random() * 4}px)`,
  };
}

const config1 = generateConfig1(25, beatInterval);

function generateConfig1(num, interval) {
  const elements = [];
  for (let i = 0; i < num; i++) {
    elements.push({
      id: `div${i + 2}`,
      content: getRandomCharacters(10, "ABCDEF"),
      initialState: {
        ...getRandomRetroShapeStyles(),
        position: "absolute",
        transition: "all 0.5s ease-in-out",
        zIndex: 1,
      },
      timeline: {
        rotate: {
          clockwiseDuration: getRandomDuration(5000, 10000),
          anticlockwiseDuration: getRandomDuration(5000, 10000),
        },
        change: getRandomChanges(
          numChanges,
          interval,
          getRandomRetroShapeStyles,
          "ABCDEF"
        ),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

export default {
  name: "Vision test",
  config: config1,
  styles: `
    body {
      background-color: #000;     
    }       
  `,
};
