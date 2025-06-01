"use server"

import { createClient } from "@/utils/supabase/server"

export const fetchFacultyWithSubjects = async (departmentId: string) => {
  const supabase = await createClient()

  // First, get all faculty members in the department
  const { data: facultyData, error: facultyError } = await supabase
    .from("user_role")
    .select(`
      id,
      user_id,
      role_name,
      depart_id,
      users(
        id,
        auth_id,
        name,
        email,
        profile_photo
      )
    `)
    .eq("depart_id", departmentId)
    .eq("role_name", "Faculty")

  if (facultyError) {
    console.error("Error fetching faculty data:", facultyError)
    return []
  }

  // For each faculty member, get their assigned subjects
  const facultyWithSubjects = []

  for (const faculty of facultyData) {
    const { data: subjectsData, error: subjectsError } = await supabase
      .from("user_role")
      .select(`
        id,
        user_id,
        role_name,
        depart_id,
        subject_id,
        academic_year,
        division,
        subjects:subject_id(
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
        )
      `)
      //@ts-ignore
      .eq("user_id", faculty.users.id)
      .eq("role_name", "Faculty")
      .not("subject_id", "is", null)

    if (subjectsError) {
      console.error("Error fetching subject data for faculty:", subjectsError)
      continue
    }

    facultyWithSubjects.push({
      ...faculty,
      subjects: subjectsData || [],
    })
  }

  return facultyWithSubjects
}
