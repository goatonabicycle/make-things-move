const gridContainer = document.getElementById("grid-container");
const configSelect = document.getElementById("config-select");
const speedInput = document.getElementById("speed-input");

const obscureCharacters = [
  "Ω",
  "λ",
  "δ",
  "ψ",
  "π",
  "ξ",
  "η",
  "θ",
  "ζ",
  "χ",
  "φ",
  "β",
  "μ",
  "τ",
  "γ",
  "κ",
  "-",
  "X",
  "V",
  "`",
];

let currentConfig = "config1";
let intervalId;
let speed = parseInt(speedInput.value);

const configs = {
  config1: {
    rows: 20,
    columns: 20,
    borderColor: "#000",
    numDivs: 10,
    characterSet: obscureCharacters,
    itemColors: ["red"],
    action: placeRandomDivs,
  },
  config3: {
    rows: 10,
    columns: 30,
    borderColor: "#000",
    numDivs: 10,
    characterSet: obscureCharacters,
    itemColors: ["#ff6347", "#4682b4", "#32cd32", "#ffd700", "#8a2be2"],
    action: moveLineDivsHorizontally,
  },
  config4: {
    rows: 20,
    columns: 20,
    borderColor: "#000",
    numDivs: 10,
    characterSet: obscureCharacters,
    itemColors: ["red"],
    action: moveCircleDivs,
  },
};

function createGrid(config) {
  const { rows, columns, borderColor } = config;
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  gridContainer.style.borderColor = borderColor;

  const totalCells = rows * columns;
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-item";
    gridContainer.appendChild(cell);
  }
}

function placeRandomDivs(config) {
  const { rows, columns, numDivs, characterSet, itemColors } = config;
  const totalCells = rows * columns;

  function move() {
    const existingItems = document.querySelectorAll(".random-item");
    existingItems.forEach((item) => item.remove());

    for (let i = 0; i < numDivs; i++) {
      const randomCellIndex = Math.floor(Math.random() * totalCells);
      const randomCell = gridContainer.children[randomCellIndex];
      const randomDiv = document.createElement("div");
      randomDiv.className = "random-item";
      randomDiv.textContent =
        characterSet[Math.floor(Math.random() * characterSet.length)];
      randomDiv.style.backgroundColor =
        itemColors[Math.floor(Math.random() * itemColors.length)];
      randomCell.appendChild(randomDiv);
    }
  }

  clearInterval(intervalId);
  intervalId = setInterval(move, speed);
  move();
}

function moveLineDivsHorizontally(config) {
  const { rows, columns, numDivs, characterSet, itemColors } = config;
  const totalCells = rows * columns;
  let position = 0;

  function move() {
    const existingItems = document.querySelectorAll(".random-item");
    existingItems.forEach((item) => item.remove());

    for (let i = 0; i < numDivs; i++) {
      const cellIndex = (position + i) % totalCells;
      const randomCell = gridContainer.children[cellIndex];
      const randomDiv = document.createElement("div");
      randomDiv.className = "random-item";
      randomDiv.textContent =
        characterSet[Math.floor(Math.random() * characterSet.length)];
      randomDiv.style.backgroundColor =
        itemColors[Math.floor(Math.random() * itemColors.length)];
      randomCell.appendChild(randomDiv);
    }
    position = (position + 1) % totalCells;
  }

  clearInterval(intervalId);
  intervalId = setInterval(move, speed);
  move();
}

function moveCircleDivs(config) {
  const { rows, columns, numDivs, characterSet, itemColors } = config;
  const totalCells = rows * columns;
  const centerX = Math.floor(columns / 2);
  const centerY = Math.floor(rows / 2);
  const radius = Math.min(centerX, centerY) - 1;

  let angle = 0;

  function move() {
    const existingItems = document.querySelectorAll(".random-item");
    existingItems.forEach((item) => item.remove());

    for (let i = 0; i < numDivs; i++) {
      const currentAngle = angle + i * ((2 * Math.PI) / numDivs);
      const x = centerX + Math.floor(radius * Math.cos(currentAngle));
      const y = centerY + Math.floor(radius * Math.sin(currentAngle));
      const cellIndex = y * columns + x;
      const randomCell = gridContainer.children[cellIndex];
      const randomDiv = document.createElement("div");
      randomDiv.className = "random-item";
      randomDiv.textContent =
        characterSet[Math.floor(Math.random() * characterSet.length)];
      randomDiv.style.backgroundColor =
        itemColors[Math.floor(Math.random() * itemColors.length)];
      randomCell.appendChild(randomDiv);
    }
    angle += 0.1;
  }

  clearInterval(intervalId);
  intervalId = setInterval(move, speed);
  move();
}

function updateGrid() {
  const config = configs[currentConfig];
  createGrid(config);
  config.action(config);
}

configSelect.addEventListener("change", (e) => {
  currentConfig = e.target.value;
  updateGrid();
});

speedInput.addEventListener("input", (e) => {
  speed = parseInt(e.target.value);
  updateGrid();
});

updateGrid();
