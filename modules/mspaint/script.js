const config = {
  shapes: {
    count: { value: 200, min: 10, max: 500, step: 10, label: 'Shape Count' },
    minPoints: { value: 10, min: 3, max: 20, step: 1, label: 'Min Points' },
    maxPoints: { value: 16, min: 5, max: 30, step: 1, label: 'Max Points' },
    strokeWidth: { value: 3, min: 1, max: 10, step: 1, label: 'Stroke Width' },
    size: { value: 600, min: 100, max: 1000, step: 50, label: 'Size' }
  },
  animation: {
    minDuration: { value: 10, min: 1, max: 30, step: 1, label: 'Min Duration' },
    maxDuration: { value: 45, min: 15, max: 90, step: 5, label: 'Max Duration' },
    minRotation: { value: 5, min: 1, max: 20, step: 1, label: 'Min Rotation' },
    maxRotation: { value: 50, min: 20, max: 90, step: 5, label: 'Max Rotation' }
  },
  appearance: {
    minOpacity: { value: 0.5, min: 0.1, max: 1, step: 0.1, label: 'Min Opacity' },
    maxOpacity: { value: 1, min: 0.1, max: 1, step: 0.1, label: 'Max Opacity' }
  }
};

let panel;
let container;
const colors = ["#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3"];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createRandomShape() {
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  shape.setAttribute("class", "shape");
  shape.setAttribute("width", config.shapes.size.value.toString());
  shape.setAttribute("height", config.shapes.size.value.toString());

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const color = colors[getRandomInt(colors.length)];
  path.setAttribute("fill", color);

  const pathData = createRandomPathData();
  path.setAttribute("d", pathData);

  shape.appendChild(path);

  shape.style.top = `${getRandomInt(window.innerHeight)}px`;
  shape.style.left = `${getRandomInt(window.innerWidth)}px`;

  const duration = getRandomInt(config.animation.maxDuration.value - config.animation.minDuration.value) +
    config.animation.minDuration.value;
  shape.style.animationDuration = `${duration}s`;
  shape.style.animationDirection = Math.random() > 0.5 ? "normal" : "reverse";
  shape.style.animationTimingFunction = "ease-in-out";

  const rotationSpeed = getRandomInt(config.animation.maxRotation.value - config.animation.minRotation.value) +
    config.animation.minRotation.value;
  shape.style.setProperty("--rotation-speed", `${rotationSpeed}s`);

  shape.style.setProperty("--random-x1", `${-1 + Math.random() * 2}`);
  shape.style.setProperty("--random-y1", `${-1 + Math.random() * 2}`);
  shape.style.setProperty("--random-x2", `${-1 + Math.random() * 2}`);
  shape.style.setProperty("--random-y2", `${-1 + Math.random() * 2}`);
  shape.style.setProperty("--random-x3", `${-1 + Math.random() * 2}`);
  shape.style.setProperty("--random-y3", `${-1 + Math.random() * 2}`);

  const opacity = Math.random() *
    (config.appearance.maxOpacity.value - config.appearance.minOpacity.value) +
    config.appearance.minOpacity.value;
  shape.style.opacity = opacity;

  path.setAttribute("stroke", colors[getRandomInt(colors.length)]);
  path.setAttribute("stroke-width", getRandomInt(config.shapes.strokeWidth.value) + 1);

  container.appendChild(shape);
}

function createRandomPathData() {
  const numPoints = getRandomInt(config.shapes.maxPoints.value - config.shapes.minPoints.value) +
    config.shapes.minPoints.value;
  const size = config.shapes.size.value;
  let pathData = `M${getRandomInt(size)},${getRandomInt(size)}`;

  for (let i = 0; i < numPoints; i++) {
    const controlPointX = getRandomInt(size);
    const controlPointY = getRandomInt(size);
    const endPointX = getRandomInt(size);
    const endPointY = getRandomInt(size);
    pathData += ` Q${controlPointX},${controlPointY} ${endPointX},${endPointY}`;
  }
  pathData += " Z";
  return pathData;
}

function clearShapes() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function regenerateShapes() {
  clearShapes();
  for (let i = 0; i < config.shapes.count.value; i++) {
    createRandomShape();
  }
}

function init() {
  container = document.getElementById("animationContainer");

  panel = new ConfigPanel(config, () => {
    regenerateShapes();
  });

  regenerateShapes();
}

function cleanup() {
  if (panel) {
    panel.destroy();
  }
  clearShapes();
}

init();
window.addEventListener('beforeunload', cleanup);