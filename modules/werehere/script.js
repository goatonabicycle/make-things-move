(async function () {
  class WeAreHereModule {
    constructor() {
      this.container = null;

      this.config = {
        grid: {
          rows: { value: 80, min: 20, max: 150, step: 5, label: 'Rows' },
          columns: { value: 80, min: 20, max: 150, step: 5, label: 'Columns' }
        },
        interaction: {
          radius: { value: 14, min: 3, max: 30, step: 1, label: 'Effect Radius' },
          fadeOutSpeed: { value: 2000, min: 0, max: 10000, step: 100, label: 'Fade Out (ms)' },
          clearOnLeave: { value: true, type: 'boolean', label: 'Clear On Leave' }
        },
        appearance: {
          fontSize: { value: 1, min: 0.5, max: 3, step: 0.1, label: 'Font Size' },
          useGreek: { value: true, type: 'boolean', label: 'Greek Letters' },
          useLatin: { value: true, type: 'boolean', label: 'Latin Letters' },
          colorCount: { value: 5, min: 1, max: 10, step: 1, label: 'Colors' }
        },
        effects: {
          pulse: { value: true, type: 'boolean', label: 'Pulse Effect' },
          shadow: { value: true, type: 'boolean', label: 'Shadow Effect' },
          rotation: { value: false, type: 'boolean', label: 'Rotation' }
        }
      };

      this.characters = {
        greek: ["Ω", "λ", "δ", "ψ", "π", "ξ", "η", "θ", "ζ", "χ", "φ", "β", "μ", "τ", "γ", "κ"],
        latin: ["-", "X", "V", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
          "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
      };

      this.baseColors = [
        "#FF6347", "#40E0D0", "#DAA520", "#FF69B4", "#BA55D3",
        "#00BFFF", "#7CFC00", "#FF8C00", "#9932CC", "#00FA9A"
      ];
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    getAvailableCharacters() {
      let chars = [];
      if (this.config.appearance.useGreek.value) chars = chars.concat(this.characters.greek);
      if (this.config.appearance.useLatin.value) chars = chars.concat(this.characters.latin);
      return chars.length ? chars : ["-"];
    }

    getAvailableColors() {
      return this.baseColors.slice(0, this.config.appearance.colorCount.value);
    }

    createGrid() {
      this.container = document.getElementById("grid-container");
      if (!this.container) {
        console.error("Container not found!");
        return;
      }

      this.container.innerHTML = "";
      this.container.style.gridTemplateRows = `repeat(${this.config.grid.rows.value}, 1fr)`;
      this.container.style.gridTemplateColumns = `repeat(${this.config.grid.columns.value}, 1fr)`;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.config.grid.rows.value * this.config.grid.columns.value; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item";
        fragment.appendChild(cell);
      }
      this.container.appendChild(fragment);
    }

    mouseInteraction(e) {
      const rows = this.config.grid.rows.value;
      const columns = this.config.grid.columns.value;
      const totalCells = rows * columns;
      const radius = this.config.interaction.radius.value;
      const availableChars = this.getAvailableCharacters();
      const availableColors = this.getAvailableColors();
      const fadeOutSpeed = this.config.interaction.fadeOutSpeed.value;
      const enablePulse = this.config.effects.pulse.value;
      const enableShadow = this.config.effects.shadow.value;
      const enableRotation = this.config.effects.rotation.value;

      const rect = this.container.getBoundingClientRect();
      const mouseX = Math.floor(((e.clientX - rect.left) / rect.width) * columns);
      const mouseY = Math.floor(((e.clientY - rect.top) / rect.height) * rows);

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const x = mouseX + dx;
          const y = mouseY + dy;
          const cellIndex = y * columns + x;

          if (x >= 0 && x < columns && y >= 0 && y < rows && cellIndex >= 0 && cellIndex < totalCells) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= radius) {
              const randomCell = this.container.children[cellIndex];

              const existingItem = randomCell.querySelector('.random-item');
              if (existingItem) {
                existingItem.remove();
              }

              const randomDiv = document.createElement("div");
              randomDiv.className = "random-item";
              randomDiv.textContent = availableChars[this.getRandomInt(availableChars.length)];
              randomDiv.style.backgroundColor = availableColors[this.getRandomInt(availableColors.length)];
              randomDiv.style.fontSize = `${this.config.appearance.fontSize.value}rem`;

              if (enablePulse) {
                randomDiv.classList.add("pulse-effect");
              }

              if (enableShadow) {
                randomDiv.style.boxShadow = `0 0 10px ${availableColors[this.getRandomInt(availableColors.length)]}`;
              }

              if (enableRotation) {
                randomDiv.style.transform = `rotate(${this.getRandomInt(360)}deg)`;
              }

              const intensity = 1 - (distance / radius);
              randomDiv.style.opacity = intensity;

              randomCell.appendChild(randomDiv);

              if (fadeOutSpeed > 0) {
                setTimeout(() => {
                  if (randomDiv.parentNode) {
                    randomDiv.classList.add("fade-out");
                    setTimeout(() => {
                      if (randomDiv.parentNode) {
                        randomDiv.remove();
                      }
                    }, 300);
                  }
                }, fadeOutSpeed * intensity);
              }
            }
          }
        }
      }
    }

    clearItems() {
      if (this.config.interaction.clearOnLeave.value) {
        const existingItems = this.container.querySelectorAll(".random-item");
        existingItems.forEach((item) => {
          item.classList.add("fade-out");
          setTimeout(() => {
            if (item.parentNode) {
              item.remove();
            }
          }, 300);
        });
      }
    }

    init() {
      this.createGrid();
      this.container.addEventListener("mousemove", this.mouseInteraction.bind(this));
      this.container.addEventListener("mouseleave", this.clearItems.bind(this));
    }

    onConfigUpdate() {
      const existingItems = this.container.querySelectorAll(".random-item");
      existingItems.forEach((item) => item.remove());

      this.createGrid();

      this.container.removeEventListener("mousemove", this.mouseInteraction);
      this.container.removeEventListener("mouseleave", this.clearItems);
      this.container.addEventListener("mousemove", this.mouseInteraction.bind(this));
      this.container.addEventListener("mouseleave", this.clearItems.bind(this));
    }

    cleanup() {
      if (this.container) {
        this.container.removeEventListener("mousemove", this.mouseInteraction);
        this.container.removeEventListener("mouseleave", this.clearItems);
        this.container.innerHTML = '';
      }
    }
  }

  const moduleManager = new ModuleManager();
  await moduleManager.init(WeAreHereModule);
})();