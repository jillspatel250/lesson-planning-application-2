"use server"

import { createClient } from "@/utils/supabase/server"

export async function initializeLessonPlan(facultySubjectId: string, facultyId: string, subjectId: string) {
  const supabase = await createClient()

  try {
    // Check if lesson plan already exists
    const { data: existingPlan } = await supabase
      .from("lesson_plans")
      .select("id")
      .eq("faculty_subject_id", facultySubjectId)
      .eq("faculty_id", facultyId)
      .single()

    if (existingPlan) {
      return { success: true, lessonPlanId: existingPlan.id, message: "Lesson plan already exists" }
    }

    // Create new lesson plan with "in_progress" status
    const { data: newPlan, error } = await supabase
      .from("lesson_plans")
      .insert({
        faculty_subject_id: facultySubjectId,
        faculty_id: facultyId,
        subject_id: subjectId,
        status: "in_progress",
        general_details_completed: false,
        unit_planning_completed: false,
        practical_planning_completed: false,
        cie_planning_completed: false,
        additional_info_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating lesson plan:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      lessonPlanId: newPlan.id,
      message: "Lesson plan initialized with 'In Progress' status",
    }
  } catch (error) {
    console.error("Error initializing lesson plan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initialize lesson plan",
    }
  }
}
