import { ModuleManager } from '../../moduleManager.js';

class OrbitingModule {
    constructor() {
      this.container = null;
      this.intervalId = null;

      this.config = {
        grid: {
          rows: { value: 200, min: 50, max: 400, step: 10, label: 'Rows' },
          columns: { value: 100, min: 50, max: 200, step: 10, label: 'Columns' }
        },
        items: {
          count: { value: 20, min: 5, max: 50, step: 1, label: 'Item Count' },
          size: { value: 1, min: 0.5, max: 3, step: 0.1, label: 'Font Size' }
        },
        animation: {
          speed: { value: 50, min: 10, max: 200, step: 5, label: 'Speed (ms)' },
          radius: { value: 0.8, min: 0.2, max: 1, step: 0.05, label: 'Radius' },
          angleStep: { value: 0.1, min: 0.01, max: 0.5, step: 0.01, label: 'Angle Step' }
        },
        appearance: {
          useGreek: { value: true, type: 'boolean', label: 'Greek Letters' },
          useLatin: { value: true, type: 'boolean', label: 'Latin Letters' },
          colorCount: { value: 5, min: 1, max: 10, step: 1, label: 'Colors' }
        }
      };

      this.characters = {
        greek: ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ"],
        latin: ["-", "X", "V", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
          "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
      };

      this.baseColors = [
        "#FF4500", "#1E90FF", "#32CD32", "#FFD700", "#8A2BE2",
        "#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3"
      ];
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    getAvailableCharacters() {
      let chars = [];
      if (this.config.appearance.useGreek.value) chars = chars.concat(this.characters.greek);
      if (this.config.appearance.useLatin.value) chars = chars.concat(this.characters.latin);
      return chars.length ? chars : ["-"];
    }

    getAvailableColors() {
      return this.baseColors.slice(0, this.config.appearance.colorCount.value);
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

    moveCircleDivs() {
      const rows = this.config.grid.rows.value;
      const columns = this.config.grid.columns.value;
      const totalCells = rows * columns;
      const centerX = Math.floor(columns / 2);
      const centerY = Math.floor(rows / 2);
      const maxRadius = Math.min(centerX, centerY) - 1;
      const radius = maxRadius * this.config.animation.radius.value;
      const numDivs = this.config.items.count.value;
      const angleStep = this.config.animation.angleStep.value;
      const availableChars = this.getAvailableCharacters();
      const availableColors = this.getAvailableColors();

      let angle = 0;

      const move = () => {
        const existingItems = this.container.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        for (let i = 0; i < numDivs; i++) {
          const currentAngle = angle + i * ((2 * Math.PI) / numDivs);
          const x = centerX + Math.floor(radius * Math.cos(currentAngle));
          const y = centerY + Math.floor(radius * Math.sin(currentAngle));

          if (x >= 0 && x < columns && y >= 0 && y < rows) {
            const cellIndex = y * columns + x;
            if (cellIndex >= 0 && cellIndex < totalCells) {
              const randomCell = this.container.children[cellIndex];
              const randomDiv = document.createElement("div");
              randomDiv.className = "random-item";
              randomDiv.textContent = availableChars[this.getRandomInt(availableChars.length)];
              randomDiv.style.backgroundColor = availableColors[this.getRandomInt(availableColors.length)];
              randomDiv.style.fontSize = `${this.config.items.size.value}rem`;
              randomCell.appendChild(randomDiv);
            }
          }
        }
        angle += angleStep;
      };

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(move, this.config.animation.speed.value);
      move();
    }

    init() {
      this.createGrid();
      this.moveCircleDivs();
    }

    onConfigUpdate() {
      this.createGrid();
      this.moveCircleDivs();
    }

    cleanup() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(OrbitingModule);
}