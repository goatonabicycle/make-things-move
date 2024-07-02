(function () {
  const container = document.getElementById("animationContainer");
  const colors = ["#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3"];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function createRandomShape() {
    const shape = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    shape.setAttribute("class", "shape");
    shape.setAttribute("width", "600");
    shape.setAttribute("height", "600");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const color = colors[getRandomInt(colors.length)];
    path.setAttribute("fill", color);

    const pathData = createRandomPathData();
    path.setAttribute("d", pathData);

    shape.appendChild(path);

    shape.style.top = `${getRandomInt(window.innerHeight)}px`;
    shape.style.left = `${getRandomInt(window.innerWidth)}px`;

    const duration = getRandomInt(35) + 10;
    shape.style.animationDuration = `${duration}s`;
    shape.style.animationDirection = Math.random() > 0.5 ? "normal" : "reverse";
    shape.style.animationTimingFunction = "ease-in-out";

    const rotationSpeed = getRandomInt(45) + 5;
    shape.style.setProperty("--rotation-speed", `${rotationSpeed}s`);

    shape.style.setProperty("--random-x1", `${-1 + Math.random() * 2}`);
    shape.style.setProperty("--random-y1", `${-1 + Math.random() * 2}`);
    shape.style.setProperty("--random-x2", `${-1 + Math.random() * 2}`);
    shape.style.setProperty("--random-y2", `${-1 + Math.random() * 2}`);
    shape.style.setProperty("--random-x3", `${-1 + Math.random() * 2}`);
    shape.style.setProperty("--random-y3", `${-1 + Math.random() * 2}`);

    const opacity = Math.random() * 0.5 + 0.5;
    shape.style.opacity = opacity;

    path.setAttribute("stroke", colors[getRandomInt(colors.length)]);
    path.setAttribute("stroke-width", getRandomInt(5) + 1);

    container.appendChild(shape);
  }

  function createRandomPathData() {
    const numPoints = getRandomInt(6) + 10;
    let pathData = `M${getRandomInt(500)},${getRandomInt(500)}`;

    for (let i = 0; i < numPoints; i++) {
      const controlPointX = getRandomInt(500);
      const controlPointY = getRandomInt(500);
      const endPointX = getRandomInt(500);
      const endPointY = getRandomInt(500);
      pathData += ` Q${controlPointX},${controlPointY} ${endPointX},${endPointY}`;
    }
    pathData += " Z";
    return pathData;
  }

  for (let i = 0; i < 200; i++) {
    createRandomShape();
  }
})();
