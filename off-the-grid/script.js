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

const colorSet1 = ["#FFB6C1", "#ADD8E6", "#FFD700", "#98FB98", "#EE82EE"];
const colorSet2 = ["#FF00FF", "#00FFFF", "#FFFF00", "#00FF00", "#FF69B4"];
const colorSet3 = ["#8B4513", "#D2691E", "#2E8B57", "#556B2F", "#6B8E23"];
const colorSet4 = ["#FF4500", "#1E90FF", "#32CD32", "#FFD700", "#8A2BE2"];
const colorSet5 = ["#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3"];
const colorSet6 = ["#FF69B4", "#FF4500", "#FFD700", "#7CFC00", "#4682B4"];
const colorSet7 = ["#FFD700", "#FF8C00", "#DC143C", "#4B0082", "#7FFF00"];
const colorSet8 = ["#D2691E", "#F4A460", "#DEB887", "#CD853F", "#D2B48C"];
const colorSet9 = ["#2E8B57", "#3CB371", "#20B2AA", "#66CDAA", "#8FBC8F"];
const colorSet10 = ["#BA55D3", "#9370DB", "#8A2BE2", "#9400D3", "#9932CC"];

const configs = {
  config1: {
    rows: 100,
    columns: 100,
    borderColor: "#000",
    numDivs: 10,
    characterSet: obscureCharacters,
    itemColors: colorSet7,
    action: placeRandomDivs,
    mouseEnabled: false,
    mouseAction: null,
  },
  config2: {
    rows: 100,
    columns: 150,
    borderColor: "#000",
    numDivs: 60,
    characterSet: obscureCharacters,
    itemColors: colorSet9,
    action: moveLineDivsHorizontally,
    mouseEnabled: false,
    mouseAction: null,
  },
  config3: {
    rows: 200,
    columns: 100,
    borderColor: "#000",
    numDivs: 20,
    characterSet: obscureCharacters,
    itemColors: colorSet4,
    action: moveCircleDivs,
    mouseEnabled: false,
    mouseAction: null,
  },
  config4: {
    rows: 100,
    columns: 100,
    borderColor: "black",
    numDivs: 20,
    characterSet: obscureCharacters,
    itemColors: colorSet2,
    action: moveLineDivsVertically,
    mouseEnabled: false,
    mouseAction: null,
  },
  config5: {
    rows: 80,
    columns: 80,
    borderColor: "black",
    numDivs: 10,
    characterSet: obscureCharacters,
    itemColors: colorSet4,
    action: null,
    mouseEnabled: true,
    mouseAction: mouseSquareDivs,
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

function moveLineDivsVertically(config) {
  const { rows, columns, numDivs, characterSet, itemColors } = config;
  const totalCells = rows * columns;
  let position = columns / 2;

  function move() {
    const existingItems = document.querySelectorAll(".random-item");
    existingItems.forEach((item) => item.remove());

    for (let i = 0; i < numDivs; i++) {
      const cellIndex = (position + i * columns) % totalCells;
      const randomCell = gridContainer.children[cellIndex];
      const randomDiv = document.createElement("div");
      randomDiv.className = "random-item";
      randomDiv.textContent =
        characterSet[Math.floor(Math.random() * characterSet.length)];
      randomDiv.style.backgroundColor =
        itemColors[Math.floor(Math.random() * itemColors.length)];
      randomCell.appendChild(randomDiv);
    }
    position = (position + columns) % totalCells;
  }

  clearInterval(intervalId);
  intervalId = setInterval(move, speed);
  move();
}

function mouseSquareDivs(config, e) {
  const { rows, columns, characterSet, itemColors } = config;
  const totalCells = rows * columns;
  const radius = 14;

  const existingItems = document.querySelectorAll(".random-item");
  existingItems.forEach((item) => item.remove());

  const rect = gridContainer.getBoundingClientRect();
  const mouseX = Math.floor(((e.clientX - rect.left) / rect.width) * columns);
  const mouseY = Math.floor(((e.clientY - rect.top) / rect.height) * rows);

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const x = mouseX + dx;
      const y = mouseY + dy;
      const cellIndex = y * columns + x;

      if (
        x >= 0 &&
        x < columns &&
        y >= 0 &&
        y < rows &&
        cellIndex >= 0 &&
        cellIndex < totalCells
      ) {
        const randomCell = gridContainer.children[cellIndex];
        const randomDiv = document.createElement("div");
        randomDiv.className = "random-item";
        randomDiv.textContent =
          characterSet[Math.floor(Math.random() * characterSet.length)];
        randomDiv.style.backgroundColor =
          itemColors[Math.floor(Math.random() * itemColors.length)];
        randomCell.appendChild(randomDiv);
      }
    }
  }
}

function clearMouseListeners() {
  gridContainer.onmousemove = null;
  gridContainer.onmouseleave = null;
}

function updateGrid() {
  const config = configs[currentConfig];

  clearInterval(intervalId);
  clearMouseListeners();
  gridContainer.innerHTML = "";

  createGrid(config);
  if (config.action) {
    config.action(config);
  }

  if (config.mouseEnabled && config.mouseAction) {
    gridContainer.onmousemove = (e) => config.mouseAction(config, e);
    gridContainer.onmouseleave = () => {
      const existingItems = document.querySelectorAll(".random-item");
      existingItems.forEach((item) => item.remove());
    };
  }
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
