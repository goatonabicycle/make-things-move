import { applyInitialState, applyStyles } from "./utils.js";

export function animateRotation(
  element,
  clockwiseDuration = 5 * 1000,
  anticlockwiseDuration = 5 * 1000
) {
  if (!clockwiseDuration || !anticlockwiseDuration) return;

  let rotationStartTime = Date.now();
  let clockwise = true;

  const animate = () => {
    const elapsed = Date.now() - rotationStartTime;
    const duration = clockwise ? clockwiseDuration : anticlockwiseDuration;
    const progress = (elapsed % duration) / duration;
    const angle = progress * 360 * (clockwise ? 1 : -1);
    element.style.transform = `rotate(${angle}deg)`;

    if (elapsed >= duration) {
      rotationStartTime = Date.now();
      clockwise = !clockwise;
    }

    requestAnimationFrame(animate);
  };
  animate();
}

export function handleTimeBasedChanges(
  element,
  changes,
  duration,
  initialState
) {
  changes.forEach((change) => {
    setTimeout(() => {
      applyStyles(element, change.styles);
      if (change.content !== undefined) {
        element.innerHTML = `<div>${change.content}</div>`;
      }
    }, change.time);
  });

  setTimeout(() => {
    applyInitialState(element, initialState);
    element.innerHTML = `<div>${initialState.content}</div>`;
    handleTimeBasedChanges(element, changes, duration, initialState);
  }, duration);
}

export function animateOrbit(element, orbit) {
  const { centerX, centerY, radiusX, radiusY, speed } = orbit;
  let startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const angle = elapsed * speed;
    const x = centerX + radiusX * Math.cos(angle) - element.offsetWidth / 2;
    const y = centerY + radiusY * Math.sin(angle) - element.offsetHeight / 2;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    requestAnimationFrame(animate);
  };
  animate();
}
