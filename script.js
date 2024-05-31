import { elementsConfig } from "./config.js";
import { createElements } from "./utils.js";
import {
  animateCircle,
  animateRotation,
  handleTimeBasedChanges,
  makeElementFollow,
} from "./animations.js";

let startTime;

function animateElements(config) {
  config.forEach((item) => {
    const element = document.getElementById(item.id);
    if (item.timeline.circle) {
      animateCircle(element, item.timeline.duration, startTime);
    }
    if (item.timeline.rotate) {
      const { clockwiseDuration, anticlockwiseDuration } = item.timeline.rotate;
      animateRotation(element, clockwiseDuration, anticlockwiseDuration);
    }
    if (item.timeline.follow) {
      makeElementFollow(item);
    }
    if (item.timeline.change) {
      handleTimeBasedChanges(
        element,
        item.timeline.change,
        item.timeline.duration,
        item.initialState
      );
    }
  });
}

function resetAndRestart() {
  document.body.innerHTML =
    '<div id="timer" style="position: fixed; top: 10px; left: 10px; font-size: 20px;"></div>';
  createElements(elementsConfig);
  animateElements(elementsConfig);
  startTime = Date.now();
}

function updateTimer() {
  const elapsed = Date.now() - startTime;
  const seconds = Math.floor(elapsed / 1000) % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `Time: ${seconds}s`;
  requestAnimationFrame(updateTimer);
}

window.onload = () => {
  startTime = Date.now();
  createElements(elementsConfig);
  animateElements(elementsConfig);
  updateTimer();
  const maxDuration = Math.max(
    ...elementsConfig.map((item) => item.timeline.duration)
  );
  setInterval(resetAndRestart, maxDuration);
};
