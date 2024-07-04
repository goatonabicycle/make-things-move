(function () {
  const gridContainer = document.getElementById("grid-container");
  const speed = 50;

  const obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];
  const itemColors = ["#FF00FF", "#00FFFF", "#FFFF00", "#00FF00", "#FF69B4"];

  const rows = 100;
  const columns = 100;
  const numDivs = 20;
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

  function moveLineDivsVertically() {
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
        randomDiv.textContent = obscureCharacters[getRandomInt(obscureCharacters.length)];
        randomDiv.style.backgroundColor = itemColors[getRandomInt(itemColors.length)];
        randomCell.appendChild(randomDiv);
      }
      position = (position + columns) % totalCells;
    }

    clearInterval(intervalId);
    intervalId = setInterval(move, speed);
    move();
  }

  createGrid();
  moveLineDivsVertically();
})();
