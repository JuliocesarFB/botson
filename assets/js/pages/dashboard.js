import { supabase } from "../config/supabaseClient.js"
import "../pages/training.js"

const nicknameEl = document.getElementById("userNickname")
const logoutBtn = document.getElementById("logoutBtn")

const kdEl = document.getElementById("kd")
const hsEl = document.getElementById("hs")
const fkEl = document.getElementById("fk")
const kastEl = document.getElementById("kast")
const presenceEl = document.getElementById("presence")

async function loadDashboard() {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = "login.html"
    return
  }

  // 🔎 Buscar username
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  if (!profile) return

  nicknameEl.textContent = profile.username

  // 🔎 Buscar player pelo nickname
  const { data: player } = await supabase
    .from("players")
    .select("id")
    .ilike("nickname", profile.username)
    .single()

  if (!player) return

  // 🔥 Buscar tudo da view completa
  const { data: fullStats, error } = await supabase
    .from("v_player_full_stats")
    .select("*")
    .eq("player_id", player.id)
    .single()

  if (error) {
    console.log("Erro ao buscar stats:", error)
    return
  }

  if (fullStats) {
    kdEl.textContent = fullStats.kd ?? "-"
    hsEl.textContent = fullStats.hs ?? "-"
    fkEl.textContent = fullStats.fk ?? "-"
    kastEl.textContent = fullStats.kast ?? "-"
    presenceEl.textContent = fullStats.presence ?? "-"
  }
}

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut()
  window.location.href = "index.html"
})

loadDashboard()