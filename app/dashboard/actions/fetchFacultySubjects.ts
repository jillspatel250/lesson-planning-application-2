// "use server"

// import { createClient } from "@/utils/supabase/server"

// export const fetchFacultySubjects = async (userId: string) => {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from("user_role")
//     .select(`
//       id,
//       user_id,
//       role_name,
//       depart_id,
//       subject_id,
//       academic_year,
//       division,
//       departments:depart_id(
//         id,
//         name,
//         abbreviation_depart,
//         institutes:institute_id(
//           id,
//           name,
//           abbreviation_insti
//         )
//       ),
//       subjects:subject_id(
//         id,
//         code,
//         name,
//         semester,
//         lecture_hours,
//         lab_hours,
//         abbreviation_name,
//         credits,
//         is_practical,
//         is_theory
//       )
//     `)
//     .eq("user_id", userId)
//     .eq("role_name", "Faculty")
//     .not("subject_id", "is", null)

//   if (error) {
//     console.error("Error fetching faculty subjects:", error)
//     return []
//   }

//   return data || []
// }

"use server"

import { createClient } from "@/utils/supabase/server"

export const fetchFacultySubjects = async (facultyId: string) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("user_role")
      .select(`
        id,
        subject_id,
        academic_year,
        division,
        status,
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
        )
      `)
      .eq("user_id", facultyId)
      .eq("role_name", "Faculty")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching faculty subjects:", error)
      return []
    }

    // Filter out any null subjects and return with proper status
    return (data || [])
      .filter((item) => item.subjects !== null)
      .map((item) => ({
        ...item,
        // Use the status from user_role table, default to "Draft" if not set
        status: item.status || "Draft",
      }))
  } catch (error) {
    console.error("Error in fetchFacultySubjects:", error)
    return []
  }
}
