"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import type { PracticalPlanningFormValues } from "@/utils/schema"

interface SavePracticalPlanningParams {
  faculty_id: string
  subject_id: string
  formData: PracticalPlanningFormValues
}

export async function savePracticalPlanningForm({ faculty_id, subject_id, formData }: SavePracticalPlanningParams) {
  try {
    const supabase = await createClient()

    // Validate the form data
    const validationResult = validatePracticalPlanning(formData)
    if (!validationResult.isValid) {
      return {
        success: false,
        error: validationResult.message,
      }
    }

    // Check if a form already exists for this faculty and subject
    const { data: existingForm, error: fetchError } = await supabase
      .from("forms")
      .select("*")
      .eq("faculty_id", faculty_id)
      .eq("subject_id", subject_id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing form:", fetchError)
      return {
        success: false,
        error: "Failed to check existing form",
      }
    }

    const formPayload = {
      faculty_id,
      subject_id,
      form: {
        ...existingForm?.form,
        practicals: formData.practicals.map((practical) => ({
          ...practical,
          // Make sure faculty assignment data is included
          assigned_faculty_id: practical.assigned_faculty_id || faculty_id,
          faculty_name: practical.faculty_name || "Current Faculty",
        })),
        practical_remarks: formData.remarks,
        practical_planning_completed: true,
        last_updated: new Date().toISOString(),
      },
    }

    let result
    if (existingForm) {
      // Update existing form
      result = await supabase.from("forms").update(formPayload).eq("id", existingForm.id).select().single()
    } else {
      // Create new form
      result = await supabase.from("forms").insert(formPayload).select().single()
    }

    if (result.error) {
      console.error("Error saving practical planning form:", result.error)
      return {
        success: false,
        error: "Failed to save practical planning form",
      }
    }

    revalidatePath("/dashboard/lesson-plans")
    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error("Unexpected error saving practical planning form:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

function validatePracticalPlanning(formData: PracticalPlanningFormValues) {
  const errors: string[] = []

  // Check if at least one practical exists
  if (!formData.practicals || formData.practicals.length === 0) {
    errors.push("At least one practical must be defined.")
  }

  // Validate each practical
  formData.practicals.forEach((practical, index) => {
    const practicalNum = index + 1

    // Required field validations
    if (!practical.practical_aim?.trim()) {
      errors.push(`Practical ${practicalNum}: Practical aim is required.`)
    }

    if (!practical.associated_units || practical.associated_units.length === 0) {
      errors.push(`Practical ${practicalNum}: At least one associated unit must be selected.`)
    }

    if (!practical.probable_week?.trim()) {
      errors.push(`Practical ${practicalNum}: Probable week is required.`)
    }

    if (!practical.lab_hours || practical.lab_hours < 1) {
      errors.push(`Practical ${practicalNum}: Lab hours must be at least 1.`)
    }

    if (!practical.software_hardware_requirements?.trim()) {
      errors.push(`Practical ${practicalNum}: Software/Hardware requirements are required.`)
    }

    if (!practical.practical_tasks?.trim()) {
      errors.push(`Practical ${practicalNum}: Practical tasks/problem statement is required.`)
    }

    if (!practical.evaluation_methods || practical.evaluation_methods.length === 0) {
      errors.push(`Practical ${practicalNum}: At least one evaluation method must be selected.`)
    }

    if (!practical.practical_pedagogy?.trim()) {
      errors.push(`Practical ${practicalNum}: Practical pedagogy is required.`)
    }

    if (!practical.reference_material?.trim()) {
      errors.push(`Practical ${practicalNum}: Reference material is required.`)
    }

    if (!practical.co_mapping || practical.co_mapping.length === 0) {
      errors.push(`Practical ${practicalNum}: At least one CO mapping must be selected.`)
    }

    if (!practical.blooms_taxonomy || practical.blooms_taxonomy.length === 0) {
      errors.push(`Practical ${practicalNum}: At least one Bloom's taxonomy level must be selected.`)
    }

    if (!practical.skill_mapping || practical.skill_mapping.length === 0) {
      errors.push(`Practical ${practicalNum}: At least one skill mapping must be selected.`)
    }

    if (!practical.skill_objectives?.trim()) {
      errors.push(`Practical ${practicalNum}: Skill objectives are required.`)
    }

    // Validate "Other" fields
    if (practical.evaluation_methods?.includes("Other") && !practical.other_evaluation_method?.trim()) {
      errors.push(`Practical ${practicalNum}: Other evaluation method must be specified when "Other" is selected.`)
    }

    if (practical.practical_pedagogy === "Other" && !practical.other_pedagogy?.trim()) {
      errors.push(`Practical ${practicalNum}: Other pedagogy must be specified when "Other" is selected.`)
    }
  })

  if (errors.length > 0) {
    const message = `Dear Professor,

Kindly review the following requirements before saving the form:

${errors.map((error) => `• ${error}`).join("\n")}

We appreciate your attention to detail in maintaining the academic integrity of your course design.`

    return {
      isValid: false,
      message,
    }
  }

  return {
    isValid: true,
    message: "",
  }
}
