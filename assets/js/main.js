const playersBase = {
  julius: {
    name: "JuliuS",
    role: "IGL",
    avatar: "assets/imagens/avatarjulius.jpeg"
  },
  edy: {
    name: "Ei_Edy",
    role: "Lurker",
    avatar: "assets/imagens/avataredy.jpg"
  },
  henri: {
    name: "Henri",
    role: "Rifler",
    avatar: "assets/imagens/avatarhenri.jpeg"
  },
  guig4: {
    name: "Guig4",
    role: "AWP",
    avatar: "assets/imagens/avatarguig4.jpeg"
  },
  momin: {
    name: "Momin",
    role: "Rifler",
    avatar: "assets/imagens/avatarmomin.jpeg"
  },
  dino: {
    name: "Dino",
    role: "AWP",
    avatar: "assets/imagens/avatardino.jpeg"
  },
  louis: {
    name: "Louis",
    role: "Rifler",
    avatar: "assets/imagens/avatarlouis.jpeg"
  }
};




const playersStats = JSON.parse(localStorage.getItem("playersStats")) || {
  julius: {
    kd: "1.15",
    wr: "60%",
    games: "110",
    fk: "0.12",
    presence: "100%",
    kast: "72%",
    hs: "48%"
  },
  edy: {
    kd: "1.20",
    wr: "58%",
    games: "105",
    fk: "0.10",
    presence: "85%",
    kast: "72%",
    hs: "48%"
  },
  henri: {
    kd: "1.10",
    wr: "55%",
    games: "98",
    fk: "0.13",
    presence: "90%",
    kast: "72%",
    hs: "48%"
  },
  guig4: {
    kd: "1.25",
    wr: "62%",
    games: "115",
    fk: "0.09",
    presence: "95%",
    kast: "72%",
    hs: "48%"
  },
  momin: {
    kd: "1.08",
    wr: "50%",
    games: "90",
    fk: "0.11",
    presence: "80%",
    kast: "72%",
    hs: "48%"
  },
  dino: {
    kd: "1.30",
    wr: "65%",
    games: "120",
    fk: "0.08",
    presence: "92%",
    kast: "72%",
    hs: "48%"
  },
  louis: {
    kd: "1.12",
    wr: "57%",
    games: "100",
    fk: "0.14",
    presence: "88%",
    kast: "72%",
    hs: "48%"
  }
};

function updateTeamStats() {
  const playersStats = JSON.parse(localStorage.getItem("playersStats")) || {};

  let totalKd = 0;
  let totalWr = 0;
  let totalKast = 0;
  let totalHs = 0;
  let count = 0;

  let teamGames = 0; 

  Object.values(playersStats).forEach(p => {
    if (!p.kd) return;

    count++;

    totalKd += Number(p.kd);
    totalWr += parseFloat(p.wr);
    totalKast += parseFloat(p.kast || 0);
    totalHs += parseFloat(p.hs || 0);

    
    teamGames = Math.max(teamGames, Number(p.games || 0));
  });

  if (count === 0) return;

  document.getElementById("teamKd").innerText = (totalKd / count).toFixed(2);
  document.getElementById("teamWr").innerText = (totalWr / count).toFixed(1) + "%";
  document.getElementById("teamGames").innerText = teamGames;
  document.getElementById("teamKast").innerText = (totalKast / count).toFixed(1) + "%";
  document.getElementById("teamHs").innerText = (totalHs / count).toFixed(1) + "%";
}




const savedStats = JSON.parse(localStorage.getItem("botsOnStats")) || {};
const modal = document.getElementById("playerModal");
const closeBtn = document.getElementById("closeModal");

document.querySelectorAll(".player-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.dataset.player;

    const base = playersBase[key];
    const stats = playersStats[key] || {};

    if (!base) return;

    document.getElementById("modalAvatar").src = base.avatar;
    document.getElementById("modalName").innerText = base.name;
    document.getElementById("modalRole").innerText = base.role;

    document.getElementById("statKd").innerText = stats.kd || "0.00";
    document.getElementById("statWr").innerText = (stats.wr || 0) + "%";
    document.getElementById("statGames").innerText = stats.games || 0;
    document.getElementById("statFk").innerText = stats.fk || 0;
    document.getElementById("statPresence").innerText = (stats.presence || 0) + "%";
    document.getElementById("statKast").innerText = (stats.kast || 0) + "%";
    document.getElementById("statHs").innerText = (stats.hs || 0) + "%";

    document.getElementById("playerModal").style.display = "flex";
  });
});



function cleanNumber(value) {
  if (!value) return 0;
  return Number(String(value).replace("%", ""));
}

function calculateMVP(playersStats) {
  let bestKey = null;
  let bestScore = -1;

  Object.entries(playersStats).forEach(([key, p]) => {
    if (!p || Object.keys(p).length === 0) return;

    const kd = cleanNumber(p.kd);
    const wr = cleanNumber(p.wr);
    const kast = cleanNumber(p.kast);
    const hs = cleanNumber(p.hs);

    if (!kd && !wr && !kast && !hs) return;

    const score =
      kd * 1.5 +
      wr * 0.02 +
      kast * 0.02 +
      hs * 0.02;

    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  });

  return bestKey;
}



function updateMVPBadge() {
  const playersStats = JSON.parse(localStorage.getItem("playersStats")) || {};
  const mvpKey = calculateMVP(playersStats);

  console.log("MVP calculado:", mvpKey);

  document.querySelectorAll(".player-card").forEach(card => {
    const badge = card.querySelector(".mvp-badge");
    const key = card.dataset.player;

    if (!badge) return;
        if (key === mvpKey) {
            badge.style.display = "block";
            card.classList.add("mvp");
        } else {
            badge.style.display = "none";
            card.classList.remove("mvp");
        }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateMVPBadge();
});





closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => e.target === modal && (modal.style.display = "none");
updateTeamStats();








