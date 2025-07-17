(function () {
  const checkboxContainer = document.getElementById("checkboxContainer");

  const numberOfCheckboxes = 47;
  const timeout = 100;
  const middleIndex = Math.floor(numberOfCheckboxes / 2);

  checkboxContainer.style.position = "relative";
  checkboxContainer.style.display = "flex";
  checkboxContainer.style.justifyContent = "center";
  checkboxContainer.style.alignItems = "center";
  checkboxContainer.style.height = "100vh";
  checkboxContainer.style.width = "100vw";

  const horizontalContainer = document.createElement("div");
  horizontalContainer.style.display = "flex";
  horizontalContainer.style.position = "absolute";

  const verticalContainer = document.createElement("div");
  verticalContainer.style.display = "flex";
  verticalContainer.style.flexDirection = "column";
  verticalContainer.style.position = "absolute";

  checkboxContainer.appendChild(horizontalContainer);
  checkboxContainer.appendChild(verticalContainer);

  const checkInDirection = (clickedIndex, direction, isHorizontal) => {
    setTimeout(() => {
      const currentCheckbox = document.getElementById(`checkbox${isHorizontal ? 'h'
        : 'v'}${clickedIndex}`);
      if (currentCheckbox) {
        currentCheckbox.checked = false;
      }

      if (clickedIndex === middleIndex) {
        triggerPerpendicularWave(isHorizontal);
      }

      const nextIndex = direction === "left" || direction === "up" ? clickedIndex -
        1 : clickedIndex + 1;

      if (nextIndex >= 0 && nextIndex < numberOfCheckboxes) {
        const nextCheckbox = document.getElementById(`checkbox${isHorizontal ? 'h' :
          'v'}${nextIndex}`);
        if (nextCheckbox) {
          nextCheckbox.checked = true;
          checkInDirection(nextIndex, direction, isHorizontal);
        }
      }
    }, timeout);
  };

  const triggerPerpendicularWave = (wasHorizontal) => {
    setTimeout(() => {
      checkInDirection(middleIndex, "up", !wasHorizontal);
      checkInDirection(middleIndex, "down", !wasHorizontal);
    }, 50);
  };

  const handleClick = (e) => {
    const isHorizontal = e.target.id.includes('h');
    const clickedIndex = parseInt(e.target.id.match(/\d+/)[0]);

    if (clickedIndex === middleIndex) {
      checkInDirection(clickedIndex, "left", true);
      checkInDirection(clickedIndex, "right", true);
      checkInDirection(clickedIndex, "up", false);
      checkInDirection(clickedIndex, "down", false);
    } else if (isHorizontal) {
      checkInDirection(clickedIndex, "left", true);
      checkInDirection(clickedIndex, "right", true);
    } else {
      checkInDirection(clickedIndex, "up", false);
      checkInDirection(clickedIndex, "down", false);
    }
  };

  for (let i = 0; i < numberOfCheckboxes; i++) {
    const hCheckbox = document.createElement("input");
    hCheckbox.type = "checkbox";
    hCheckbox.id = `checkboxh${i}`;
    hCheckbox.addEventListener("change", handleClick);
    horizontalContainer.appendChild(hCheckbox);

    if (i !== middleIndex) {
      const vCheckbox = document.createElement("input");
      vCheckbox.type = "checkbox";
      vCheckbox.id = `checkboxv${i}`;
      vCheckbox.addEventListener("change", handleClick);
      verticalContainer.appendChild(vCheckbox);
    }
  }
})();