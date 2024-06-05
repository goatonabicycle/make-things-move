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

const config3 = generateConfig3(15, beatInterval);

function generateConfig3(num, interval) {
  const elements = [];
  for (let i = 0; i < num; i++) {
    elements.push({
      id: `div${i + 2}`,
      content: getRandomCharacters(10, "NOPQRST"),
      initialState: {
        width: `${Math.random() * 10 + 5}vw`,
        height: `${Math.random() * 10 + 5}vw`,
        backgroundColor: Math.random() > 0.5 ? "#000" : "#FFF",
        position: "absolute",
        transition: "all 1s linear",
        zIndex: Math.floor(Math.random() * 100),
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
      },
      timeline: {
        rotate: {
          clockwiseDuration: getRandomDuration(),
          anticlockwiseDuration: getRandomDuration(),
        },
        change: getRandomChanges(
          numChanges,
          interval,
          getBlackAndWhiteSquareStyles,
          "NOPQRST"
        ),
        orbit: Math.random() < 0.5 ? getRandomOrbitPath() : undefined,
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

function getBlackAndWhiteSquareStyles() {
  return {
    width: `${Math.random() * 10 + 5}vw`,
    height: `${Math.random() * 10 + 5}vw`,
    backgroundColor: Math.random() > 0.5 ? "#000" : "#FFF",
    position: "absolute",
    transition: "all 1s linear",
    zIndex: Math.floor(Math.random() * 100),
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
  };
}

export default {
  name: "Comfortable",
  config: config3,
  styles: `
    body {
      background-color: pink;     
    }
  `,
};
