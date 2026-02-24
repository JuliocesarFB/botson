import { supabase } from "../config/supabaseClient.js"

const loginBtn = document.getElementById("loginBtn")
const registerBtn = document.getElementById("registerBtn")

async function checkAuth() {

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Se estiver logado

    loginBtn.textContent = "Dashboard"
    loginBtn.href = "dashboard.html"

    registerBtn.style.display = "none"
  }
}

checkAuth()
