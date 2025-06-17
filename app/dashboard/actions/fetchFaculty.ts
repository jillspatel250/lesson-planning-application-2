// "use server"

// import { createClient } from "@/utils/supabase/server";

// export const fetchFaculty = async () => {
//     const supabase = await createClient();

//     const { data: facultyData, error } = await supabase
//         .from("user_role")
//         .select("*, users(*), subjects(*)");

//     if (error) {
//         console.error("Error fetching faculty data:", error);
//         return [];
//     } 

//     return facultyData;
// }
"use server"

import { createClient } from "@/utils/supabase/server"

export async function fetchFaculty() {
  try {
    const supabase = await createClient()

    // Fetch faculty data with subjects - remove duplicates by using DISTINCT
    const { data: facultyData, error: facultyError } = await supabase
      .from("user_role")
      .select(`
        *,
        users (
          auth_id,
          name,
          email,
          profile_photo
        ),
        subjects (
          *, departments(*)
        )
      `)
      .eq("role_name", "Faculty")
      .not("subjects", "is", null) // Only get records where subjects is not null

    if (facultyError) {
      console.error("❌ Error fetching faculty data:", facultyError)
      return []
    }

    // Remove duplicates based on user_id and subject_id combination
    const uniqueFacultyData = facultyData.filter((item, index, self) => {
      return (
        index ===
        self.findIndex((t) => t.users?.auth_id === item.users?.auth_id && t.subjects?.id === item.subjects?.id)
      )
    })

    // Fetch form statuses for all faculty-subject combinations
    const { data: formsData, error: formsError } = await supabase.from("forms").select("faculty_id, subject_id, form")

    if (formsError) {
      console.error("❌ Error fetching forms data:", formsError)
      // Continue without forms data
    }

    // Create a map of faculty-subject to status
    const statusMap = new Map()
    if (formsData) {
      formsData.forEach((form) => {
        if (form.form?.additionalInfo?.completed_at) {
          // If additionalInfo is completed, mark as submitted
          statusMap.set(`${form.faculty_id}-${form.subject_id}`, "submitted")
        }
      })
    }

    // Add status to faculty data
    const facultyWithStatus = uniqueFacultyData.map((faculty) => {
      const key = `${faculty.id}-${faculty.subject_id}`
      const status = statusMap.get(key) || "In Progress"

      return {
        ...faculty,
        status: status,
      }
    })

    console.log(
      "📊 Faculty data with status:",
      facultyWithStatus.map((f) => ({
        name: f.subjects?.name,
        code: f.subjects?.code,
        status: f.status,
        faculty_id: f.id,
        subject_id: f.subject_id,
      })),
    )

    return facultyWithStatus
  } catch (error) {
    console.error("❌ Error in fetchFaculty:", error)
    return []
  }
}
