(function () {
  "use strict";

  const gridContainer = document.getElementById("grid-container");
  const speed = 50;

  const obscureCharacters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ", "-", "X", "V"];
  const itemColors = ["#FF4500", "#1E90FF", "#32CD32", "#FFD700", "#8A2BE2"];

  const rows = 200;
  const columns = 100;
  const numDivs = 20;
  let animationFrameId = null;

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

  function moveCircleDivs() {
    const totalCells = rows * columns;
    const centerX = Math.floor(columns / 2);
    const centerY = Math.floor(rows / 2);
    const radius = Math.min(centerX, centerY) - 1;

    let angle = 0;
    const cells = gridContainer.children;

    function move() {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < numDivs; i++) {
        const currentAngle = angle + i * ((2 * Math.PI) / numDivs);
        const x = centerX + Math.floor(radius * Math.cos(currentAngle));
        const y = centerY + Math.floor(radius * Math.sin(currentAngle));
        const cellIndex = y * columns + x;

        if (cells[cellIndex]) {
          const randomDiv = document.createElement("div");
          randomDiv.className = "random-item";
          randomDiv.textContent = obscureCharacters[getRandomInt(obscureCharacters.length)];
          randomDiv.style.backgroundColor = itemColors[getRandomInt(itemColors.length)];
          fragment.appendChild(randomDiv);
          cells[cellIndex].appendChild(fragment);
        }
      }
      angle += 0.1;
      animationFrameId = requestAnimationFrame(move);
    }

    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(move);
  }

  createGrid();
  moveCircleDivs();
})();
