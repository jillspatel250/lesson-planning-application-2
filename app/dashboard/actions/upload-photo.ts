"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role for server operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function updateUserProfilePhoto(userId: string, photoUrl: string) {
  try {
    const { error } = await supabase.from("users").update({ profile_photo: photoUrl }).eq("id", userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile photo:", error)
    return { success: false, error }
  }
}
