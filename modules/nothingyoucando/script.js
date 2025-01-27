(function () {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.getElementById('grid-container').appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const base = {
    x: canvas.width / 2,
    y: canvas.height / 2
  };

  let enemies = [];
  let lastTime = 0;

  function update(deltaTime) {
    enemies.forEach(enemy => {
      let dx = base.x - enemy.x;
      let dy = base.y - enemy.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        enemy.x += (dx / distance) * enemy.speed * deltaTime;
        enemy.y += (dy / distance) * enemy.speed * deltaTime;
      }
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.arc(base.x, base.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = '#f44336';
    enemies.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 56;
    lastTime = timestamp;

    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);
  }

  setInterval(() => {
    let side = Math.floor(Math.random() * 4);
    let x, y;

    switch (side) {
      case 0: // top
        x = Math.random() * canvas.width;
        y = 0;
        break;
      case 1: // right
        x = canvas.width;
        y = Math.random() * canvas.height;
        break;
      case 2: // bottom
        x = Math.random() * canvas.width;
        y = canvas.height;
        break;
      case 3: // left
        x = 0;
        y = Math.random() * canvas.height;
        break;
    }

    enemies.push({
      x: x,
      y: y,
      speed: 1
    });
  }, 1000);

  requestAnimationFrame(gameLoop);
})();