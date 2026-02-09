const SUPABASE_URL = "https://ajlpafdkfhlesoldfdei.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbHBhZmRrZmhsZXNvbGRmZGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTA1MzgsImV4cCI6MjA4NTk4NjUzOH0.bwa8vORalnMrZRB6qyxSRO52txFmCnVvKkf5Km0Gu9E";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let playersCache = [];

async function loadPlayers() {
  const { data, error } = await supabaseClient
    .from("v_player_full_stats")
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


async function loadPlayerStats() {
  const { data, error } = await supabaseClient
    .from("v_player_full_stats")
    .select(`
      player_id,
      nickname,
      matches,
      kd,
      winrate,
      presence
    `)
    .order("winrate", { ascending: false });

  if (error) {
    console.error("Erro ao carregar stats:", error);
    return;
  }

  renderPlayers(data);
}

function renderPlayers(players) {
  const tbody = document.getElementById("playersTable");
  tbody.innerHTML = "";

  players.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.nickname}</td>
      <td>${p.matches ?? 0}</td>
      <td>${p.kd ? p.kd.toFixed(2) : "0.00"}</td>
      <td>${p.winrate ? p.winrate.toFixed(1) + "%" : "0%"}</td>
      <td>${p.presence ? p.presence.toFixed(1) + "%" : "0%"}</td>
    `;

    tbody.appendChild(tr);
  });
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
  const rawName = card.dataset.playerName;

if (!rawName) {
  console.warn("player-card sem data-player-name", card);
  return;
}

const name = rawName.toLowerCase().trim();

const p = playersCache.find(pl =>
  pl.nickname &&
  pl.nickname.toLowerCase().trim() === name
);

if (!p) {
  console.warn("Player não encontrado no cache:", name, playersCache);
  return;
}

      const bg = card.querySelector(".avatar").style.backgroundImage;
      document.getElementById("modalAvatar").src = bg
        .replace(/^url\(["']?/, "")
        .replace(/["']?\)$/, "");
      document.getElementById("modalName").innerText = p.nickname;
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
      document.getElementById("statWr").innerText = p.winrate !== null && p.winrate !== undefined ? `${Number(p.winrate).toFixed(1)}%` : "-";
      document.getElementById("statGames").innerText = p.games ?? "-";
      document.getElementById("statFk").innerText = p.fk ?? "-";
      document.getElementById("statPresence").innerText = p.presence !== null && p.presence !== undefined ? `${Number(p.presence).toFixed(1)}%`: "-";
      document.getElementById("statKast").innerText = p.kast !== null && p.kast !== undefined ? `${p.kast}%` : "-";
      document.getElementById("statHs").innerText = p.hs !== null && p.hs !== undefined ? `${p.hs}%` : "-";
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
  `.player-card[data-player-name="${mvp.nickname}"]`
);


  if (!card) return;
  card.classList.add("mvp");

}
document.addEventListener("DOMContentLoaded", () => {
  loadPlayers();       
  loadPlayerStats();   
});
