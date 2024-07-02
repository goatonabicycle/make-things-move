(function () {
  const gridContainer = document.getElementById("grid-container");
  const speedInput = 50;

  const obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];

  const colorSet = ["#2E8B57", "#3CB371", "#20B2AA", "#66CDAA", "#8FBC8F"];

  const config = {
    rows: 100,
    columns: 150,
    borderColor: "#000",
    numDivs: 60,
    characterSet: obscureCharacters,
    itemColors: colorSet,
    action: moveLineDivsHorizontally,
    mouseEnabled: false,
    mouseAction: null,
    intervalId: null
  };

  function createGrid({ rows, columns }) {
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < rows * columns; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-item";
      fragment.appendChild(cell);
    }
    gridContainer.appendChild(fragment);
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
        randomDiv.textContent = characterSet[Math.floor(Math.random() * characterSet.length)];
        randomDiv.style.backgroundColor = itemColors[Math.floor(Math.random() * itemColors.length)];
        randomCell.appendChild(randomDiv);
      }
      position = (position + 1) % totalCells;
    }

    clearInterval(config.intervalId);
    config.intervalId = setInterval(move, speedInput);
    move();
  }

  createGrid(config);
  config.action(config);
})();
