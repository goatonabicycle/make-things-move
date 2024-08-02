(function () {
  const checkboxContainer = document.getElementById("checkboxContainer");

  const numberOfCheckboxes = 47;
  const timeout = 100;

  const checkLeftAndRight = (clickedCheckboxIndex, direction) => {
    setTimeout(() => {
      const currentCheckbox = document.getElementById("checkbox" + clickedCheckboxIndex);
      currentCheckbox.checked = false;

      if (direction === "left") {
        const oneLeftIndex = clickedCheckboxIndex - 1;
        if (oneLeftIndex >= 0) {
          const leftCheckbox = document.getElementById("checkbox" + oneLeftIndex);
          leftCheckbox.checked = true;
          checkLeftAndRight(oneLeftIndex, "left");
        }
      } else if (direction === "right") {
        const oneRightIndex = clickedCheckboxIndex + 1;
        if (oneRightIndex < numberOfCheckboxes) {
          const rightCheckbox = document.getElementById("checkbox" + oneRightIndex);
          rightCheckbox.checked = true;
          checkLeftAndRight(oneRightIndex, "right");
        }
      }
    }, timeout);
  };

  const middleOut = (e) => {
    const clickedCheckboxIndex = parseInt(e.target.id.split("checkbox")[1]);
    checkLeftAndRight(clickedCheckboxIndex, "left");
    checkLeftAndRight(clickedCheckboxIndex, "right");
  };

  for (let i = 0; i < numberOfCheckboxes; i++) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "checkbox" + i;

    checkbox.addEventListener("change", middleOut);

    checkboxContainer.appendChild(checkbox);
  }
})();
