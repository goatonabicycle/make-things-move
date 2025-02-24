class ModuleManager {
  constructor() {
    this.panel = null;
    this.config = null;
    this.module = null;
    this.cleanup = this.cleanup.bind(this);
  }

  async init(ModuleClass) {
    this.cleanup();
    this.module = new ModuleClass();

    if (this.module.config) {
      this.panel = new ConfigPanel(this.module.config, () => {
        if (this.module.onConfigUpdate) {
          this.module.onConfigUpdate();
        }
      });
    }

    if (this.module.init) {
      await this.module.init();
    }

    window.addEventListener('beforeunload', this.cleanup);
  }

  cleanup() {
    if (this.panel) {
      this.panel.destroy();
      this.panel = null;
    }

    if (this.module && this.module.cleanup) {
      this.module.cleanup();
    }

    window.removeEventListener('beforeunload', this.cleanup);
  }
}

window.ModuleManager = ModuleManager;