import { supabase } from "../config/supabaseClient.js"

export async function getTeamStats() {
  const { data, error } = await supabase
    .from("v_team_stats")
    .select("*")
    .single()

  if (error) {
    console.error("Erro ao buscar stats do time:", error)
    throw error
  }

  return data
}
