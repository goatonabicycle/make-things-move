document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".module-nav button");
  const navScroll = document.querySelector(".nav-scroll");

  const loadModule = (moduleName) => {

    window.history.pushState({ module: moduleName }, '', `?m=${moduleName}`);
    loadModuleContent(moduleName);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const moduleName = button.getAttribute("data-module");
      loadModule(moduleName);
    });
  });

  const loadModuleContent = async (moduleName) => {
    const moduleContent = document.getElementById("module-content");
    moduleContent.classList.add("loading");

    try {
      moduleContent.innerHTML = "";

      if (window.cleanup) {
        window.cleanup();
      }

      const oldScript = document.getElementById("module-script");
      const oldStyle = document.getElementById("module-style");
      if (oldScript) oldScript.remove();
      if (oldStyle) oldStyle.remove();

      await Promise.all([
        loadScript("/configPanel.js"),
        loadScript("/moduleManager.js")
      ]);

      const html = await fetch(`modules/${moduleName}/index.html`).then(res => res.text());
      moduleContent.innerHTML = `<div class="module-frame">${html}</div>`;

      await loadScript(`modules/${moduleName}/script.js?v=${Date.now()}`);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `modules/${moduleName}/style.css?v=${Date.now()}`;
      link.id = "module-style";
      document.head.appendChild(link);

      buttons.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-module") === moduleName);
      });

    } catch (error) {
      moduleContent.innerHTML = `
        <div class="error-container">
          <div class="error-message">
            <h3>Failed to load module: ${moduleName}</h3>
            <button onclick="location.reload()" class="retry-button">Retry</button>
          </div>
        </div>
      `;
    } finally {
      moduleContent.classList.remove("loading");
    }
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialModule = urlParams.get("m");
  if (initialModule) {
    loadModuleContent(initialModule);
  }
});