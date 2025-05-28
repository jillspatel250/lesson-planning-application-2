"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addFaculty(formData: FormData) {
  try {
    const supabase = createClient()

    const userId = formData.get("userId") as string
    const departId = formData.get("departId") as string
    const subjectId = (formData.get("subjectId") as string) || null
    const academic_year = formData.get("academicYear") as string
    const division = formData.get("division") as string

    // Insert into user_role table
    const { data, error } = await (await supabase)
      .from("user_role")
      .insert({
        user_id: userId,
        role_name: "Faculty",
        depart_id: departId,
        subject_id: subjectId,
        academic_year: academic_year,
        division: division,
      })
      .select()

    if (error) {
      console.log("Error inserting into user_role:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("Error adding faculty:", error)
    return { success: false, error: "Failed to add faculty" }
  }
}

export async function editFaculty(formData: FormData) {
  try {
    const supabase = createClient()

    const id = formData.get("id") as string
    const userId = formData.get("userId") as string
    const departId = formData.get("departId") as string
    const subjectId = (formData.get("subjectId") as string) || null
    const academic_year = formData.get("academicYear") as string
    const division = formData.get("division") as string

    // Update user_role table
    const { data, error } = await (await supabase)
      .from("user_role")
      .update({
        user_id: userId,
        role_name: "Faculty",
        depart_id: departId,
        subject_id: subjectId,
        academic_year: academic_year,
        division: division,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.log("Error updating user_role:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("Error editing faculty:", error)
    return { success: false, error: "Failed to edit faculty" }
  }
}

export async function deleteFaculty(id: string) {
  try {
    const supabase = createClient()

    // Delete from user_role table
    const { error } = await (await supabase).from("user_role").delete().eq("id", id)

    if (error) {
      console.log("Error deleting from user_role:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting faculty:", error)
    return { success: false, error: "Failed to delete faculty" }
  }
}
