"use server"

import { createClient } from "@/utils/supabase/server"

export async function debugStatusUpdate(facultyId: string, subjectId: string) {
  try {
    console.log("🔍 DEBUG: Starting status update debug...")
    console.log("🔑 Faculty ID:", facultyId)
    console.log("🎯 Subject ID:", subjectId)

    const supabase = await createClient()

    // First, let's see what records exist in user_role table
    const { data: allUserRoles, error: allError } = await supabase.from("user_role").select("*").limit(10)

    console.log("📊 All user_role records (first 10):", allUserRoles)

    // Check if we can find the specific record
    const { data: specificRecord, error: specificError } = await supabase
      .from("user_role")
      .select("*")
      .eq("id", facultyId)

    console.log("🎯 Specific record by ID:", specificRecord)

    // Try to find by user_id instead
    const { data: byUserId, error: userIdError } = await supabase.from("user_role").select("*").eq("user_id", facultyId)

    console.log("👤 Records by user_id:", byUserId)

    // Try to find by subject_id
    const { data: bySubjectId, error: subjectIdError } = await supabase
      .from("user_role")
      .select("*")
      .eq("subject_id", subjectId)

    console.log("📚 Records by subject_id:", bySubjectId)

    // Try to find by both user_id and subject_id
    const { data: byBoth, error: bothError } = await supabase
      .from("user_role")
      .select("*")
      .eq("user_id", facultyId)
      .eq("subject_id", subjectId)

    console.log("🎯 Records by both user_id and subject_id:", byBoth)

    return {
      success: true,
      data: {
        allUserRoles,
        specificRecord,
        byUserId,
        bySubjectId,
        byBoth,
      },
    }
  } catch (error) {
    console.error("❌ Debug error:", error)
    return { success: false, error: String(error) }
  }
}
