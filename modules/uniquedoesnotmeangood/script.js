import { ModuleManager } from '../../moduleManager.js';

class UniqueDoesNotMeanGoodModule {
  constructor() {
    this.gridContainer = null;
    this.intervalId = null;

    this.config = {
  grid: {
    rows: { value: 50, min: 10, max: 100, step: 5, label: 'Rows' },
    columns: { value: 50, min: 10, max: 100, step: 5, label: 'Columns' },
    items: { value: 50, min: 1, max: 200, step: 5, label: 'Items' }
  },
  animation: {
    speed: { value: 500, min: 50, max: 2000, step: 50, label: 'Speed (ms)' },
    fontSize: { value: 2, min: 0.5, max: 5, step: 0.1, label: 'Font Size' }
  },
  appearance: {
    useGreek: { value: true, type: 'boolean', label: 'Greek Letters' },
    useLatin: { value: true, type: 'boolean', label: 'Latin Letters' },
    colorCount: { value: 8, min: 2, max: 16, step: 1, label: 'Colors' }
  }
    };

    this.baseColors = [
  "#8F8CE7", "#FF8C00", "#DC143C", "#D8DCD6",
  "#42B395", "#FF81C0", "#4B0082", "#7FFF00",
  "#FF4500", "#9370DB", "#20B2AA", "#FF69B4",
  "#00FA9A", "#8A2BE2", "#FF6347", "#4682B4"
    ];

    this.characters = {
  greek: ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ"],
  latin: ["-", "X", "V", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    };
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
    this.gridContainer.innerHTML = "";
    this.gridContainer.style.gridTemplateRows = `repeat(${this.config.grid.rows.value}, 1fr)`;
    this.gridContainer.style.gridTemplateColumns = `repeat(${this.config.grid.columns.value}, 1fr)`;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.config.grid.rows.value * this.config.grid.columns.value; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-item";
      fragment.appendChild(cell);
    }
    this.gridContainer.appendChild(fragment);
  }

  placeRandomDivs() {
    const totalCells = this.config.grid.rows.value * this.config.grid.columns.value;
    const availableChars = this.getAvailableCharacters();
    const availableColors = this.getAvailableColors();

    const move = () => {
      const existingItems = this.gridContainer.querySelectorAll(".random-item");
      existingItems.forEach((item) => item.remove());

      for (let i = 0; i < this.config.grid.items.value; i++) {
        const randomCellIndex = this.getRandomInt(totalCells);
        const randomCell = this.gridContainer.children[randomCellIndex];

        if (randomCell) {
          const randomDiv = document.createElement("div");
          randomDiv.className = "random-item";
          randomDiv.textContent = availableChars[this.getRandomInt(availableChars.length)];
          randomDiv.style.backgroundColor = availableColors[this.getRandomInt(availableColors.length)];
          randomDiv.style.fontSize = `${this.config.animation.fontSize.value}rem`;
          randomCell.appendChild(randomDiv);
        }
      }
    };

    clearInterval(this.intervalId);
    this.intervalId = setInterval(move, this.config.animation.speed.value);
    move();
  }

  init() {
    this.gridContainer = document.getElementById("grid-container");
    this.createGrid();
    this.placeRandomDivs();
  }

  onConfigUpdate() {
    this.createGrid();
    this.placeRandomDivs();
  }

  cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.gridContainer) {
      this.gridContainer.innerHTML = '';
    }
  }
}

export async function init() {
  const moduleManager = new ModuleManager();
  await moduleManager.init(UniqueDoesNotMeanGoodModule);
}