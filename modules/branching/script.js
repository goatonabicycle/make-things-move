(async function () {
  class BranchingModule {
    constructor() {
      this.container = null;
      this.ctx = null;
      this.canvas = null;
      this.animationFrame = null;
      this.time = 0;
      this.branches = [];

      this.config = {
        branching: {
          levels: { value: 4, min: 1, max: 20, step: 1, label: 'Branching Levels' },
          angle: { value: 45, min: 5, max: 175, step: 5, label: 'Branch Angle' },
          length: { value: 100, min: 20, max: 400, step: 10, label: 'Initial Length' },
          speed: { value: 2, min: 0.1, max: 10, step: 0.1, label: 'Growth Speed' },
          shrink: { value: 0.7, min: 0.1, max: 1.5, step: 0.1, label: 'Branch Shrink Factor' }
        }
      };
    }

    createBranch(x, y, angle, length, level, parent = null) {
      const branch = {
        x,
        y,
        angle,
        length,
        level,
        parent,
        currentLength: 0,
        children: []
      };

      if (parent) {
        parent.children.push(branch);
      } else {
        this.branches.push(branch);
      }

      return branch;
    }

    growBranch(branch) {
      if (branch.currentLength < branch.length) {
        branch.currentLength += this.config.branching.speed.value;

        if (branch.currentLength >= branch.length && branch.level > 0) {
          // Create child branches when current branch is fully grown
          const branchAngle = this.config.branching.angle.value * (Math.PI / 180);
          const childLength = branch.length * this.config.branching.shrink.value;

          const endX = branch.x + Math.cos(branch.angle) * branch.length;
          const endY = branch.y + Math.sin(branch.angle) * branch.length;

          this.createBranch(endX, endY, branch.angle - branchAngle, childLength, branch.level - 1, branch);
          this.createBranch(endX, endY, branch.angle + branchAngle, childLength, branch.level - 1, branch);
        }
      }

      // Grow child branches
      branch.children.forEach(child => this.growBranch(child));
    }

    drawBranch(branch) {
      if (branch.currentLength <= 0) return;

      const endX = branch.x + Math.cos(branch.angle) * branch.currentLength;
      const endY = branch.y + Math.sin(branch.angle) * branch.currentLength;

      this.ctx.beginPath();
      this.ctx.moveTo(branch.x, branch.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = branch.level;
      this.ctx.stroke();

      // Draw child branches
      branch.children.forEach(child => this.drawBranch(child));
    }

    animate() {
      this.time += 0.016; // Fixed 60fps animation

      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Update and draw all branches
      this.branches.forEach(branch => {
        this.growBranch(branch);
        this.drawBranch(branch);
      });

      this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    init() {
      this.container = document.getElementById("animationContainer");
      if (!this.container) {
        console.error("Container not found!");
        return;
      }

      this.canvas = document.createElement('canvas');
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      // Create initial branches from center
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const length = this.config.branching.length.value;
      const levels = this.config.branching.levels.value;

      // Create four main branches
      this.createBranch(centerX, centerY, 0, length, levels); // Right
      this.createBranch(centerX, centerY, Math.PI, length, levels); // Left
      this.createBranch(centerX, centerY, Math.PI / 2, length, levels); // Down
      this.createBranch(centerX, centerY, -Math.PI / 2, length, levels); // Up

      this.animate();
    }

    onConfigUpdate() {
      // Stop current animation
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      // Clear the container
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }

      // Reset state
      this.time = 0;
      this.branches = [];

      // Reinitialize everything
      this.init();
    }

    clearShapes() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
  }

  const moduleManager = new ModuleManager();
  await moduleManager.init(BranchingModule);
})(); 