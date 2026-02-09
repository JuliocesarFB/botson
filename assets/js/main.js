const SUPABASE_URL = "https://ajlpafdkfhlesoldfdei.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbHBhZmRrZmhsZXNvbGRmZGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTA1MzgsImV4cCI6MjA4NTk4NjUzOH0.bwa8vORalnMrZRB6qyxSRO52txFmCnVvKkf5Km0Gu9E";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let playersCache = [];

async function loadPlayers() {
  const { data, error } = await supabaseClient
  .from("v_player_stats")
  .select("*");

  if (error) {
    console.error("Erro Supabase:", error);
    return;
  }
  console.log("Players carregados:", data);
  playersCache = data;
  updateMVP(data);
  bindPlayerModal();
  updateTeamStats(data);

}

function updateTeamStats(players) {
  if (!players.length) return;

  const games = Math.max(...players.map(p => p.games || 0));

  const avg = (arr) =>
    (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);

  document.getElementById("teamGames").innerText = games;
  document.getElementById("teamKd").innerText = avg(players.map(p => Number(p.kd || 0)));
  document.getElementById("teamHs").innerText = avg(players.map(p => Number(p.hs || 0))) + "%";
  document.getElementById("teamKast").innerText = avg(players.map(p => Number(p.kast || 0))) + "%";
}

function bindPlayerModal() {
  const modal = document.getElementById("playerModal");
  const closeBtn = document.getElementById("closeModal");
  if (!modal || !closeBtn) {
    console.error("Modal ou botão fechar não encontrado");
    return;
  }
  document.querySelectorAll(".player-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.player);
      const p = playersCache.find(pl => pl.id === id);
      if (!p) {
        console.warn("Player não encontrado:", id, playersCache);
        return;
      }
      const bg = card.querySelector(".avatar").style.backgroundImage;
      document.getElementById("modalAvatar").src = bg
        .replace(/^url\(["']?/, "")
        .replace(/["']?\)$/, "");
      document.getElementById("modalName").innerText = p.name;
      document.getElementById("modalRole").innerText = p.role;
      const gcLink = document.getElementById("gcLink");
      const faceitLink = document.getElementById("faceitLink");
      if (p.gamersclub_url) {
        gcLink.href = p.gamersclub_url;
        gcLink.style.display = "inline-block";
      } else {
        gcLink.style.display = "none";
      }
      if (p.faceit_url) {
        faceitLink.href = p.faceit_url;
        faceitLink.style.display = "inline-block";
      } else {
        faceitLink.style.display = "none";
      }
      document.getElementById("statKd").innerText = p.kd ?? "-";
      //document.getElementById("statWr").innerText = p.wr ? `${p.wr}%` : "-";
      document.getElementById("statGames").innerText = p.games ?? "-";
      document.getElementById("statFk").innerText = p.fk ?? "-";
      //document.getElementById("statPresence").innerText = p.presence ? `${p.presence}%` : "-";
      //document.getElementById("statKast").innerText = p.kast ? `${p.kast}%` : "-";
      document.getElementById("statHs").innerText = p.hs ? `${p.hs}%` : "-";

      modal.classList.add("active");
    });
  });
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}
function updateMVP(players) {
  if (!players.length) return;

  const maxKd = Math.max(...players.map(p => Number(p.kd || 0)));


  const topPlayers = players.filter(
    p => Number(p.kd) === maxKd
  );

  document  
    .querySelectorAll(".player-card.mvp")
    .forEach(c => c.classList.remove("mvp"));

  if (topPlayers.length !== 1) return;

  const mvp = topPlayers[0];

  const card = document.querySelector(
    `.player-card[data-player="${mvp.id}"]`
  );

  if (!card) return;
  card.classList.add("mvp");

}

document.addEventListener("DOMContentLoaded", loadPlayers);
