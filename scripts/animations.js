import { applyInitialState, applyStyles } from "./utils.js";

export function animateCircle(element, duration, startTime) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radius = Math.min(centerX, centerY) - 100;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const angle = ((elapsed % duration) / duration) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - element.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - element.offsetHeight / 2;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    requestAnimationFrame(animate);
  };
  animate();
}

export function animateRotation(
  element,
  clockwiseDuration = 5 * 1000,
  anticlockwiseDuration = 5 * 1000
) {
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

export function makeElementFollow(item) {
  const follower = document.getElementById(item.id);
  const target = document.getElementById(item.timeline.follow);
  let previousPositions = [];

  const follow = () => {
    const currentPos = {
      top: target.style.top,
      left: target.style.left,
    };

    previousPositions.push(currentPos);

    if (previousPositions.length > 20) {
      const pos = previousPositions.shift();
      follower.style.transition = "all 0.1s linear";
      follower.style.top = pos.top;
      follower.style.left = pos.left;
    }

    requestAnimationFrame(follow);
  };

  follow();
}
