export function renderRanking(ranking) {
  const rankingList = document.getElementById("ranking-list")
  rankingList.innerHTML = ""

  let position = 0
  let lastScore = null
  let realIndex = 0

  ranking.forEach((player) => {

    const currentScore = Number(player.matches_played)
    realIndex++

    if (lastScore === null) {
      position = 1
    } else if (currentScore < lastScore) {
      position = realIndex
    }

    lastScore = currentScore

    let medalha = ""
    let medalClass = ""

    if (position === 1) {
      medalha = "🥇"
      medalClass = "gold"
    }
    else if (position === 2) {
      medalha = "🥈"
      medalClass = "silver"
    }
    else if (position === 3) {
      medalha = "🥉"
      medalClass = "bronze"
    }

    rankingList.innerHTML += `
      <div class="rank-item ${medalClass}">
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
    `
  })
}
