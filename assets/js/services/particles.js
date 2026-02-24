document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // agora ocupa tela toda
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 10 + 5,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.3
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.strokeStyle = `rgba(255,122,0,${p.opacity})`;
      ctx.lineWidth = 1.3;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.length);
      ctx.stroke();

      p.y -= p.speed;

      if (p.y < -20) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
});
