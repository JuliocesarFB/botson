export function updateMVP() {
  const cards = document.querySelectorAll(".player-card");

  let bestKD = 0;
  let mvpCard = null;

  cards.forEach(card => {
    const kdElement = card.querySelector("[data-kd]");
    if (!kdElement) return;

    const kd = Number(kdElement.dataset.kd || 0);

    if (kd > bestKD) {
      bestKD = kd;
      mvpCard = card;
    }
  });

  cards.forEach(card => {
    card.classList.remove("mvp");
  });

  if (mvpCard) {
    mvpCard.classList.add("mvp");
  }
}
