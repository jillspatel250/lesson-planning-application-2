"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface CIEData {
  id: string
  type: string
  units_covered?: string[]
  practicals_covered?: string[]
  date: string
  marks: number
  duration: number
  blooms_taxonomy: string[]
  evaluation_pedagogy: string
  other_pedagogy?: string
  co_mapping: string[]
  pso_mapping?: string[]
  peo_mapping?: string[]
  skill_mapping: Array<{
    skill: string
    details: string
  }>
}

export interface CIEPlanningFormData {
  faculty_id: string
  subject_id: string
  cies: CIEData[]
  remarks?: string
}

export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
  try {
    const supabase = await createClient()

    // Validate minimum requirements
    if (formData.cies.length < 3) {
      return {
        success: false,
        error: "Minimum 3 CIEs are required for theory subjects",
      }
    }

    // Check for date conflicts
    const dates = formData.cies.map((cie) => cie.date).filter(Boolean)
    const uniqueDates = new Set(dates)
    if (dates.length !== uniqueDates.size) {
      return {
        success: false,
        error: "CIE dates must be unique",
      }
    }

    // Validate date gaps
    const sortedDates = dates.sort()
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const daysDiff = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff < 7) {
        return {
          success: false,
          error: "CIE dates must be at least 7 days apart",
        }
      }
      if (daysDiff > 30) {
        return {
          success: false,
          error: "CIE dates must not exceed 30 days gap",
        }
      }
    }

    // Check required CIE types
    const cieTypes = formData.cies.map((cie) => cie.type)
    const requiredTypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
    const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))

    if (missingTypes.length > 0) {
      return {
        success: false,
        error: `Missing required CIE types: ${missingTypes.join(", ")}`,
      }
    }

    // Validate traditional pedagogy usage
    const traditionalPedagogies = [
      "Objective-Based Assessment (Quiz/MCQ)",
      "Short/Descriptive Evaluation",
      "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
      "Assignment-Based Evaluation (Homework/Take-home assignments)",
    ]

    const usedTraditional = formData.cies
      .map((cie) => cie.evaluation_pedagogy)
      .filter((pedagogy) => traditionalPedagogies.includes(pedagogy))

    const uniqueTraditional = new Set(usedTraditional)
    if (usedTraditional.length !== uniqueTraditional.size) {
      return {
        success: false,
        error: "Each traditional pedagogy method must be used only once across CIEs",
      }
    }

    // Check for at least one alternative pedagogy
    const hasAlternative = formData.cies.some((cie) => !traditionalPedagogies.includes(cie.evaluation_pedagogy))

    if (!hasAlternative) {
      return {
        success: false,
        error: "At least one alternative pedagogy is required",
      }
    }

    // Save to database (forms table with JSONB)
    const { data: existingForm, error: fetchError } = await supabase
      .from("forms")
      .select("*")
      .eq("faculty_id", formData.faculty_id)
      .eq("subject_id", formData.subject_id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      return {
        success: false,
        error: "Error fetching existing form",
      }
    }

    const formDataToSave = {
      faculty_id: formData.faculty_id,
      subject_id: formData.subject_id,
      form: {
        ...existingForm?.form,
        cie_planning: {
          cies: formData.cies,
          remarks: formData.remarks,
        },
      },
    }

    let result
    if (existingForm) {
      // Update existing form
      result = await supabase
        .from("forms")
        .update(formDataToSave)
        .eq("faculty_id", formData.faculty_id)
        .eq("subject_id", formData.subject_id)
    } else {
      // Insert new form
      result = await supabase.from("forms").insert(formDataToSave)
    }

    if (result.error) {
      console.error("Error saving CIE planning:", result.error)
      return {
        success: false,
        error: "Failed to save CIE planning data",
      }
    }

    revalidatePath("/dashboard/lesson-plans")

    return {
      success: true,
      message: "CIE planning saved successfully",
    }
  } catch (error) {
    console.error("Error in saveCIEPlanningForm:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
