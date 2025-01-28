(function () {
  const rows = 10;
  const columns = 25;
  const numDivs = 10;
  const speed = 100;
  const obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];

  const gridContainer = document.getElementById("grid-container");

  const getRandomInt = (max) => Math.floor(Math.random() * max);
  const getRandomArrayItem = (array) => array[getRandomInt(array.length)];
  const getRandomColor = () => {
    const r = getRandomInt(256);
    const g = getRandomInt(256);
    const b = getRandomInt(256);
    return `rgb(${r}, ${g}, ${b})`;
  };

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
    let position = 0;
    let rowOffset = 0;
    let lastTime = 0;

    function move(timestamp) {
      if (timestamp - lastTime >= speed) {
        lastTime = timestamp;

        const existingItems = gridContainer.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        for (let i = 0; i < numDivs; i++) {
          const cellIndex = (position + i + rowOffset * columns) % (rows * columns);
          const randomCell = gridContainer.children[cellIndex];
          const randomDiv = document.createElement("div");

          randomDiv.className = "random-item";
          randomDiv.textContent = getRandomArrayItem(obscureCharacters);
          randomDiv.style.backgroundColor = getRandomColor(); // Dynamic color

          randomCell.appendChild(randomDiv);
        }

        position = (position + 1) % columns;
        if (position === 0) {
          rowOffset = (rowOffset + 1) % rows;
        }
      }

      requestAnimationFrame(move);
    }

    requestAnimationFrame(move);
  }

  createGrid();
  moveLineDivsHorizontally();
})();