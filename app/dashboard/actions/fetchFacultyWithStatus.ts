"use server"

import { createClient } from "@/utils/supabase/server"

export async function fetchFacultyWithStatus() {
  try {
    const supabase = await createClient()

    // Fetch faculty data with subjects
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
          id,
          name,
          code,
          semester,
          credits,
          department_id
        )
      `)
      .eq("role_name", "Faculty")

    if (facultyError) {
      console.error("❌ Error fetching faculty data:", facultyError)
      return []
    }

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
        const key = `${form.faculty_id}-${form.subject_id}`
        const status = form.form?.status || "In Progress"
        statusMap.set(key, status)
      })
    }

    // Add status to faculty data
    const facultyWithStatus = facultyData.map((faculty) => {
      const key = `${faculty.id}-${faculty.subject_id}`
      const status = statusMap.get(key) || "In Progress"

      return {
        ...faculty,
        status: status,
      }
    })

    console.log("📊 Faculty data with status:", facultyWithStatus.length, "records")
    return facultyWithStatus
  } catch (error) {
    console.error("❌ Error in fetchFacultyWithStatus:", error)
    return []
  }
}
