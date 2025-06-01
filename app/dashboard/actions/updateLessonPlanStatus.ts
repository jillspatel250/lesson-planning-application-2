// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"

// export const updateLessonPlanStatus = async (lessonPlanId: string, status: "active" | "completed") => {
//   try {
//     const supabase = await createClient()

//     const { error } = await supabase
//       .from("lesson_plans")
//       .update({
//         status,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", lessonPlanId)

//     if (error) {
//       console.error("Error updating lesson plan status:", error)
//       return { success: false, error: error.message }
//     }

//     revalidatePath("/dashboard/lesson-plans")
//     revalidatePath(`/dashboard/lesson-plans/${lessonPlanId}`)

//     return { success: true }
//   } catch (error) {
//     console.error("Unexpected error updating lesson plan status:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//     }
//   }
// }

"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateLessonPlanStatus(lessonPlanId: string, status: string) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Find the user record in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      throw new Error("User not found in database")
    }

    // Update the status in user_role table (which acts as lesson plans)
    const { error: updateError } = await supabase
      .from("user_role")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lessonPlanId)
      .eq("user_id", userData.id)

    if (updateError) {
      console.error("Error updating lesson plan status:", updateError)
      throw new Error("Failed to update lesson plan status")
    }

    // Also update lesson_plans table if it exists
    const { data: assignment } = await supabase.from("user_role").select("subject_id").eq("id", lessonPlanId).single()

    if (assignment) {
      await supabase.from("lesson_plans").upsert({
        faculty_id: userData.id,
        subject_id: assignment.subject_id,
        status: status,
        updated_at: new Date().toISOString(),
      })
    }

    revalidatePath("/dashboard/lesson-plans")

    return {
      success: true,
      message: `Lesson plan status updated to ${status}`,
    }
  } catch (error) {
    console.error("Error updating lesson plan status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    }
  }
}
