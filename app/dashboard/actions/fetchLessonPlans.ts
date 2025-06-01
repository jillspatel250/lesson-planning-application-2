"use server"

import { createClient } from "@/utils/supabase/server"

export const fetchLessonPlans = async (facultyId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("lesson_plans")
    .select(`
      id,
      faculty_id,
      subject_id,
      academic_year,
      division,
      status,
      created_at,
      updated_at,
      subjects(
        id,
        code,
        name,
        semester,
        lecture_hours,
        lab_hours,
        abbreviation_name,
        credits,
        is_practical,
        is_theory
      ),
      lesson_plan_topics(
        id,
        title,
        description,
        hours,
        order,
        is_completed
      )
    `)
    .eq("faculty_id", facultyId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching lesson plans:", error)
    return []
  }

  return data || []
}
