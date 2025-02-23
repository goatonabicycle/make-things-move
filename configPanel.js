
class ConfigPanel {
  constructor(config, onChange = () => { }) {
    this.config = config;
    this.onChange = onChange;
    this.panel = null;
    this.init();
  }

  init() {
    if (!document.getElementById('config-panel-styles')) {
      const style = document.createElement('style');
      style.id = 'config-panel-styles';
      style.textContent = `
        .config-panel {
          position: fixed;
          left: 0px;
          bottom: 0px;
          background: rgba(0,0,0,0.1);
          padding: 10px;    
          color: #fff;
          font-family: ui-monospace, monospace;
          max-height: 95vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: 10px;
          width: 300px;
          border:1px solid #7c3aed;
          border-top-right-radius: 8px;
          backdrop-filter: blur(8px);
        }

        .config-panel input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          outline: none;
          width: 100%;
          height: 12px;
          grid-column: span 2;
        }

        .config-panel input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #7c3aed;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .config-panel input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .config-panel input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #7c3aed;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .config-panel section {
          padding: 4px;
          background: rgba(0,0,0,0.2);
          border-radius: 4px;
        }

        .config-panel .section-title {
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 4px;
          margin-bottom: 6px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
        }

        .config-panel .control-container {
          display: grid;
          grid-template-columns: 1fr 30px;
          gap: 4px;
          margin-bottom: 4px;
        }

        .config-panel label {
          font-size: 11px;
          opacity: 0.8;
          cursor: pointer;
        }

        .config-panel .value-display {
          font-size: 10px;
          opacity: 0.8;
          text-align: right;          
        }

        .config-panel::-webkit-scrollbar {
          width: 6px;
        }
              
      `;
      document.head.appendChild(style);
    }

    this.panel = document.createElement('div');
    this.panel.className = 'config-panel';

    Object.entries(this.config).forEach(([category, params]) => {
      const section = document.createElement('section');

      const title = document.createElement('div');
      title.className = 'section-title';
      title.textContent = category.toLowerCase();
      section.appendChild(title);

      Object.entries(params).forEach(([key, setting]) => {
        const container = document.createElement('div');
        container.className = 'control-container';

        const label = document.createElement('label');
        label.textContent = setting.label.toLowerCase();

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = setting.min;
        slider.max = setting.max;
        slider.step = setting.step;
        slider.value = setting.value;

        const value = document.createElement('span');
        value.className = 'value-display';
        value.textContent = setting.value;

        slider.oninput = () => {
          setting.value = parseFloat(slider.value);
          value.textContent = Number(slider.value).toFixed(3);
          this.onChange(this.config);
        };

        container.appendChild(label);
        container.appendChild(value);
        container.appendChild(slider);
        section.appendChild(container);
      });

      this.panel.appendChild(section);
    });

    document.body.appendChild(this.panel);
  }

  destroy() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }

  getConfig() {
    return this.config;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigPanel;
}