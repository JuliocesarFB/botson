import { supabase } from "../config/supabaseClient.js"
import { updateMVP } from "../components/mvp.js";



const playersDiv = document.getElementById("players");
const addBtn = document.getElementById("addPlayer");
const saveBtn = document.getElementById("saveMatch");

let playersCache = [];




async function loadPlayers() {
  const { data, error } = await supabase
    .from("players")
    .select("id, nickname")
    .order("nickname");

  if (error) {
    alert("Erro ao carregar jogadores");
    console.error(error);
    return;
  }

  playersCache = data ?? [];
}

function createPlayerRow() {
  const div = document.createElement("div");
  div.className = "player-row";

  div.innerHTML = `
    <select class="player">
      <option value="">Jogador</option>
      ${playersCache.map(p =>
        `<option value="${p.id}">${p.nickname}</option>`
      ).join("")}
    </select>

    <input class="kd" type="number" step="0.01" min="0" placeholder="KD">
    <input class="hs" type="number" min="0" placeholder="HS">
    <input class="fk" type="number" min="0" placeholder="FK">
    <input class="kast" type="number" step="0.1" min="0" max="100" placeholder="KAST %">
  `;

  return div;
}

if (addBtn) {
  addBtn.addEventListener("click", async () => {
    if (!playersCache.length) await loadPlayers();
    playersDiv.appendChild(createPlayerRow());
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", async () => {

    const winValue = document.getElementById("matchWin")?.value;
    const map = document.getElementById("map")?.value.trim();

    if (winValue === "") {
      alert("Informe se a partida foi vitória ou derrota");
      return;
    }

    if (!map) {
      alert("Informe o mapa");
      return;
    }

    const win = winValue === "true";

    const playerRows = document.querySelectorAll(".player-row");

    if (!playerRows.length) {
      alert("Adicione ao menos um jogador");
      return;
    }

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({ map })
      .select()
      .single();

    if (matchError) {
      alert("Erro ao salvar partida");
      console.error(matchError);
      return;
    }

    const rowsPresence = [];
    const rowsStats = [];

    playerRows.forEach(row => {
      const player_id = row.querySelector(".player").value;
      if (!player_id) return;

      const kd = Number(row.querySelector(".kd").value || 0);
      const hs = Number(row.querySelector(".hs").value || 0);
      const fk = Number(row.querySelector(".fk").value || 0);
      const kast = Number(row.querySelector(".kast").value || 0);

      rowsPresence.push({
        match_id: match.id,
        player_id,
        win
      });

      rowsStats.push({
        player_id,
        kd,
        hs,
        fk,
        kast
      });
    });

    if (!rowsPresence.length) {
      alert("Nenhum jogador válido");
      return;
    }

    const { error: presenceError } = await supabase
      .from("match_players")
      .insert(rowsPresence);

    if (presenceError) {
      alert("Erro ao salvar presença");
      console.error(presenceError);
      return;
    }

for (const stat of rowsStats) {

  const { data: existing } = await supabase
    .from("player_stats")
    .select("kd, hs, fk, kast")
    .eq("player_id", stat.player_id)
    .maybeSingle();

  if (existing) {

    await supabase
      .from("player_stats")
      .update({
        kd: (existing.kd ?? 0) + stat.kd,
        hs: (existing.hs ?? 0) + stat.hs,
        fk: (existing.fk ?? 0) + stat.fk,
        kast: (existing.kast ?? 0) + stat.kast
      })
      .eq("player_id", stat.player_id);

  } else {

    await supabase
      .from("player_stats")
      .insert({
        player_id: stat.player_id,
        kd: stat.kd,
        hs: stat.hs,
        fk: stat.fk,
        kast: stat.kast
      });
  }
}



    alert("Partida salva com sucesso ✅");

    playersDiv.innerHTML = "";
    document.getElementById("map").value = "";
    document.getElementById("matchWin").value = "";
  });

  
}

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("kd")) {
    updateMVP();
  }
});


document.addEventListener("DOMContentLoaded", loadPlayers);
