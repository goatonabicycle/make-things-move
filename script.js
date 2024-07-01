document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".button-container button");
  const moduleContent = document.getElementById("module-content");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const moduleName = button.getAttribute("data-module");
      const html = await fetch(`modules/${moduleName}/index.html`).then((res) =>
        res.text()
      );
      moduleContent.innerHTML = html;
      const script = document.createElement("script");
      script.src = `modules/${moduleName}/script.js`;
      moduleContent.appendChild(script);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `modules/${moduleName}/style.css`;
      document.head.appendChild(link);
    });
  });
});
