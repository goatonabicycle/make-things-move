import { elementsConfigs } from "./config.js";
import { createElements } from "./utils.js";
import {
  animateCircle,
  animateRotation,
  handleTimeBasedChanges,
  animateOrbit,
} from "./animations.js";

let startTime;
let currentConfigIndex = 0;

function animateElements(config) {
  config.forEach((item) => {
    const element = document.getElementById(item.id);
    if (item.timeline.rotate) {
      const { clockwiseDuration, anticlockwiseDuration } = item.timeline.rotate;
      animateRotation(element, clockwiseDuration, anticlockwiseDuration);
    }
    if (item.timeline.orbit) {
      animateOrbit(element, item.timeline.orbit);
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
  const elements = document.querySelectorAll(".centered-text");
  elements.forEach((element) => element.remove());
  createElements(elementsConfigs[currentConfigIndex]);
  animateElements(elementsConfigs[currentConfigIndex]);
  startTime = Date.now();
}

function updateTimer() {
  const elapsed = Date.now() - startTime;
  const seconds = Math.floor(elapsed / 1000) % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `Time: ${seconds}s`;
  requestAnimationFrame(updateTimer);
}

function handleConfigChange(event) {
  currentConfigIndex = parseInt(event.target.value, 10);
  resetAndRestart();
}

function createDropdown() {
  const dropdown = document.createElement("select");
  dropdown.id = "configSelector";
  dropdown.className = "dropdown";
  dropdown.innerHTML = `
    <option value="0">Configuration 1</option>
    <option value="1">Configuration 2</option>
  `;
  dropdown.addEventListener("change", handleConfigChange);
  return dropdown;
}

window.onload = () => {
  startTime = Date.now();
  document.body.appendChild(createDropdown());
  createElements(elementsConfigs[currentConfigIndex]);
  animateElements(elementsConfigs[currentConfigIndex]);
  updateTimer();
  const maxDuration = Math.max(
    ...elementsConfigs
      .map((config) => config.map((item) => item.timeline.duration))
      .flat()
  );
  setInterval(resetAndRestart, maxDuration);
};
