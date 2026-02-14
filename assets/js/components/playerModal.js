export function bindPlayerModal(playersCache) {

  const modal = document.getElementById("playerModal");
  const closeBtn = document.getElementById("closeModal");

  function formatPercent(value) {
    if (value === null || value === undefined) return "-";

    const num = Number(value);

    if (isNaN(num)) return "-";

    return `${num.toFixed(1)}%`;
  }

  function formatNumber(value) {
    if (value === null || value === undefined) return "-";

    const num = Number(value);

    if (isNaN(num)) return "-";

    return num;
  }

  document.querySelectorAll(".player-card").forEach(card => {
    card.addEventListener("click", () => {

      const name = card.dataset.playerName.toLowerCase().trim();

      const p = playersCache.find(pl =>
        pl.nickname?.toLowerCase().trim() === name
      );

      if (!p) return;

      document.getElementById("modalAvatar").src =
        p.avatar_url || "assets/imagens/default.png";

      document.getElementById("modalName").innerText = p.nickname || "-";
      document.getElementById("modalRole").innerText = p.role || "-";

      const gcLink = document.getElementById("gcLink");
      const faceitLink = document.getElementById("faceitLink");

      if (p.gamersclub_url) {
        gcLink.href = p.gamersclub_url;
        gcLink.style.display = "inline-block";
      } else gcLink.style.display = "none";

      if (p.faceit_url) {
        faceitLink.href = p.faceit_url;
        faceitLink.style.display = "inline-block";
      } else faceitLink.style.display = "none";

      document.getElementById("statKd").innerText = formatNumber(p.kd);
      document.getElementById("statWr").innerText = formatPercent(p.wr);
      document.getElementById("statmatches").innerText = formatNumber(p.matches);
      document.getElementById("statPresence").innerText = formatPercent(p.presence);
      document.getElementById("statKast").innerText = formatPercent(p.kast);
      document.getElementById("statHs").innerText = formatPercent(p.hs);
      document.getElementById("statFk").innerText = formatNumber(p.fk);
      modal.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });
}
