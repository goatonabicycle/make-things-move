(async function () {
  class WobbleFutureModule {
    constructor() {
      this.moduleContent = document.getElementById("module-content");
      this.radius = 150;
      this.numCirclesPerLayer = 2;
      this.upperLimit = 10;
      this.circleFactor1 = 2;
      this.circleFactor2 = 2;
      this.increasing = true;
      this.trigFuncX = this.randomTrigFunction();
      this.trigFuncY = this.randomTrigFunction();
      this.updateInterval = null;
      this.trigFunctionDisplay = null;

      this.config = {
        circles: {
          radius: { value: 150, min: 50, max: 300, step: 10, label: 'Radius' },
          upperLimit: { value: 60, min: 10, max: 100, step: 5, label: 'Max Circles' },
          circleFactor1: { value: 2, min: 1, max: 5, step: 0.1, label: 'Factor 1' },
          circleFactor2: { value: 2, min: 1, max: 5, step: 0.1, label: 'Factor 2' }
        },
        animation: {
          updateSpeed: { value: 70, min: 10, max: 500, step: 10, label: 'Speed (ms)' },
          showInfo: { value: 1, min: 0, max: 1, step: 1, label: 'Show Info' }
        },
        appearance: {
          circleColor: { value: 0, min: 0, max: 4, step: 1, label: 'Circle Color' },
          circleWidth: { value: 1, min: 1, max: 5, step: 1, label: 'Line Width' }
        }
      };
    }

    randomTrigFunction() {
      const functions = [
        { func: Math.sin, name: "sin" },
        { func: Math.cos, name: "cos" },
        { func: Math.tan, name: "tan" }
      ];
      return functions[Math.floor(Math.random() * functions.length)];
    }

    updateTrigFunctionDisplay() {
      if (!this.trigFunctionDisplay) {
        this.trigFunctionDisplay = document.createElement("div");
        this.trigFunctionDisplay.style.position = "fixed";
        this.trigFunctionDisplay.style.bottom = "10px";
        this.trigFunctionDisplay.style.right = "10px";
        this.trigFunctionDisplay.style.color = "white";
        this.trigFunctionDisplay.style.zIndex = "1000";
        document.body.appendChild(this.trigFunctionDisplay);
      }

      if (this.config.animation.showInfo.value === 1) {
        this.trigFunctionDisplay.style.display = "block";
        this.trigFunctionDisplay.innerHTML = `x: ${this.trigFuncX.name}, y: ${this.trigFuncY.name}, circles: ${this.numCirclesPerLayer}`;
      } else {
        this.trigFunctionDisplay.style.display = "none";
      }
    }

    createCircle(className, size) {
      const circle = document.createElement("div");
      circle.classList.add(className);
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;

      const colors = ["white", "#FF6347", "#40E0D0", "#BA55D3", "#7CFC00"];
      const selectedColor = colors[this.config.appearance.circleColor.value];
      circle.style.borderColor = selectedColor;

      circle.style.borderWidth = `${this.config.appearance.circleWidth.value}px`;

      return circle;
    }

    positionCircle(circle, angle, radius, offsetX = 0, offsetY = 0) {
      const x = radius * this.trigFuncX.func(angle) + offsetX;
      const y = radius * this.trigFuncY.func(angle) + offsetY;
      circle.style.left = `calc(50% + ${x}px)`;
      circle.style.top = `calc(50% + ${y}px)`;
    }

    createOrbitingCircles() {
      this.radius = this.config.circles.radius.value;
      this.upperLimit = this.config.circles.upperLimit.value;
      this.circleFactor1 = this.config.circles.circleFactor1.value;
      this.circleFactor2 = this.config.circles.circleFactor2.value;

      this.moduleContent.innerHTML = "";

      for (let i = 0; i < this.numCirclesPerLayer; i++) {
        const angle = (i / this.numCirclesPerLayer) * this.circleFactor1 * Math.PI;
        const outerCircle = this.createCircle("orbiting-circle", this.radius);
        this.positionCircle(outerCircle, angle, this.radius, 0, 0);
        this.moduleContent.appendChild(outerCircle);

        for (let j = 0; j < this.numCirclesPerLayer; j++) {
          const innerAngle = (j / this.numCirclesPerLayer) * this.circleFactor2 * Math.PI;
          const innerCircle = this.createCircle("orbiting-circle", this.radius);
          this.positionCircle(
            innerCircle,
            innerAngle,
            this.radius,
            this.radius * this.trigFuncX.func(angle),
            this.radius * this.trigFuncY.func(angle)
          );
          this.moduleContent.appendChild(innerCircle);
        }
      }
    }

    updateCircles() {
      if (this.increasing) {
        this.numCirclesPerLayer++;
        if (this.numCirclesPerLayer >= this.upperLimit) {
          this.increasing = false;
        }
      } else {
        this.numCirclesPerLayer--;
        if (this.numCirclesPerLayer <= 2) {
          this.increasing = true;
          this.trigFuncX = this.randomTrigFunction();
          this.trigFuncY = this.randomTrigFunction();
          this.updateTrigFunctionDisplay();
        }
      }
      this.createOrbitingCircles();
    }

    startAnimation() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      this.updateInterval = setInterval(() => this.updateCircles(), this.config.animation.updateSpeed.value);
    }

    init() {
      this.createOrbitingCircles();
      this.updateTrigFunctionDisplay();
      this.startAnimation();
    }

    onConfigUpdate() {
      this.createOrbitingCircles();
      this.updateTrigFunctionDisplay();
      this.startAnimation();
    }

    cleanup() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }

      if (this.trigFunctionDisplay) {
        this.trigFunctionDisplay.remove();
        this.trigFunctionDisplay = null;
      }

      if (this.moduleContent) {
        this.moduleContent.innerHTML = '';
      }
    }
  }

  const moduleManager = new ModuleManager();
  await moduleManager.init(WobbleFutureModule);
})();