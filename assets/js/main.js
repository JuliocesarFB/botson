console.log("MAIN JS CARREGADO");


const SUPABASE_URL = "https://ajlpafdkfhlesoldfdei.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbHBhZmRrZmhsZXNvbGRmZGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTA1MzgsImV4cCI6MjA4NTk4NjUzOH0.bwa8vORalnMrZRB6qyxSRO52txFmCnVvKkf5Km0Gu9E";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);




// util
function num(v) {
  return v == null ? 0 : Number(v);
}

// carregar tudo
async function loadPlayers() {



  const { data, error } = await supabaseClient
    .from("players")
    .select("*");

  if (error) {
    console.error("Erro Supabase:", error);
    return;
  }
  console.log("Players carregados:", data);

  playersCache = data;

  updateTeamStats(data);
  updateMVP(data);
  bindPlayerModal();

}



// estatísticas do time
function updateTeamStats(players) {
  if (!players.length) return;

  let totalKd = 0, totalWr = 0, totalKast = 0, totalHs = 0, games = 0;

  players.forEach(p => {
    totalKd += num(p.kd);
    totalWr += num(p.wr);
    totalKast += num(p.kast);
    totalHs += num(p.hs);
    games = Math.max(games, num(p.games));
  });

  const count = players.length;

  document.getElementById("teamKd").innerText = (totalKd / count).toFixed(2);
  document.getElementById("teamWr").innerText = (totalWr / count).toFixed(1) + "%";
  document.getElementById("teamKast").innerText = (totalKast / count).toFixed(1) + "%";
  document.getElementById("teamHs").innerText = (totalHs / count).toFixed(1) + "%";
  document.getElementById("teamGames").innerText = games;
}

function bindPlayerModal() {
  const modal = document.getElementById("playerModal");
  const closeBtn = document.getElementById("closeModal");

  document.querySelectorAll(".player-card").forEach(card => {
    card.onclick = () => {
      const id = card.dataset.player;
      const p = playersCache.find(pl => pl.id === id);
      if (!p) return;

      // avatar
      const bg = card.querySelector(".avatar").style.backgroundImage;
      document.getElementById("modalAvatar").src =
        bg.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");

      document.getElementById("modalName").innerText = id.toUpperCase();
      document.getElementById("statKd").innerText = p.kd ?? "-";
      document.getElementById("statWr").innerText = (p.wr ?? "-") + "%";
      document.getElementById("statGames").innerText = p.games ?? "-";
      document.getElementById("statFk").innerText = p.fk ?? "-";
      document.getElementById("statPresence").innerText = (p.presence ?? "-") + "%";
      document.getElementById("statKast").innerText = (p.kast ?? "-") + "%";
      document.getElementById("statHs").innerText = (p.hs ?? "-") + "%";

      modal.style.display = "flex";
    };
  });

  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = e => e.target === modal && (modal.style.display = "none");
}

/*testando mvp*/

function updateMVP(players) {
  if (!players.length) return;

  let maxKd = Math.max(...players.map(p => num(p.kd)));

  const topPlayers = players.filter(p => num(p.kd) === maxKd);

  document.querySelectorAll(".player-card.mvp")
    .forEach(c => c.classList.remove("mvp"));

  if (topPlayers.length !== 1) return;

  const mvp = topPlayers[0];

  const card = document.querySelector(
    `.player-card[data-player="${mvp.id}"]`
  );

  if (card) card.classList.add("mvp");
}







document.addEventListener("DOMContentLoaded", loadPlayers);













