const storageKey = "playersStats";

let playersStats = JSON.parse(localStorage.getItem(storageKey)) || {
  julius: {},
  edy: {},
  henri: {},
  guig4: {},
  momin: {},
  dino: {},
  louis: {}
};

const select = document.getElementById("playerSelect");

const inputs = {
  kd: document.getElementById("kd"),
  wr: document.getElementById("wr"),
  games: document.getElementById("games"),
  fk: document.getElementById("fk"),
  presence: document.getElementById("presence"),
  kast: document.getElementById("kast"),
  hs: document.getElementById("hs")
};

select.onchange = () => {
  const p = playersStats[select.value] || {};

  inputs.kd.value = p.kd || "";
  inputs.wr.value = p.wr || "";
  inputs.games.value = p.games || "";
  inputs.fk.value = p.fk || "";
  inputs.presence.value = p.presence || "";
  inputs.kast.value = p.kast || "";
  inputs.hs.value = p.hs || "";
};

document.getElementById("saveBtn").addEventListener("click", () => {
  const player = select.value;
  if (!player) return alert("Selecione um jogador");

  playersStats[player] = {
    ...playersStats[player],
    kd: inputs.kd.value,
    wr: inputs.wr.value,
    games: inputs.games.value,
    fk: inputs.fk.value,
    presence: inputs.presence.value,
    kast: inputs.kast.value,
    hs: inputs.hs.value
  };

  localStorage.setItem(storageKey, JSON.stringify(playersStats));
  alert("Estatísticas salvas!");
});
