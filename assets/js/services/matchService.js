import { supabase } from "../config/supabaseClient.js"
import { getUser } from "./authService.js"

export async function createMatch(match) {
  const user = await getUser()

  if (!user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from("matches")
    .insert({
      ...match,
      user_id: user.id
    })

  if (error) throw error
  return data
}


export async function getMatches() {
  const user = await getUser()

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("user_id", user.id)

  if (error) throw error
  return data
}

