document.addEventListener("DOMContentLoaded", async () => {

  const sb = window.supabaseClient;

  const { data, error } = await sb
    .from("v_ranking_presence")
    .select("*")
    .order("matches_played", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";


let position = 0;
let lastScore = null;
let realIndex = 0;

data.forEach((player) => {

  const currentScore = Number(player.matches_played);
  realIndex++;

  if (lastScore === null) {
    position = 1;
  } else if (currentScore < lastScore) {
    position = realIndex; // 🔥 AQUI está o segredo
  }

  lastScore = currentScore;

  let medalha = "";
  if (position === 1) medalha = "🥇";
  else if (position === 2) medalha = "🥈";
  else if (position === 3) medalha = "🥉";

  let classe = "";
  if (position === 1) classe = "gold";
  else if (position === 2) classe = "silver";
  else if (position === 3) classe = "bronze";

  rankingList.innerHTML += `
    <div class="rank-item ${classe}">
      <div class="rank-position">
        ${medalha || "#" + position}
      </div>

      <div class="rank-player">
        <img src="${player.avatar_url || "assets/imagens/default.png"}" class="rank-avatar">
        <span>${player.nickname}</span>
      </div>

      <div class="rank-score">
        ${currentScore} partidas
      </div>
    </div>
  `;
});




});
