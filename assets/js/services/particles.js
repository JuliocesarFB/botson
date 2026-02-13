document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".hero").offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 8 + 4,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.strokeStyle = `rgba(255,122,0,${p.opacity})`;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.length);
      ctx.stroke();

      p.y -= p.speed;

      if (p.y < -10) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
});
