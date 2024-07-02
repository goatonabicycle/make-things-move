(function () {
  const gridContainer = document.getElementById("grid-container");
  const speed = 100;

  const obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];
  const itemColors = ["#2E8B57", "#3CB371", "#BDF8A3", "#33B864", "#66CDAA", "#8FBC8F", "#044A05"];

  const rows = 10;
  const columns = 25;
  const numDivs = 10;
  let intervalId = null;

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  function createGrid() {
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

  function moveLineDivsHorizontally() {
    const totalCells = rows * columns;
    let position = 0;
    let rowOffset = 0;

    function move() {
      const existingItems = gridContainer.querySelectorAll(".random-item");
      existingItems.forEach((item) => item.remove());

      for (let i = 0; i < numDivs; i++) {
        let cellIndex = (position + i + rowOffset * columns) % totalCells;
        if (cellIndex < 0) cellIndex += totalCells;
        const randomCell = gridContainer.children[cellIndex];
        const randomDiv = document.createElement("div");
        randomDiv.className = "random-item";
        randomDiv.textContent = obscureCharacters[getRandomInt(obscureCharacters.length)];
        randomDiv.style.backgroundColor = itemColors[getRandomInt(itemColors.length)];
        randomCell.appendChild(randomDiv);
      }
      position = (position + 1) % columns;
      if (position === 0) {
        rowOffset = (rowOffset + 1) % rows;
      }
    }

    clearInterval(intervalId);
    intervalId = setInterval(move, speed);
    move();
  }

  createGrid();
  moveLineDivsHorizontally();
})();
