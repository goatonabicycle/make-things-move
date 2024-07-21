(function () {
  const moduleContent = document.getElementById("module-content");

  const radius = 200;
  const numCirclesPerLayer = 8;
  let circleFactor1 = 2;
  let circleFactor2 = 2;

  function createCircle(className, size) {
    const circle = document.createElement("div");
    circle.classList.add(className);
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    return circle;
  }

  function positionCircle(circle, angle, radius, offsetX = 0, offsetY = 0) {
    const x = radius * Math.cos(angle) + offsetX;
    const y = radius * Math.sin(angle) + offsetY;
    circle.style.left = `calc(50% + ${x}px)`;
    circle.style.top = `calc(50% + ${y}px)`;
  }

  function createOrbitingCircles() {
    for (let i = 0; i < numCirclesPerLayer; i++) {
      const angle = (i / numCirclesPerLayer) * circleFactor1 * Math.PI;
      const outerCircle = createCircle("orbiting-circle", radius);
      positionCircle(outerCircle, angle, radius);
      moduleContent.appendChild(outerCircle);

      for (let j = 0; j < numCirclesPerLayer; j++) {
        const innerAngle = (j / numCirclesPerLayer) * circleFactor2 * Math.PI;
        const innerCircle = createCircle("orbiting-circle", radius);
        positionCircle(innerCircle, innerAngle, radius, radius * Math.cos(angle), radius * Math.sin(angle));
        moduleContent.appendChild(innerCircle);
      }
    }
  }

  createOrbitingCircles();
})();
