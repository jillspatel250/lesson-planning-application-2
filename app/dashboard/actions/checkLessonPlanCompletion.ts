"use server"

import { createClient } from "@/utils/supabase/server"

export async function checkLessonPlanCompletion(subjectId: string) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, status: "in_progress" }
    }

    // Check if general details exist
    const { data: generalDetails } = await supabase
      .from("lesson_plans")
      .select("*")
      .eq("subject_id", subjectId)
      .single()

    if (!generalDetails) {
      return { success: true, status: "in_progress" }
    }

    // Check if subject type to determine required forms
    const { data: subject } = await supabase
      .from("subjects")
      .select("is_theory, is_practical")
      .eq("id", subjectId)
      .single()

    let allFormsCompleted = true

    // Always required: General details (if lesson_plans record exists, general details are done)
    // Always required: CIE planning
    const { data: cieData } = await supabase.from("cie_planning").select("id").eq("subject_id", subjectId).limit(1)

    if (!cieData || cieData.length === 0) {
      allFormsCompleted = false
    }

    // Always required: Additional info
    const { data: additionalInfo } = await supabase
      .from("additional_info")
      .select("id")
      .eq("subject_id", subjectId)
      .limit(1)

    if (!additionalInfo || additionalInfo.length === 0) {
      allFormsCompleted = false
    }

    // Check unit planning if theory subject
    if (subject?.is_theory) {
      const { data: unitData } = await supabase.from("unit_planning").select("id").eq("subject_id", subjectId).limit(1)

      if (!unitData || unitData.length === 0) {
        allFormsCompleted = false
      }
    }

    // Check practical planning if practical subject
    if (subject?.is_practical) {
      const { data: practicalData } = await supabase
        .from("practical_planning")
        .select("id")
        .eq("subject_id", subjectId)
        .limit(1)

      if (!practicalData || practicalData.length === 0) {
        allFormsCompleted = false
      }
    }

    return {
      success: true,
      status: allFormsCompleted ? "submitted" : "in_progress",
    }
  } catch (error) {
    console.error("Error checking lesson plan completion:", error)
    return { success: false, status: "in_progress" }
  }
}
