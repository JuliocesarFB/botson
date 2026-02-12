const sb = window.supabaseClient;

let playersCache = [];

async function loadPlayers(){
  const { data, error } = await sb
    .from("v_player_full_stats")
    .select(`
      player_id,
      nickname,
      role,
      avatar_url,
      gamersclub_url,
      faceit_url,
      matches,
      kd,
      wr,
      presence,
      kast,
      hs
    `)
    .order("wr", { ascending:false });

  if(error){
    console.error("Erro Supabase:", error);
    return;
  }

  playersCache = data || [];
  renderPlayerCards(playersCache);
  updateMVP(playersCache);
  bindPlayerModal();
  updateTeamStats(playersCache);
}

function renderPlayerCards(players){
  const container = document.getElementById("playersContainer");
  if(!container) return;

  container.innerHTML = "";

  players.forEach(p=>{
    const card = document.createElement("div");
    card.className = "player-card";
    card.dataset.playerName = p.nickname;

    const avatar = p.avatar_url || "assets/imagens/default.png";

    card.innerHTML = `
      <div class="avatar" style="background-image:url('${avatar}')"></div>
      <h3 class="player-name">${p.nickname}</h3>
      <span class="player-role">${p.role || "-"}</span>
    `;

    container.appendChild(card);
  });
}

function updateTeamStats(players){
  if(!players.length) return;

  const matches = Math.max(...players.map(p => p.matches || 0));

  const avg = arr =>
    (arr.reduce((s,v)=>s+v,0)/(arr.length||1)).toFixed(2);

  document.getElementById("teammatches").innerText = matches;
  document.getElementById("teamKd").innerText = avg(players.map(p => Number(p.kd || 0)));
  document.getElementById("teamWr").innerText = avg(players.map(p => Number(p.wr || 0))) + "%";
  document.getElementById("teamKast").innerText = avg(players.map(p => Number(p.kast || 0))) + "%";
  document.getElementById("teamHs").innerText = avg(players.map(p => Number(p.hs || 0))) + "%";
}

function bindPlayerModal(){
  const modal = document.getElementById("playerModal");
  const closeBtn = document.getElementById("closeModal");

  document.querySelectorAll(".player-card").forEach(card=>{
    card.addEventListener("click",()=>{
      const name = card.dataset.playerName.toLowerCase().trim();
      const p = playersCache.find(pl =>
        pl.nickname?.toLowerCase().trim() === name
      );

      if(!p) return;

      document.getElementById("modalAvatar").src =
        p.avatar_url || "assets/imagens/default.png";

      document.getElementById("modalName").innerText = p.nickname;
      document.getElementById("modalRole").innerText = p.role || "-";

      const gcLink = document.getElementById("gcLink");
      const faceitLink = document.getElementById("faceitLink");

      if(p.gamersclub_url){
        gcLink.href = p.gamersclub_url;
        gcLink.style.display = "inline-block";
      } else gcLink.style.display = "none";

      if(p.faceit_url){
        faceitLink.href = p.faceit_url;
        faceitLink.style.display = "inline-block";
      } else faceitLink.style.display = "none";

      document.getElementById("statKd").innerText = p.kd ?? "-";
      document.getElementById("statWr").innerText =
        p.wr !== null ? `${Number(p.wr).toFixed(1)}%` : "-";

      document.getElementById("statmatches").innerText = p.matches ?? "-";
      document.getElementById("statPresence").innerText =
        p.presence !== null ? `${Number(p.presence).toFixed(1)}%` : "-";

      document.getElementById("statKast").innerText =
        p.kast !== null ? `${Number(p.kast).toFixed(1)}%` : "-";

      document.getElementById("statHs").innerText =
        p.hs !== null ? `${Number(p.hs).toFixed(1)}%` : "-";

      modal.classList.add("active");
    });
  });

  closeBtn.addEventListener("click",()=>modal.classList.remove("active"));
  modal.addEventListener("click",e=>{
    if(e.target===modal) modal.classList.remove("active");
  });
}

function updateMVP(players){
  if(!players.length) return;

  const maxKd = Math.max(...players.map(p => Number(p.kd || 0)));

  document.querySelectorAll(".player-card.mvp")
    .forEach(c=>c.classList.remove("mvp"));

  const top = players.filter(p => Number(p.kd || 0) === maxKd);

  if(top.length !== 1) return;

  const card = document.querySelector(
    `.player-card[data-player-name="${top[0].nickname}"]`
  );

  if(card) card.classList.add("mvp");
}

document.addEventListener("DOMContentLoaded", loadPlayers);
