(async function () {
  class CustomModule {
    constructor() {
      this.container = null;

      this.config = {
        things: {
          count: { value: 200, min: 10, max: 500, step: 10, label: 'Count' },
          size: { value: 600, min: 100, max: 1000, step: 50, label: 'Size' }
        },
      };
    }

    doThings() {
      console.log("Doing things");
    }

    init() {
      this.container = document.getElementById("animationContainer");
      if (!this.container) {
        console.error("Container not found!");
        return;
      }
      doThings();
    }

    onConfigUpdate() {
      doThings();
    }

    clearShapes() {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
  }


  const moduleManager = new ModuleManager();
  await moduleManager.init(CustomModule);
})();