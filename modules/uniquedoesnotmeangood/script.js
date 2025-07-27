(function() {
const config = {
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

let panel;
let gridContainer;
let intervalId = null;

const baseColors = [
  "#8F8CE7", "#FF8C00", "#DC143C", "#D8DCD6",
  "#42B395", "#FF81C0", "#4B0082", "#7FFF00",
  "#FF4500", "#9370DB", "#20B2AA", "#FF69B4",
  "#00FA9A", "#8A2BE2", "#FF6347", "#4682B4"
];

const characters = {
  greek: ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ"],
  latin: ["-", "X", "V", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

function getAvailableCharacters() {
  let chars = [];
  if (config.appearance.useGreek.value) chars = chars.concat(characters.greek);
  if (config.appearance.useLatin.value) chars = chars.concat(characters.latin);
  return chars.length ? chars : ["-"];
}

function getAvailableColors() {
  return baseColors.slice(0, config.appearance.colorCount.value);
}

function createGrid() {
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateRows = `repeat(${config.grid.rows.value}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${config.grid.columns.value}, 1fr)`;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < config.grid.rows.value * config.grid.columns.value; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-item";
    fragment.appendChild(cell);
  }
  gridContainer.appendChild(fragment);
}

function placeRandomDivs() {
  const totalCells = config.grid.rows.value * config.grid.columns.value;
  const availableChars = getAvailableCharacters();
  const availableColors = getAvailableColors();

  function move() {
    const existingItems = gridContainer.querySelectorAll(".random-item");
    existingItems.forEach((item) => item.remove());

    for (let i = 0; i < config.grid.items.value; i++) {
      const randomCellIndex = getRandomInt(totalCells);
      const randomCell = gridContainer.children[randomCellIndex];

      if (randomCell) {
        const randomDiv = document.createElement("div");
        randomDiv.className = "random-item";
        randomDiv.textContent = availableChars[getRandomInt(availableChars.length)];
        randomDiv.style.backgroundColor = availableColors[getRandomInt(availableColors.length)];
        randomDiv.style.fontSize = `${config.animation.fontSize.value}rem`;
        randomCell.appendChild(randomDiv);
      }
    }
  }

  clearInterval(intervalId);
  intervalId = setInterval(move, config.animation.speed.value);
  move();
}

function init() {
  gridContainer = document.getElementById("grid-container");

  panel = new ConfigPanel(config, () => {
    createGrid();
    placeRandomDivs();
  });

  createGrid();
  placeRandomDivs();
}

function cleanup() {
  if (panel) {
    panel.destroy();
  }
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (gridContainer) {
    gridContainer.innerHTML = '';
  }
}

init();
window.cleanup = cleanup;
window.addEventListener('beforeunload', cleanup);
})();