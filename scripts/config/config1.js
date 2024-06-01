import {
  getRandomCharacters,
  getRandomRetroShapeStyles,
  getRandomChanges,
  getRandomOrbitPath,
  getRandomDuration,
} from "../utils.js";

const BPM = 90;
const ANIMATION_DURATION = 30000;

const beatInterval = (60 / BPM) * 1000;
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

const config1 = generateConfig1(25, beatInterval);

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
        change: getRandomChanges(
          numChanges,
          interval,
          getRandomRetroShapeStyles
        ),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

export default {
  name: "Maximum Randomness",
  config: config1,
};
