document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".module-nav button");

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

    try {
      moduleContent.innerHTML = "";

      const oldScript = document.getElementById("module-script");
      const oldStyle = document.getElementById("module-style");

      if (window.cleanup) {
        window.cleanup();
      }

      if (oldScript) oldScript.remove();
      if (oldStyle) oldStyle.remove();

      const configScript = document.createElement("script");
      configScript.src = "/configPanel.js";
      await new Promise((resolve) => {
        configScript.onload = resolve;
        document.body.appendChild(configScript);
      });

      const html = await fetch(`modules/${moduleName}/index.html`).then(res => res.text());
      moduleContent.innerHTML = html;

      const script = document.createElement("script");
      script.src = `modules/${moduleName}/script.js?v=${Date.now()}`;
      script.id = "module-script";
      document.body.appendChild(script);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `modules/${moduleName}/style.css?v=${Date.now()}`;
      link.id = "module-style";
      document.head.appendChild(link);

      buttons.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-module") === moduleName);
      });

    } catch (error) {
      console.error(error);
      moduleContent.innerHTML = `<div class="default">Failed to load module: ${moduleName}</div>`;
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const initialModule = urlParams.get("m");
  if (initialModule) {
    loadModuleContent(initialModule);
  }
});