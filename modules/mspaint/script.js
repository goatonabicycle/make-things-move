(async function () {
  class MSPaintModule {
    constructor() {
      this.container = null;
      this.colors = ["#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3"];

      this.config = {
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
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    createRandomShape() {
      const shape = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      shape.setAttribute("class", "shape");
      shape.setAttribute("width", this.config.shapes.size.value.toString());
      shape.setAttribute("height", this.config.shapes.size.value.toString());

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const color = this.colors[this.getRandomInt(this.colors.length)];
      path.setAttribute("fill", color);

      const pathData = this.createRandomPathData();
      path.setAttribute("d", pathData);

      shape.appendChild(path);

      shape.style.top = `${this.getRandomInt(window.innerHeight)}px`;
      shape.style.left = `${this.getRandomInt(window.innerWidth)}px`;

      const duration = this.getRandomInt(
        this.config.animation.maxDuration.value - this.config.animation.minDuration.value
      ) + this.config.animation.minDuration.value;

      shape.style.animationDuration = `${duration}s`;
      shape.style.animationDirection = Math.random() > 0.5 ? "normal" : "reverse";
      shape.style.animationTimingFunction = "ease-in-out";

      const rotationSpeed = this.getRandomInt(
        this.config.animation.maxRotation.value - this.config.animation.minRotation.value
      ) + this.config.animation.minRotation.value;

      shape.style.setProperty("--rotation-speed", `${rotationSpeed}s`);
      shape.style.setProperty("--random-x1", `${-1 + Math.random() * 2}`);
      shape.style.setProperty("--random-y1", `${-1 + Math.random() * 2}`);
      shape.style.setProperty("--random-x2", `${-1 + Math.random() * 2}`);
      shape.style.setProperty("--random-y2", `${-1 + Math.random() * 2}`);
      shape.style.setProperty("--random-x3", `${-1 + Math.random() * 2}`);
      shape.style.setProperty("--random-y3", `${-1 + Math.random() * 2}`);

      const opacity = Math.random() *
        (this.config.appearance.maxOpacity.value - this.config.appearance.minOpacity.value) +
        this.config.appearance.minOpacity.value;
      shape.style.opacity = opacity;

      path.setAttribute("stroke", this.colors[this.getRandomInt(this.colors.length)]);
      path.setAttribute(
        "stroke-width",
        this.getRandomInt(this.config.shapes.strokeWidth.value) + 1
      );

      this.container.appendChild(shape);
    }

    createRandomPathData() {
      const numPoints = this.getRandomInt(
        this.config.shapes.maxPoints.value - this.config.shapes.minPoints.value
      ) + this.config.shapes.minPoints.value;

      const size = this.config.shapes.size.value;
      let pathData = `M${this.getRandomInt(size)},${this.getRandomInt(size)}`;

      for (let i = 0; i < numPoints; i++) {
        const controlPointX = this.getRandomInt(size);
        const controlPointY = this.getRandomInt(size);
        const endPointX = this.getRandomInt(size);
        const endPointY = this.getRandomInt(size);
        pathData += ` Q${controlPointX},${controlPointY} ${endPointX},${endPointY}`;
      }
      pathData += " Z";
      return pathData;
    }

    clearShapes() {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }

    regenerateShapes() {
      this.clearShapes();
      for (let i = 0; i < this.config.shapes.count.value; i++) {
        this.createRandomShape();
      }
    }

    init() {
      this.container = document.getElementById("animationContainer");
      if (!this.container) {
        console.error("Container not found!");
        return;
      }
      this.regenerateShapes();
    }

    onConfigUpdate() {
      this.regenerateShapes();
    }

    cleanup() {
      this.clearShapes();
    }
  }

  await new Promise(resolve => {
    const checkDeps = () => {
      if (window.ModuleManager && window.ConfigPanel) {
        resolve();
      } else {
        setTimeout(checkDeps, 50);
      }
    };
    checkDeps();
  });

  const moduleManager = new ModuleManager();
  await moduleManager.init(MSPaintModule);
})();