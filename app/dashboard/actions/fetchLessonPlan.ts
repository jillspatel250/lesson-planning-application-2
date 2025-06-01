//@ts-ignore
// "use server"

// import { createClient } from "@/utils/supabase/server"

// export async function fetchLessonPlan(facultySubjectId: string) {
//   const supabase = await createClient()

//   try {
//     const { 
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       throw new Error("Authentication required")
//     }

//     // Fetch lesson plan with all related data
//     const { data: lessonPlan, error: lessonPlanError } = await supabase
//       .from("lesson_plans")
//       .select(
//         `
//         *,
//         course_outcomes(*),
//         lesson_plan_units(*),
//         lesson_plan_practicals(*),
//         lesson_plan_cies(*),
//         lesson_plan_additional_info(*)
//       `,
//       )
//       .eq("faculty_subject_id", facultySubjectId)
//       .eq("faculty_id", user.id)
//       .single()

//     if (lessonPlanError && lessonPlanError.code !== "PGRST116") {
//       throw lessonPlanError
//     }

//     return { success: true, data: lessonPlan }
//   } catch (error) {
//     console.error("Error fetching lesson plan:", error)
//     return { success: false, error: error.message }
//   }
// }

// export async function fetchLessonPlanStatus(facultySubjectId: string) {
//   const supabase = await createClient()

//   try {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       return { status: "draft" }
//     }

//     const { data: lessonPlan } = await supabase
//       .from("lesson_plans")
//       .select("status")
//       .eq("faculty_subject_id", facultySubjectId)
//       .eq("faculty_id", user.id)
//       .single()

//     return { status: lessonPlan?.status || "draft" }
//   } catch (error) {
//     return { status: "draft" }
//   }
// }
"use server"

import { createClient } from "@/utils/supabase/server"

export async function fetchLessonPlan(assignmentId: string) {
  try {
    const supabase = await createClient()

    // Get the user role assignment first
    const { data: assignment, error: assignmentError } = await supabase
      .from("user_role")
      .select(`
        *,
        subjects (*),
        users (*)
      `)
      .eq("id", assignmentId)
      .single()

    if (assignmentError || !assignment) {
      throw new Error("Assignment not found")
    }

    // Get lesson plan data separately to avoid relationship issues
    const { data: lessonPlanData, error: lessonPlanError } = await supabase
      .from("lesson_plans")
      .select("*")
      .eq("subject_id", assignment.subjects.id)
      .eq("faculty_id", assignment.users.id)
      .single()

    // Get course outcomes separately
    const { data: courseOutcomes, error: coError } = await supabase
      .from("course_outcomes")
      .select("*")
      .eq("subject_id", assignment.subjects.id)

    // Get units separately
    const { data: units, error: unitsError } = await supabase
      .from("lesson_plan_units")
      .select("*")
      .eq("lesson_plan_id", lessonPlanData?.id || "")

    // Get practicals separately
    const { data: practicals, error: practicalsError } = await supabase
      .from("lesson_plan_practicals")
      .select("*")
      .eq("lesson_plan_id", lessonPlanData?.id || "")

    // Get CIEs separately
    const { data: cies, error: ciesError } = await supabase
      .from("lesson_plan_cies")
      .select("*")
      .eq("lesson_plan_id", lessonPlanData?.id || "")

    // Get additional info separately
    const { data: additionalInfo, error: additionalError } = await supabase
      .from("lesson_plan_additional_info")
      .select("*")
      .eq("lesson_plan_id", lessonPlanData?.id || "")
      .single()

    // Check for faculty sharing
    const { data: sharingFaculty, error: sharingError } = await supabase
      .from("user_role")
      .select(`
        *,
        users (*)
      `)
      .eq("subject_id", assignment.subjects.id)
      .eq("role_name", "Faculty")

    const isSharing = sharingFaculty && sharingFaculty.length > 1
    const allFaculty =
      sharingFaculty?.map((sf) => ({
        id: sf.users.id,
        name: sf.users.name,
        email: sf.users.email,
      })) || []

    // Construct the lesson plan object
    const lessonPlan = {
      id: lessonPlanData?.id || assignmentId,
      subject: {
        id: assignment.subjects.id,
        code: assignment.subjects.code,
        name: assignment.subjects.name,
        semester: assignment.subjects.semester,
        lecture_hours: assignment.subjects.lecture_hours,
        lab_hours: assignment.subjects.lab_hours,
        abbreviation_name: assignment.subjects.abbreviation_name,
        credits: assignment.subjects.credits,
        is_theory: assignment.subjects.is_theory,
        is_practical: assignment.subjects.is_practical,
        department: {
          id: assignment.subjects.department_id,
          name: "Computer Science and Engineering", // You might want to fetch this
          abbreviation_depart: "CSE",
        },
      },
      faculty: {
        id: assignment.users.id,
        name: assignment.users.name,
        email: assignment.users.email,
      },
      academic_year: assignment.academic_year || "2025",
      division: assignment.division || "Division 1",
      term_start_date: lessonPlanData?.term_start_date || "2024-12-10",
      term_end_date: lessonPlanData?.term_end_date || "2025-05-30",
      course_prerequisites: lessonPlanData?.course_prerequisites || "",
      course_prerequisites_materials: lessonPlanData?.course_prerequisites_materials || "",
      courseOutcomes: courseOutcomes || [],
      units: units || [],
      practicals: practicals || [],
      cies: cies || [],
      additional_info: additionalInfo || {},
      status: lessonPlanData?.status || "In Progress",
      is_sharing: isSharing,
      sharing_faculty: allFaculty,
      general_details_completed: lessonPlanData?.general_details_completed || false,
      unit_planning_completed: lessonPlanData?.unit_planning_completed || false,
      practical_planning_completed: lessonPlanData?.practical_planning_completed || false,
      cie_planning_completed: lessonPlanData?.cie_planning_completed || false,
      additional_info_completed: lessonPlanData?.additional_info_completed || false,
    }

    return {
      success: true,
      data: lessonPlan,
    }
  } catch (error) {
    console.error("Error fetching lesson plan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch lesson plan",
    }
  }
}
