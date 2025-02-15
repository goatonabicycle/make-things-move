(function () {
  const canvas = document.getElementById('treeCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initTree();
  });

  class Branch {
    constructor(startX, startY, angle, length, thickness, gen = 0, parentSway = 0) {
      this.start = { x: startX, y: startY };
      this.angle = angle;
      this.baseAngle = angle;
      this.length = length;
      this.growth = 0;
      this.thickness = thickness;
      this.gen = gen;
      this.children = [];
      this.growing = true;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.packets = [];
      this.parentSway = parentSway;
    }

    grow() {
      if (this.growing) {
        this.growth += 1;
        if (this.growth >= this.length) {
          this.growing = false;
          if (this.gen < 10 && this.length > 15) {
            const branches = Math.random() < 0.3 ? 3 : 2;
            const spread = Math.PI * 0.4;

            for (let i = 0; i < branches; i++) {
              const newAngle = this.baseAngle - (spread / 2) + (spread * i / (branches - 1));
              this.children.push(new Branch(
                this.end.x,
                this.end.y,
                newAngle,
                this.length * 0.8,
                this.thickness * 0.7,
                this.gen + 1,
                this.angle - this.baseAngle
              ));
            }
          }
        }
      }

      if (Math.random() < 0.02 && this.growth > 10) {
        this.packets.push({
          pos: 0,
          speed: 0.02,
          size: 2 + Math.random() * 2
        });
      }

      this.packets = this.packets.filter(p => {
        p.pos += p.speed;
        return p.pos < 1;
      });

      this.children.forEach(child => child.grow());
    }

    draw(time) {
      const baseSway = Math.sin(time * 0.001) * (0.05 - this.gen * 0.005);
      const totalSway = baseSway + this.parentSway;
      this.angle = this.baseAngle + totalSway;

      this.end = {
        x: this.start.x + Math.cos(this.angle) * this.growth,
        y: this.start.y + Math.sin(this.angle) * this.growth
      };

      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 255, 200, ${0.2 + Math.sin(time * 0.003 + this.pulseOffset) * 0.1})`;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.stroke();

      this.packets.forEach(p => {
        const x = this.start.x + (this.end.x - this.start.x) * p.pos;
        const y = this.start.y + (this.end.y - this.start.y) * p.pos;

        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 255, 255, ${1 - p.pos})`;
        ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      this.children.forEach(child => child.draw(time));
    }
  }

  let tree;

  function initTree() {
    tree = new Branch(
      canvas.width / 2,
      canvas.height,
      -Math.PI / 2,
      canvas.height * 0.2,
      8
    );
  }

  function animate(time) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    tree.grow();
    tree.draw(time);

    requestAnimationFrame(animate);
  }

  initTree();
  animate(0);

  canvas.addEventListener('click', initTree);
})();