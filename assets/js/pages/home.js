import { getRanking } from "../services/rankingService.js"
import { getPlayers } from "../services/playerService.js"
import { bindPlayerModal } from "../components/playerModal.js"
import { renderRanking } from "../components/ranking.js"
import { renderPlayers } from "../components/players.js"
import { getTeamStats } from "../services/teamService.js"


let playersCache = []

document.addEventListener("DOMContentLoaded", async () => {

  try {

    const ranking = await getRanking()
    renderRanking(ranking)

    const players = await getPlayers()
    playersCache = players
    renderPlayers(players)

    bindPlayerModal(playersCache)

  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  }

const team = await getTeamStats()

document.getElementById("teamKd").innerText =
  team.team_kd ?? "-"

document.getElementById("teamWr").innerText =
  team.team_wr !== null ? `${Number(team.team_wr).toFixed(1)}%` : "-"

document.getElementById("teammatches").innerText =
  team.team_matches ?? "-"

document.getElementById("teamKast").innerText =
  team.team_kast !== null ? `${Number(team.team_kast).toFixed(1)}%` : "-"

document.getElementById("teamHs").innerText =
  team.team_hs !== null ? `${Number(team.team_hs).toFixed(1)}%` : "-"


})

