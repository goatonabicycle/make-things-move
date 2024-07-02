(function () {
  const gridContainer = document.getElementById("grid-container");
  const speedInput = 500;

  const colors = ["#8F8CE7", "#FF8C00", "#DC143C", "#D8DCD6", "#42B395", "#FF81C0", "#4B0082", "#7FFF00"];

  const generateObscureCharacters = () => {
    const greekLetters = ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ"];
    const latinLetters = ["-", "X", "V", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    return [...greekLetters, ...latinLetters];
  };

  const config = {
    rows: 50,
    columns: 50,
    numDivs: 50,
    characterSet: generateObscureCharacters(),
    itemColors: colors,
    action: function (gridContainer, config, speed) {
      const totalCells = config.rows * config.columns;

      const move = () => {
        const existingItems = gridContainer.querySelectorAll(".random-item");
        existingItems.forEach((item) => item.remove());

        for (let i = 0; i < config.numDivs; i++) {
          const randomCellIndex = getRandomInt(totalCells);
          const randomCell = gridContainer.children[randomCellIndex];
          const randomDiv = document.createElement("div");
          randomDiv.className = "random-item";
          randomDiv.textContent = config.characterSet[getRandomInt(config.characterSet.length)];
          randomDiv.style.backgroundColor = config.itemColors[getRandomInt(config.itemColors.length)];
          randomCell.appendChild(randomDiv);
        }
      };

      clearInterval(config.intervalId);
      config.intervalId = setInterval(move, speed);
      move();
    },
    mouseEnabled: false,
    mouseAction: null,
    intervalId: null
  };

  const createGrid = ({ rows, columns }) => {
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
  };

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  createGrid(config);
  config.action(gridContainer, config, speedInput);
})();
