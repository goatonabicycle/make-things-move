import config1 from "./config/config1.js";
import config2 from "./config/config2.js";
import config3 from "./config/config3.js";
import { createElements } from "./utils.js";
import {
  animateCircle,
  animateRotation,
  handleTimeBasedChanges,
  animateOrbit,
} from "./animations.js";

let startTime;
let currentConfigIndex = 0;
const configs = [config1, config2, config3];

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
  createElements(configs[currentConfigIndex].config);
  animateElements(configs[currentConfigIndex].config);
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
  dropdown.innerHTML = configs
    .map((config, index) => `<option value="${index}">${config.name}</option>`)
    .join("");
  dropdown.addEventListener("change", handleConfigChange);
  return dropdown;
}

window.onload = () => {
  startTime = Date.now();
  document.body.appendChild(createDropdown());
  createElements(configs[currentConfigIndex].config);
  animateElements(configs[currentConfigIndex].config);
  updateTimer();
  const maxDuration = Math.max(
    ...configs
      .map((config) => config.config.map((item) => item.timeline.duration))
      .flat()
  );
  setInterval(resetAndRestart, maxDuration);
};
