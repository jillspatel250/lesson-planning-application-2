"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { saveAdditionalInfoSchema } from "@/utils/schema"
import { z } from "zod"

export async function saveAdditionalInfoForm(data: z.infer<typeof saveAdditionalInfoSchema>) {
  try {
    const validatedData = saveAdditionalInfoSchema.parse(data)
    const supabase = await createClient()

    // Check if a form already exists for this faculty and subject
    const { data: existingForm, error: fetchError } = await supabase
      .from("forms")
      .select("id, form")
      .eq("faculty_id", validatedData.faculty_id)
      .eq("subject_id", validatedData.subject_id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing form:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Prepare the additional info data in BSON format structure
    const additionalInfoData = {
      faculty_id: validatedData.faculty_id,
      subject_id: validatedData.subject_id,
      classroom_conduct: validatedData.formData.classroom_conduct,
      attendance_policy: validatedData.formData.attendance_policy,
      lesson_planning_guidelines: validatedData.formData.lesson_planning_guidelines || "",
      cie_guidelines: validatedData.formData.cie_guidelines,
      self_study_guidelines: validatedData.formData.self_study_guidelines,
      topics_beyond_syllabus: validatedData.formData.topics_beyond_syllabus || "",
      reference_materials: validatedData.formData.reference_materials,
      academic_integrity: validatedData.formData.academic_integrity,
      communication_channels: validatedData.formData.communication_channels,
      interdisciplinary_integration: validatedData.formData.interdisciplinary_integration || "",
      events: validatedData.formData.events || [],
    }

    if (existingForm) {
      // Update existing form
      const existingFormData = existingForm.form || {}
      const updatedFormData = {
        ...existingFormData,
        additionalInfo: additionalInfoData,
      }

      const { error: updateError } = await supabase
        .from("forms")
        .update({ form: updatedFormData })
        .eq("id", existingForm.id)

      if (updateError) {
        console.error("Error updating form:", updateError)
        return { success: false, error: updateError.message }
      }
    } else {
      // Create new form with just additional info
      const formData = {
        additionalInfo: additionalInfoData,
      }

      const { error: insertError } = await supabase.from("forms").insert({
        faculty_id: validatedData.faculty_id,
        subject_id: validatedData.subject_id,
        form: formData,
      })

      if (insertError) {
        console.error("Error creating form:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    revalidatePath("/dashboard/lesson-plans")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error saving additional info form:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
