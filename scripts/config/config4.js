import {
  getRandomCharacters,
  getRandomChanges,
  getRandomColor,
} from "../utils.js";

const BPM = 90;
const ANIMATION_DURATION = 60000;

const beatInterval = (60 / BPM) * 1000;
const numChanges = Math.ceil(ANIMATION_DURATION / beatInterval);

const config4 = generateConfig4(15, beatInterval);

function generateConfig4(num, interval) {
  const elements = [];
  for (let i = 0; i < num; i++) {
    elements.push({
      id: `div${i + 2}`,
      content: getRandomCharacters(),
      initialState: {
        width: `${Math.random() * 10 + 5}vw`,
        height: `${Math.random() * 10 + 5}vw`,
        backgroundColor: getRandomColor(),
        borderRadius: "50%",
        position: "absolute",
        transition: "all 1s linear",
        zIndex: Math.floor(Math.random() * 100),
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
      },
      timeline: {
        rotate: null,
        change: getRandomChanges(numChanges, interval, getWideOrbitStyles),
        orbit: getWideOrbitPath(),
        duration: ANIMATION_DURATION,
      },
    });
  }
  return elements;
}

function getWideOrbitStyles() {
  return {
    width: `${Math.random() * 10 + 5}vw`,
    height: `${Math.random() * 10 + 5}vw`,
    backgroundColor: getRandomColor(),
    borderRadius: "50%",
    position: "absolute",
    transition: "all 1s linear",
    zIndex: Math.floor(Math.random() * 100),
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
  };
}

function getWideOrbitPath() {
  const centerX = Math.random() * window.innerWidth;
  const centerY = Math.random() * window.innerHeight;
  const radiusX = Math.random() * window.innerWidth * 20;
  const radiusY = Math.random() * window.innerHeight * 20;
  const speed = Math.random() * 0.01 + 0.005;

  return { centerX, centerY, radiusX, radiusY, speed };
}

export default {
  name: "Very Wide Orbits",
  config: config4,
  styles: `
    body {
      background-color: blue;
    
    }
  `,
};
