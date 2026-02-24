import { supabase } from "../config/supabaseClient.js"

const form = document.getElementById("loginForm")
const message = document.getElementById("message")

const syncUserWithPlayer = async (user) => {
  if (!user) return

  // Buscar player pelo nickname
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('*')
    .ilike('nickname', user.user_metadata?.nickname)
    .single()

  if (playerError || !player) {
    console.log("Player não encontrado")
    return
  }

  // Atualizar player_stats vinculando ao user logado
  const { error: updateError } = await supabase
    .from('player_stats')
    .update({ user_id: user.id })
    .eq('player_id', player.id)

  if (updateError) {
    console.log("Erro ao sincronizar:", updateError)
  } else {
    console.log("Sincronizado com sucesso 🔥")
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  const email = `${username}@team.local`

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    message.textContent = "Usuário ou senha incorretos"
    message.style.color = "red"
    return
  }

  message.textContent = "Login realizado!"
  message.style.color = "lime"

  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 1000)
})

const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })

  if (error) {
    console.log(error.message)
    return
  }

  if (data.user) {
    await syncUserWithPlayer(data.user)
  }
}
