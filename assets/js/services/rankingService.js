import { supabase } from "../config/supabaseClient.js"

export async function getRanking() {
  const { data, error } = await supabase
    .from("v_ranking_presence")
    .select("*")
    .order("matches_played", { ascending: false })

  if (error) {
    console.error("Erro ao buscar ranking:", error)
    throw error
  }

  return data
}
