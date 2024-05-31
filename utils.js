export function applyInitialState(element, state) {
  for (const [key, value] of Object.entries(state)) {
    element.style[key] = value;
  }
}

export function createElements(config) {
  config.forEach((item) => {
    const element = document.createElement("div");
    element.id = item.id;
    element.classList.add("centered-text");
    element.innerHTML = `<div>${item.content || ""}</div>`;
    applyInitialState(element, item.initialState);
    document.body.appendChild(element);
  });
}

export function applyStyles(element, styles) {
  for (const [key, value] of Object.entries(styles)) {
    element.style[key] = value;
  }
}
