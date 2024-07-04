(function () {
  const gridContainer = document.getElementById("grid-container");
  const obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];
  const itemColors = ["#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3"];

  const rows = 80;
  const columns = 80;
  const numDivs = 10;
  const radius = 14;

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

  function mouseSquareDivs(e) {
    const totalCells = rows * columns;

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

        if (x >= 0 && x < columns && y >= 0 && y < rows && cellIndex >= 0 && cellIndex < totalCells) {
          const randomCell = gridContainer.children[cellIndex];
          const randomDiv = document.createElement("div");
          randomDiv.className = "random-item";
          randomDiv.textContent = obscureCharacters[Math.floor(Math.random() * obscureCharacters.length)];
          randomDiv.style.backgroundColor = itemColors[Math.floor(Math.random() * itemColors.length)];
          randomCell.appendChild(randomDiv);
        }
      }
    }
  }

  function clearMouseListeners() {
    gridContainer.onmousemove = null;
    gridContainer.onmouseleave = null;
  }

  function init() {
    createGrid();
    gridContainer.onmousemove = mouseSquareDivs;
    gridContainer.onmouseleave = () => {
      const existingItems = document.querySelectorAll(".random-item");
      existingItems.forEach((item) => item.remove());
    };
  }

  init();
})();
