// @ts-nocheck
"use server"

import { createClient } from "@/utils/supabase/server"

export async function fetchLessonPlanStatus(facultySubjectId: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Get lesson plan and subject details
    const { data: lessonPlan, error: lessonPlanError } = await supabase
      .from("lesson_plans")
      .select(`
        *,
        subjects (
          is_theory,
          is_practical
        )
      `)
      .eq("faculty_subject_id", facultySubjectId)
      .eq("faculty_id", user.id)
      .single()

    if (lessonPlanError && lessonPlanError.code !== "PGRST116") {
      throw lessonPlanError
    }

    // If no lesson plan exists, status is "draft"
    if (!lessonPlan) {
      return { success: true, status: "draft" }
    }

    // Check completion status based on subject type
    const subject = lessonPlan.subjects
    const requiredSections = ["general_details", "cie_planning", "additional_info"]

    // Add unit planning for theory subjects
    if (subject.is_theory) {
      requiredSections.push("unit_planning")
    }

    // Add practical planning for practical subjects
    if (subject.is_practical) {
      requiredSections.push("practical_planning")
    }

    // Check if all required sections are completed
    const completedSections = requiredSections.filter((section) => lessonPlan[`${section}_completed`] === true)

    let status = "draft"
    if (completedSections.length === 0) {
      status = "draft"
    } else if (completedSections.length === requiredSections.length) {
      status = "submitted"
    } else {
      status = "in_progress"
    }

    return {
      success: true,
      status,
      completedSections: completedSections.length,
      totalSections: requiredSections.length,
    }
  } catch (error) {
    console.error("Error fetching lesson plan status:", error)
    return { success: false, error: error.message }
  }
}
