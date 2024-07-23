(function () {
  const moduleContent = document.getElementById("module-content");

  const radius = 150;
  let numCirclesPerLayer = 2;
  const upperLimit = 60;
  let circleFactor1 = 2;
  let circleFactor2 = 2;
  let increasing = true;
  let trigFuncX = randomTrigFunction();
  let trigFuncY = randomTrigFunction();

  const trigFunctionDisplay = document.createElement("div");
  trigFunctionDisplay.style.position = "fixed";
  trigFunctionDisplay.style.bottom = "10px";
  trigFunctionDisplay.style.right = "10px";
  trigFunctionDisplay.style.color = "white";
  trigFunctionDisplay.style.zIndex = "1000";
  document.body.appendChild(trigFunctionDisplay);

  function updateTrigFunctionDisplay() {
    trigFunctionDisplay.innerHTML = `x: ${trigFuncX.name}, y: ${trigFuncY.name}`;
  }

  function createCircle(className, size) {
    const circle = document.createElement("div");
    circle.classList.add(className);
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    return circle;
  }

  function randomTrigFunction() {
    const functions = [Math.sin, Math.cos, Math.tan];
    return functions[Math.floor(Math.random() * functions.length)];
  }

  function positionCircle(circle, angle, radius, offsetX = 0, offsetY = 0, trigFuncX = Math.cos, trigFuncY = Math.sin) {
    const x = radius * trigFuncX(angle) + offsetX;
    const y = radius * trigFuncY(angle) + offsetY;
    circle.style.left = `calc(50% + ${x}px)`;
    circle.style.top = `calc(50% + ${y}px)`;
  }

  function createOrbitingCircles() {
    moduleContent.innerHTML = "";
    for (let i = 0; i < numCirclesPerLayer; i++) {
      const angle = (i / numCirclesPerLayer) * circleFactor1 * Math.PI;
      const outerCircle = createCircle("orbiting-circle", radius);
      positionCircle(outerCircle, angle, radius, 0, 0, trigFuncX, trigFuncY);
      moduleContent.appendChild(outerCircle);

      for (let j = 0; j < numCirclesPerLayer; j++) {
        const innerAngle = (j / numCirclesPerLayer) * circleFactor2 * Math.PI;
        const innerCircle = createCircle("orbiting-circle", radius);
        positionCircle(innerCircle, innerAngle, radius, radius * trigFuncX(angle), radius * trigFuncY(angle), trigFuncX, trigFuncY);
        moduleContent.appendChild(innerCircle);
      }
    }
  }

  function updateCircles() {
    if (increasing) {
      numCirclesPerLayer++;
      if (numCirclesPerLayer >= upperLimit) {
        increasing = false;
      }
    } else {
      numCirclesPerLayer--;
      if (numCirclesPerLayer <= 2) {
        increasing = true;
        trigFuncX = randomTrigFunction();
        trigFuncY = randomTrigFunction();
        updateTrigFunctionDisplay();
      }
    }
    createOrbitingCircles();
  }

  createOrbitingCircles();
  updateTrigFunctionDisplay();
  setInterval(updateCircles, 70);
})();
