import { supabase } from "../config/supabaseClient.js"

export async function createMatch(match) {
  const { data, error } = await supabase
    .from("matches")
    .insert(match)

  if (error) throw error
  return data
}

export async function getMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")

  if (error) throw error
  return data
}
