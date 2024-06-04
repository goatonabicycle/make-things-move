import {
  getRandomCharacters,
  getRandomChanges,
  getRandomOrbitPath,
  getRandomDuration,
  createSpecificShape,
  createRandomShape,
} from "../utils.js";

const BPM = 90;
const ANIMATION_DURATION = 30000;
const beatInterval = (60 / BPM) * 1000;
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

const colours = [
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
  return colours[Math.floor(Math.random() * colours.length)];
}

const config1 = generateConfig1(30, beatInterval);

function generateConfig1(num, interval) {
  const elements = [];

  for (let i = 0; i < 3; i++) {
    elements.push({
      id: `triangle${i + 1}`,
      content: getRandomCharacters(10, "ABCDEF"),
      initialState: {
        ...createSpecificShape("triangle", {
          color: i === 2 ? "#FFFFFF" : "#000000",
          additionalStyles: { borderColor: getRandomRetroColor() },
        }),
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
          () =>
            createSpecificShape("triangle", {
              color: i === 2 ? "#FFFFFF" : getRandomRetroColor(),
              additionalStyles: { borderColor: getRandomRetroColor() },
            }),
          "ABCDEF"
        ),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    elements.push({
      id: `circle${i + 1}`,
      content: getRandomCharacters(10, "ABCDEF"),
      initialState: {
        ...createSpecificShape("circle", {
          color: "#000000",
          additionalStyles: { filter: "blur(2px)", color: "#FFFFFF" },
        }),
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
          () =>
            createSpecificShape("circle", {
              color: "#000000",
              additionalStyles: { filter: "blur(2px)", color: "#FFFFFF" },
            }),
          "ABCDEF"
        ),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }

  for (let i = 0; i < 20; i++) {
    const color =
      i < 7 ? "#FF0000" : i < 14 ? "#0000FF" : getRandomRetroColor();
    const borderColor = i % 2 === 0 ? "#FFFFFF" : "#000000";
    elements.push({
      id: `square${i + 1}`,
      content: getRandomCharacters(10, "ABCDEF"),
      initialState: {
        ...createSpecificShape("square", {
          color,
          borderColor,
          additionalStyles: { boxShadow: `0 0 10px ${color}` },
        }),
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
          () =>
            createSpecificShape("square", {
              color: getRandomRetroColor(),
              borderColor,
              additionalStyles: {
                boxShadow: `0 0 10px ${getRandomRetroColor()}`,
              },
            }),
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
