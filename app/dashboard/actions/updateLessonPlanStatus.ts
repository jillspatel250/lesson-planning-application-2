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

export async function updateLessonPlanStatus(facultyId: string, subjectId: string, status: string) {
  try {
    console.log(`🔄 Updating lesson plan status for faculty: ${facultyId}, subject: ${subjectId} to ${status}`)

    const supabase = await createClient()

    // Update the status in the user_role table
    const { error } = await supabase.from("user_role").update({ status: status.toLowerCase() }).eq("id", facultyId)

    if (error) {
      console.error("Error updating status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateLessonPlanStatus:", error)
    return { success: false, error: String(error) }
  }
}
