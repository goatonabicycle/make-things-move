import {
  getRandomCharacters,
  getRandomChanges,
  getRandomOrbitPath,
} from "../utils.js";

const BPM = 90;
const ANIMATION_DURATION = 60000;

const beatInterval = (60 / BPM) * 1000;
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

const config2 = generateConfig2(20, beatInterval);

function generateConfig2(num, interval) {
  const elements = [];
  for (let i = 0; i < num; i++) {
    elements.push({
      id: `div${i + 2}`,
      content: getRandomCharacters(),
      initialState: {
        width: `${Math.random() * 20 + 5}vh`,
        height: `${Math.random() * 20 + 5}vh`,
        backgroundColor: "#66CCCC",
        borderRadius: "50%",
        position: "absolute",
        transition: "all 1s linear",
        zIndex: Math.floor(Math.random() * 100),
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
      },
      timeline: {
        rotate: null,
        change: getRandomChanges(numChanges, interval, getCircleStyles),
        orbit: getRandomOrbitPath(),
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

function getCircleStyles() {
  return {
    width: `${Math.random() * 20 + 5}vh`,
    height: `${Math.random() * 20 + 5}vh`,
    backgroundColor: "#66CCCC",
    borderRadius: "50%",
    position: "absolute",
    transition: "all 1s linear",
    zIndex: Math.floor(Math.random() * 100),
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
  };
}

export default {
  name: "Jigglin",
  config: config2,
  styles: `
    body {
      background-color: red;         
    }   
  `,
};
