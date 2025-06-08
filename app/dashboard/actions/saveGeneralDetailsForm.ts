//@ts-nocheck
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveGeneralDetailsForm(formData: any) {
  console.log("Server action received form data:", formData)

  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    console.log("Authenticated user:", user.id)

    // Find the user record in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      console.error("Error finding user:", userError)

      // Try finding by email as fallback
      if (user.email) {
        const { data: userByEmail, error: emailError } = await supabase
          .from("users")
          .select("id, name, email")
          .eq("email", user.email)
          .single()

        if (emailError || !userByEmail) {
          console.error("Error finding user by email:", emailError)
          return { success: false, error: "User not found in database" }
        }

        // Use the user found by email
        const userData = userByEmail
      } else {
        return { success: false, error: "User not found in database" }
      }
    }

    console.log("Found user in database:", userData)

    const faculty_id = userData.id

    // Check if a form already exists for this faculty and subject
    const { data: existingForm, error: fetchError } = await supabase
      .from("forms")
      .select("id, form")
      .eq("faculty_id", faculty_id)
      .eq("subject_id", formData.subject_id)
      .single()

    console.log("Existing form check:", existingForm, fetchError)

    // Ensure dates are properly formatted as Date objects for storage
    const term_start_date =
      formData.term_start_date instanceof Date ? formData.term_start_date : new Date(formData.term_start_date)

    const term_end_date =
      formData.term_end_date instanceof Date ? formData.term_end_date : new Date(formData.term_end_date)

    // Prepare the form data in BSON format structure with Date objects
    const formDataToSave = {
      generalDetails: {
        division: formData.division,
        lecture_hours: formData.lecture_hours,
        lab_hours: formData.lab_hours,
        credits: formData.credits,
        term_start_date: term_start_date, // Store as Date object
        term_end_date: term_end_date, // Store as Date object
        course_prerequisites: formData.course_prerequisites,
        course_prerequisites_materials: formData.course_prerequisites_materials,
        courseOutcomes: formData.courseOutcomes,
        remarks: formData.remarks || "",
      },
    }

    console.log("Form data to save:", formDataToSave)

    let result

    if (existingForm) {
      console.log("Updating existing form...")
      // Update existing form - merge with existing data
      const existingFormData = existingForm.form || {}
      const updatedFormData = {
        ...existingFormData,
        generalDetails: formDataToSave.generalDetails,
      }

      result = await supabase.from("forms").update({ form: updatedFormData }).eq("id", existingForm.id)
    } else {
      console.log("Creating new form...")
      // Create new form
      result = await supabase.from("forms").insert({
        faculty_id: faculty_id,
        subject_id: formData.subject_id,
        form: formDataToSave,
      })
    }

    console.log("Database operation result:", result)

    if (result.error) {
      console.error("Error saving form:", result.error)
      return { success: false, error: result.error.message }
    }

    // Update lesson plan status to "In Progress" after saving general details
    const { error: statusError } = await supabase.from("lesson_plans").upsert(
      {
        faculty_id: faculty_id,
        subject_id: formData.subject_id,
        status: "In Progress",
        general_details_completed: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "faculty_id,subject_id",
      },
    )

    if (statusError) {
      console.error("Error updating lesson plan status:", statusError)
    }

    // Also update the user_role table status if it exists
    const { error: userRoleError } = await supabase
      .from("user_role")
      .update({ status: "In Progress" })
      .eq("user_id", faculty_id)
      .eq("subject_id", formData.subject_id)

    if (userRoleError) {
      console.error("Error updating user role status:", userRoleError)
    }

    revalidatePath("/dashboard/lesson-plans")
    return { success: true, message: "General details saved successfully!" }
  } catch (error) {
    console.error("Unexpected error saving general details form:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
