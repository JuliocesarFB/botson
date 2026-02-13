import { supabase } from "../config/supabaseClient.js"

export async function getPlayers() {
  const { data, error } = await supabase
    .from("v_player_full_stats")
    .select("*");

  if (error) {
    console.error("Erro ao buscar jogadores:", error);
    throw error;
  }

  return data;
}

