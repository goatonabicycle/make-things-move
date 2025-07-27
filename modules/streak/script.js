(async function () {
  class CombinedModule {
    constructor() {
      this.container = null;
      this.animationFrameId = null;
      this.lastTime = 0;

      this.config = {
        grid: {
          rows: { value: 30, min: 10, max: 100, step: 5, label: 'Rows' },
          columns: { value: 50, min: 10, max: 100, step: 5, label: 'Columns' }
        },
        items: {
          count: { value: 20, min: 1, max: 50, step: 1, label: 'Item Count' },
          fontSize: { value: 1, min: 0.5, max: 3, step: 0.1, label: 'Font Size' }
        },
        movement: {
          direction: { value: 0, min: 0, max: 3, step: 1, label: 'Direction' }, // 0: horizontal, 1: vertical, 2: diagonal, 3: circular
          startPosition: { value: 0, min: 0, max: 3, step: 1, label: 'Start Position' }, // 0: left/top, 1: right/bottom, 2: center, 3: random
          speed: { value: 50, min: 10, max: 200, step: 5, label: 'Speed (ms)' }
        },
        appearance: {
          colorScheme: { value: 0, min: 0, max: 2, step: 1, label: 'Color Scheme' } // 0: original, 1: neon, 2: pastel
        }
      };

      this.obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];
      this.colorSchemes = {
        0: ["#808080", "#696969", "#A9A9A9", "#C0C0C0", "#D3D3D3"], // original
        1: ["#FF00FF", "#00FFFF", "#FFFF00", "#00FF00", "#FF69B4"], // neon
        2: ["#FFB6C1", "#98FB98", "#AFEEEE", "#FFDAB9", "#D8BFD8"]  // pastel
      };

      this.intervalId = null;
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    getRandomArrayItem(array) {
      return array[this.getRandomInt(array.length)];
    }

    createGrid() {
      this.container = document.getElementById("grid-container");
      if (!this.container) {
        console.error("Container not found!");
        return;
      }

      this.container.innerHTML = "";
      this.container.style.gridTemplateRows = `repeat(${this.config.grid.rows.value}, 1fr)`;
      this.container.style.gridTemplateColumns = `repeat(${this.config.grid.columns.value}, 1fr)`;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.config.grid.rows.value * this.config.grid.columns.value; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item";
        fragment.appendChild(cell);
      }
      this.container.appendChild(fragment);
    }

    getStartPosition() {
      const rows = this.config.grid.rows.value;
      const columns = this.config.grid.columns.value;
      const totalCells = rows * columns;
      const startPositionSetting = this.config.movement.startPosition.value;

      switch (startPositionSetting) {
        case 0: // left/top
          return this.config.movement.direction.value === 1 ? 0 : 0;
        case 1: // right/bottom
          return this.config.movement.direction.value === 1 ? totalCells - columns : columns - 1;
        case 2: // center
          return Math.floor(rows / 2) * columns + Math.floor(columns / 2);
        case 3: // random
          return this.getRandomInt(totalCells);
        default:
          return 0;
      }
    }

    startAnimation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      const rows = this.config.grid.rows.value;
      const columns = this.config.grid.columns.value;
      const totalCells = rows * columns;
      const colorScheme = this.colorSchemes[this.config.appearance.colorScheme.value];
      const direction = this.config.movement.direction.value;
      const numDivs = this.config.items.count.value;
      let position = this.getStartPosition();

      const moveHorizontally = () => {
        const existingItems = this.container.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        for (let i = 0; i < numDivs; i++) {
          const rowOffset = Math.floor(position / columns);
          const cellIndex = (position + i) % columns + (rowOffset * columns);
          if (cellIndex < totalCells) {
            const randomCell = this.container.children[cellIndex];
            const randomDiv = document.createElement("div");
            randomDiv.className = "random-item";
            randomDiv.textContent = this.getRandomArrayItem(this.obscureCharacters);
            randomDiv.style.backgroundColor = this.getRandomArrayItem(colorScheme);
            randomDiv.style.fontSize = `${this.config.items.fontSize.value}rem`;
            randomCell.appendChild(randomDiv);
          }
        }

        position = (position + 1) % columns;
        if (position === 0) {
          const currentRow = Math.floor(position / columns);
          position = ((currentRow + 1) % rows) * columns;
        }
      };

      const moveVertically = () => {
        const existingItems = this.container.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        for (let i = 0; i < numDivs; i++) {
          const cellIndex = (position + i * columns) % totalCells;
          const randomCell = this.container.children[cellIndex];
          const randomDiv = document.createElement("div");
          randomDiv.className = "random-item";
          randomDiv.textContent = this.getRandomArrayItem(this.obscureCharacters);
          randomDiv.style.backgroundColor = this.getRandomArrayItem(colorScheme);
          randomDiv.style.fontSize = `${this.config.items.fontSize.value}rem`;
          randomCell.appendChild(randomDiv);
        }
        position = (position + columns) % totalCells;
      };

      const moveDiagonally = () => {
        const existingItems = this.container.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        for (let i = 0; i < numDivs; i++) {
          const row = (Math.floor(position / columns) + i) % rows;
          const col = (position % columns + i) % columns;
          const cellIndex = row * columns + col;

          if (cellIndex < totalCells) {
            const randomCell = this.container.children[cellIndex];
            const randomDiv = document.createElement("div");
            randomDiv.className = "random-item";
            randomDiv.textContent = this.getRandomArrayItem(this.obscureCharacters);
            randomDiv.style.backgroundColor = this.getRandomArrayItem(colorScheme);
            randomDiv.style.fontSize = `${this.config.items.fontSize.value}rem`;
            randomCell.appendChild(randomDiv);
          }
        }

        position = (position + columns + 1) % totalCells;
      };

      let angle = 0;
      const moveCircularly = () => {
        const existingItems = this.container.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        const centerX = Math.floor(columns / 2);
        const centerY = Math.floor(rows / 2);
        const radius = Math.min(centerX, centerY) - 1;

        for (let i = 0; i < numDivs; i++) {
          const currentAngle = angle + i * ((2 * Math.PI) / numDivs);
          const x = centerX + Math.floor(radius * Math.cos(currentAngle));
          const y = centerY + Math.floor(radius * Math.sin(currentAngle));
          const cellIndex = y * columns + x;

          if (cellIndex >= 0 && cellIndex < totalCells) {
            const randomCell = this.container.children[cellIndex];
            const randomDiv = document.createElement("div");
            randomDiv.className = "random-item";
            randomDiv.textContent = this.getRandomArrayItem(this.obscureCharacters);
            randomDiv.style.backgroundColor = this.getRandomArrayItem(colorScheme);
            randomDiv.style.fontSize = `${this.config.items.fontSize.value}rem`;
            randomCell.appendChild(randomDiv);
          }
        }
        angle += 0.1;
      };

      const moveFunction = [moveHorizontally, moveVertically, moveDiagonally, moveCircularly][direction];
      this.intervalId = setInterval(moveFunction, this.config.movement.speed.value);
      moveFunction();
    }

    init() {
      this.createGrid();
      this.startAnimation();
    }

    onConfigUpdate() {
      this.createGrid();
      this.startAnimation();
    }

    cleanup() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }

  const moduleManager = new ModuleManager();
  await moduleManager.init(CombinedModule);
})();