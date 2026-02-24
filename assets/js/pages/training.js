import { supabase } from "../config/supabaseClient.js"

const trainingList = document.querySelector(".training-list")
const createBtn = document.querySelector(".create-form button")
const titleInput = document.querySelector(".create-form input")
const descInput = document.querySelector(".create-form textarea")
const dateInput = document.querySelector(".training-date")
const timeInput = document.querySelector(".training-time")

let currentUser = null

// ===============================
// INIT
// ===============================
async function init() {
  const { data } = await supabase.auth.getUser()
  currentUser = data.user
  console.log("USUARIO LOGADO:", currentUser)

  carregarTreinos()
}

init()

// ===============================
// CRIAR TREINO
// ===============================
createBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim()
  const description = descInput.value.trim()
  const trainingDate = dateInput.value
  const trainingTime = timeInput.value

  if (!title || !trainingDate || !trainingTime) {
    return alert("Preencha título, data e horário")
  }

  const { data, error } = await supabase
    .from("trainings")
    .insert({
      title,
      description,
      training_date: trainingDate,
      training_time: trainingTime,
      created_by: currentUser.id
    })
    .select()

    console.log("RESULTADO DO INSERT:", data)
    console.log("ERRO DO INSERT:", error)

  if (error) {
    console.log(error)
    alert("Erro ao criar treino")
  } else {
    titleInput.value = ""
    descInput.value = ""
    carregarTreinos()
  }
})

// ===============================
// CARREGAR TREINOS
// ===============================
async function carregarTreinos() {
  trainingList.innerHTML = ""

  const { data: trainings, error } = await supabase
    .from("trainings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.log("Erro ao buscar treinos:", error)
    return
  }

  if (!trainings) return

  for (const treino of trainings) {

    // 🔥 Buscar confirmações COM usernames
    const { data: confirmations } = await supabase
      .from("training_confirmations")
      .select(`
        user_id,
        profiles (
          username
        )
      `)
      .eq("training_id", treino.id)

    const { data: jaConfirmou } = await supabase
      .from("training_confirmations")
      .select("*")
      .eq("training_id", treino.id)
      .eq("user_id", currentUser.id)
      .maybeSingle()

    renderTreino(
      treino,
      confirmations || [],
      jaConfirmou
    )
  }
}

// ===============================
// RENDER TREINO
// ===============================
function renderTreino(treino, confirmations, jaConfirmou) {

  const listaUsuarios = confirmations
    ?.map(c => c.profiles?.username)
    .filter(Boolean) || []

  const dataFormatada = treino.training_date
    ? formatDate(treino.training_date)
    : "Data não definida"

  const horarioFormatado = treino.training_time
    ? treino.training_time.slice(0,5)
    : "Horário não definido"

  const usuariosHTML = listaUsuarios.length > 0
    ? `
      <div class="confirmed-users">
        <strong>Confirmado por:</strong>
        ${listaUsuarios.map(nome => `<div>• ${nome}</div>`).join("")}
      </div>
    `
    : ""

  const card = document.createElement("div")
  card.className = "training-card"

  card.innerHTML = `
    <span class="status-badge ${
      treino.is_confirmed ? "status-confirmed" : "status-pending"
    }">
      ${treino.is_confirmed ? "CONFIRMADO" : "PENDENTE"}
    </span>

    ${
      treino.created_by === currentUser.id
        ? `<button class="delete-btn" data-id="${treino.id}">Remover</button>`
        : ""
    }

    <div class="training-title">${treino.title}</div>

    <div class="training-datetime">
      📅 ${dataFormatada} às ${horarioFormatado}
    </div>

    <div class="training-description">
      ${treino.description || ""}
    </div>

    <div class="confirmations">
      ${listaUsuarios.length} confirmações
    </div>

    ${usuariosHTML}

    ${
      !treino.is_confirmed
        ? `
        <label class="confirm-box">
          <input type="checkbox" data-id="${treino.id}" ${
            jaConfirmou ? "checked disabled" : ""
          }>
          Confirmar presença
        </label>
      `
        : ""
    }
  `

  trainingList.appendChild(card)
}

// ===============================
// DELEGATION (DELETE + CONFIRM)
// ===============================
trainingList.addEventListener("click", async (e) => {
  // REMOVER
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id

    await supabase
      .from("trainings")
      .delete()
      .eq("id", id)

    carregarTreinos()
  }
})

trainingList.addEventListener("change", async (e) => {
  // CONFIRMAR
  if (e.target.type === "checkbox") {
    const id = e.target.dataset.id

    await supabase
      .from("training_confirmations")
      .insert({
        training_id: id,
        user_id: currentUser.id
      })

    const { count } = await supabase
      .from("training_confirmations")
      .select("*", { count: "exact", head: true })
      .eq("training_id", id)

    if (count >= 3) {
      await supabase
        .from("trainings")
        .update({ is_confirmed: true })
        .eq("id", id)
    }

    carregarTreinos()
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

