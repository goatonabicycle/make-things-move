class ConfigPanel {
  constructor(config, onChange = () => { }) {
    this.config = config;
    this.onChange = onChange;
    this.panel = null;
    this.toggleButton = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!document.getElementById('config-panel-styles')) {
      const style = document.createElement('style');
      style.id = 'config-panel-styles';
      style.textContent = `
        .config-toggle {
          position: fixed;
          left: 16px;
          bottom: 16px;
          width: 40px;
          height: 40px;
          background: var(--accent, #7c3aed);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        }

        .config-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        }

        .config-toggle.active {
          background: var(--bg-header, #141414);
          border: 2px solid var(--accent, #7c3aed);
        }

        .config-toggle svg {
          width: 20px;
          height: 20px;
          fill: white;
          transition: transform 0.2s ease;
        }

        .config-toggle.active svg {
          fill: var(--accent, #7c3aed);
          transform: rotate(45deg);
        }

        .config-panel {
          position: fixed;
          left: 16px;
          bottom: 65px;
          background: rgba(20, 20, 20, 0.95);
          padding: 12px;    
          color: #fff;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          font-size: 11px;
          width: 240px;
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(20px);
          z-index: 1000;
          transform: translateY(10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .config-panel.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .config-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 4px;
        }

        .config-panel-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
        }

        .config-panel input[type="range"] {
          -webkit-appearance: none;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          outline: none;
          width: 100%;
          height: 4px;
          margin-top: 4px;
          margin-bottom: 2px;
          cursor: pointer;
        }

        .config-panel input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: var(--accent, #7c3aed);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .config-panel input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .config-panel input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--accent, #7c3aed);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .config-panel input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
        }

        .config-panel input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: var(--accent, #7c3aed);
          cursor: pointer;
        }

        .config-panel section {
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .config-panel .section-title {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary, #a0a0a0);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .config-panel .control-container {
          margin-bottom: 10px;
        }

        .config-panel .control-container:last-child {
          margin-bottom: 0;
        }

        .config-panel .control-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .config-panel label {
          font-size: 11px;
          color: var(--text-primary, #ffffff);
          font-weight: 500;
        }

        .config-panel .value-display {
          font-size: 10px;
          color: var(--accent, #7c3aed);
          font-weight: 600;
          background: rgba(124, 58, 237, 0.1);
          padding: 1px 6px;
          border-radius: 3px;
        }

        .config-panel::-webkit-scrollbar {
          width: 4px;
        }

        .config-panel::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .config-panel::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .config-panel::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .config-panel {
            width: calc(100vw - 32px);
            left: 16px;
            right: 16px;
            max-height: 40vh;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Create toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'config-toggle';
    this.toggleButton.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/>
      </svg>
    `;
    this.toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Create panel
    this.panel = document.createElement('div');
    this.panel.className = 'config-panel';
    this.panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Add header
    const header = document.createElement('div');
    header.className = 'config-panel-header';
    
    const title = document.createElement('div');
    title.className = 'config-panel-title';
    title.textContent = 'Configuration';
    
    header.appendChild(title);
    this.panel.appendChild(header);

    // Add controls
    Object.entries(this.config).forEach(([category, params]) => {
      const section = document.createElement('section');

      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'section-title';
      sectionTitle.textContent = category;
      section.appendChild(sectionTitle);

      Object.entries(params).forEach(([key, setting]) => {
        const container = document.createElement('div');
        container.className = 'control-container';

        const controlHeader = document.createElement('div');
        controlHeader.className = 'control-header';

        const label = document.createElement('label');
        label.textContent = setting.label;

        const value = document.createElement('span');
        value.className = 'value-display';

        controlHeader.appendChild(label);
        controlHeader.appendChild(value);
        container.appendChild(controlHeader);

        if (setting.type === 'boolean') {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = setting.value;
          value.textContent = setting.value ? 'ON' : 'OFF';

          checkbox.onchange = () => {
            setting.value = checkbox.checked;
            value.textContent = checkbox.checked ? 'ON' : 'OFF';
            this.onChange(this.config);
          };

          container.appendChild(checkbox);
        } else {
          const slider = document.createElement('input');
          slider.type = 'range';
          slider.min = setting.min;
          slider.max = setting.max;
          slider.step = setting.step;
          slider.value = setting.value;

          value.textContent = setting.value;

          slider.oninput = () => {
            setting.value = parseFloat(slider.value);
            value.textContent = Number(slider.value).toFixed(1);
            this.onChange(this.config);
          };

          container.appendChild(slider);
        }

        section.appendChild(container);
      });

      this.panel.appendChild(section);
    });

    document.body.appendChild(this.toggleButton);
    document.body.appendChild(this.panel);

    // Add click outside listener
    this.clickOutsideHandler = (e) => {
      if (this.isOpen && !this.panel.contains(e.target) && !this.toggleButton.contains(e.target)) {
        this.toggle();
      }
    };
    document.addEventListener('click', this.clickOutsideHandler);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.toggleButton.classList.toggle('active', this.isOpen);
    this.panel.classList.toggle('open', this.isOpen);
  }

  destroy() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
    if (this.toggleButton) {
      this.toggleButton.remove();
      this.toggleButton = null;
    }
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler);
    }
  }
}

window.ConfigPanel = ConfigPanel;