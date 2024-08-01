document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".button-container button");

  const loadModule = (moduleName) => {
    window.location.href = `?m=${moduleName}`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const moduleName = button.getAttribute("data-module");
      loadModule(moduleName);
    });
  });

  const loadModuleContent = async (moduleName) => {
    const moduleContent = document.getElementById("module-content");

    moduleContent.innerHTML = "";

    const html = await fetch(`modules/${moduleName}/index.html`).then((res) => res.text());
    moduleContent.innerHTML = html;

    const script = document.createElement("script");
    script.src = `modules/${moduleName}/script.js`;
    script.id = "module-script";
    moduleContent.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `modules/${moduleName}/style.css`;
    link.id = "module-style";
    document.head.appendChild(link);

    buttons.forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-module") === moduleName) {
        button.classList.add("active");
      }
    });
  };

  const urlParams = new URLSearchParams(window.location.search);
  const initialModule = urlParams.get("m");
  if (initialModule) {
    loadModuleContent(initialModule);
  }

  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.module) {
      loadModuleContent(event.state.module);
    }
  });
});
