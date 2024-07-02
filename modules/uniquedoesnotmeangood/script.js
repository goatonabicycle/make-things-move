(function () {
  const gridContainer = document.getElementById("grid-container");
  const speed = 500;

  const itemColors = ["#8F8CE7", "#FF8C00", "#DC143C", "#D8DCD6", "#42B395", "#FF81C0", "#4B0082", "#7FFF00"];
  const obscureCharacters = (() => {
    const greekLetters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ"];
    const latinLetters = ["-", "X", "V", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    return [...greekLetters, ...latinLetters];
  })();

  const rows = 50;
  const columns = 50;
  const numDivs = 50;
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

  function placeRandomDivs() {
    const totalCells = rows * columns;

    function move() {
      const existingItems = gridContainer.querySelectorAll(".random-item");
      existingItems.forEach((item) => item.remove());

      for (let i = 0; i < numDivs; i++) {
        const randomCellIndex = getRandomInt(totalCells);
        const randomCell = gridContainer.children[randomCellIndex];
        const randomDiv = document.createElement("div");
        randomDiv.className = "random-item";
        randomDiv.textContent = obscureCharacters[getRandomInt(obscureCharacters.length)];
        randomDiv.style.backgroundColor = itemColors[getRandomInt(itemColors.length)];
        randomCell.appendChild(randomDiv);
      }
    }

    clearInterval(intervalId);
    intervalId = setInterval(move, speed);
    move();
  }

  createGrid();
  placeRandomDivs();
})();
