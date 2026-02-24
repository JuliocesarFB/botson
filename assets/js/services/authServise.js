import { supabase } from "../config/supabaseClient.js"

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function signOut() {
  await supabase.auth.signOut()
}
