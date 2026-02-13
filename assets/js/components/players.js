export function renderPlayers(players) {
  const container = document.getElementById("playersContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!players || players.length === 0) {
    container.innerHTML = "<p>Nenhum jogador encontrado.</p>";
    return;
  }

  players.forEach(p => {
    const card = document.createElement("div");
    card.className = "player-card";

    const nickname = p.nickname || "Sem nome";
    const role = p.role || "-";
    const avatar = p.avatar_url || "assets/imagens/default.png";

    card.dataset.playerName = nickname;

    card.innerHTML = `
      <div class="avatar" style="background-image: url('${avatar}')"></div>
      <h3 class="player-name">${nickname}</h3>
      <span class="player-role">${role}</span>
    `;

    container.appendChild(card);
  });
}
