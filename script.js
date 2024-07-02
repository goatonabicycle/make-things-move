document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".button-container button");
  const moduleContent = document.getElementById("module-content");

  const loadModule = async (moduleName) => {
    moduleContent.innerHTML = "";

    const existingScript = document.getElementById("module-script");
    if (existingScript) {
      existingScript.remove();
    }
    const existingLink = document.getElementById("module-style");
    if (existingLink) {
      existingLink.remove();
    }

    const html = await fetch(`modules/${moduleName}/index.html`).then((res) =>
      res.text()
    );
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

    history.pushState({ module: moduleName }, "", `?m=${moduleName}`);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const moduleName = button.getAttribute("data-module");
      loadModule(moduleName);
    });
  });

  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.module) {
      loadModule(event.state.module);
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const initialModule = urlParams.get("m");
  if (initialModule) {
    loadModule(initialModule);
  }
});
