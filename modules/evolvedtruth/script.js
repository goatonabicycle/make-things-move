(function () {
  const checkboxContainer = document.getElementById("checkboxContainer");

  checkboxContainer.style.position = "relative";
  checkboxContainer.style.display = "flex";
  checkboxContainer.style.justifyContent = "center";
  checkboxContainer.style.alignItems = "center";
  checkboxContainer.style.height = "100vh";
  checkboxContainer.style.width = "100vw";
  checkboxContainer.style.overflow = "hidden";
  checkboxContainer.style.backgroundColor = "#1a1a1a";

  checkboxContainer.innerHTML = "";

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.width = "400px";
  container.style.height = "400px";
  container.style.left = "50%";
  container.style.top = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  checkboxContainer.appendChild(container);

  const count = 30;
  const size = 15;
  const midPos = (count * size) / 2;

  const createCheckbox = (id, top, left) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.style.position = "absolute";
    checkbox.style.margin = "0";
    checkbox.style.width = size + "px";
    checkbox.style.height = size + "px";
    checkbox.style.top = top + "px";
    checkbox.style.left = left + "px";
    checkbox.style.appearance = "none";
    checkbox.style.backgroundColor = "#2b2b2b";
    checkbox.style.borderRadius = "5px";
    checkbox.style.cursor = "pointer";
    checkbox.style.transition = "all 0.2s ease";
    checkbox.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
    checkbox.style.border = "2px solid #444";
    checkbox.style.zIndex = "1";

    checkbox.onclick = function (e) {
      e.preventDefault();
      return false;
    };

    container.appendChild(checkbox);
    return checkbox;
  };

  const middle = createCheckbox("middle", midPos - size / 2, midPos - size / 2);

  middle.style.backgroundColor = "#e74c3c";
  middle.style.border = "2px solid #c0392b";
  middle.style.transform = "scale(1.3)";
  middle.style.zIndex = "10";
  middle.style.boxShadow = "0 0 10px rgba(231,76,60,0.5)";

  middle.onclick = function (e) {
    e.preventDefault();
    createRippleEffect();
    return false;
  };

  const topBoxes = [];
  const bottomBoxes = [];
  const leftBoxes = [];
  const rightBoxes = [];

  for (let i = 1; i <= count; i++) {
    const offset = i * size;

    topBoxes.push(createCheckbox(`top${i}`, midPos - size - offset, midPos - size / 2));
    bottomBoxes.push(createCheckbox(`bottom${i}`, midPos + offset, midPos - size / 2));
    leftBoxes.push(createCheckbox(`left${i}`, midPos - size / 2, midPos - size - offset));
    rightBoxes.push(createCheckbox(`right${i}`, midPos - size / 2, midPos + offset));
  }

  function createRippleEffect() {
    middle.checked = true;
    middle.style.backgroundColor = "#e74c3c";
    middle.style.boxShadow = "0 0 20px rgba(231,76,60,0.9)";
    middle.style.transform = "scale(1.4)";

    rippleDirection(topBoxes);
    rippleDirection(bottomBoxes);
    rippleDirection(leftBoxes);
    rippleDirection(rightBoxes);

    setTimeout(() => {
      middle.checked = false;
      middle.style.boxShadow = "0 0 15px rgba(231,76,60,0.5)";
      middle.style.transform = "scale(1.3)";
    }, 300);
  }

  function rippleDirection(boxes) {
    let index = 0;

    function setNextBox() {
      if (index > 0) {
        boxes[index - 1].checked = false;
        boxes[index - 1].style.backgroundColor = "#2b2b2b";
        boxes[index - 1].style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
        boxes[index - 1].style.transform = "scale(1)";
      }

      if (index < boxes.length) {
        boxes[index].checked = true;
        boxes[index].style.backgroundColor = "#8e44ad";
        boxes[index].style.boxShadow = "0 0 12px rgba(142,68,173,0.8)";
        boxes[index].style.transform = "scale(1.15)";

        index++;
        setTimeout(setNextBox, 60);
      } else {
        if (boxes.length > 0) {
          boxes[boxes.length - 1].checked = false;
          boxes[boxes.length - 1].style.backgroundColor = "#2b2b2b";
          boxes[boxes.length - 1].style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
          boxes[boxes.length - 1].style.transform = "scale(1)";
        }
      }
    }

    setTimeout(setNextBox, 100);
  }
})();
