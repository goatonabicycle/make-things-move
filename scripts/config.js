import {
  getRandomDuration,
  getRandomCharacters,
  getRandomRetroShapeStyles,
  getRandomChanges,
  getRandomOrbitPath,
} from "./utils.js";

const BPM = 90;
const ANIMATION_DURATION = 30000; // Total animation duration in milliseconds

const beatInterval = (60 / BPM) * 1000; // Interval in milliseconds
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval); // Number of changes over the entire duration

const config1 = generateConfig1(25, beatInterval);
const config2 = generateConfig2(20, beatInterval);

export const elementsConfigs = [config1, config2];

function generateConfig1(num, interval) {
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
        rotate: {
          clockwiseDuration: getRandomDuration(),
          anticlockwiseDuration: getRandomDuration(),
        },
        change: getRandomChanges(numChanges, interval),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

function generateConfig2(num, interval) {
  const elements = [];
  for (let i = 0; i < num; i++) {
    elements.push({
      id: `div${i + 2}`,
      content: getRandomCharacters(),
      initialState: {
        ...getRandomRetroShapeStyles(),
        position: "absolute",
        transition: "all 1s linear",
        zIndex: Math.floor(Math.random() * 100),
      },
      timeline: {
        rotate:
          Math.random() > 0.5
            ? {
                clockwiseDuration: getRandomDuration() / 2,
                anticlockwiseDuration: getRandomDuration() / 2,
              }
            : null,
        change: getRandomChanges(numChanges * 2, interval / 2),
        orbit: Math.random() < 0.8 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION * 2,
      },
    });
  }
  return elements;
}
