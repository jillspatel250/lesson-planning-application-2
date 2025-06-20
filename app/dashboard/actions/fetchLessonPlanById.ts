"use server"

import { createClient } from "@/utils/supabase/server"

export async function fetchLessonPlanById(lessonPlanId: string) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Find the user record in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      // Try finding by email as fallback
      if (user.email) {
        const { data: userByEmail, error: emailError } = await supabase
          .from("users")
          .select("id, name, email")
          .eq("email", user.email)
          .single()

        if (emailError || !userByEmail) {
          throw new Error("User not found in database")
        }

        const userData = userByEmail
      } else {
        throw new Error("User not found in database")
      }
    }

    // Get the user role assignment for this lesson plan with complete subjects data
    const { data: assignment, error: assignmentError } = await supabase
      .from("user_role")
      .select(`
        *,
        subjects (
          id,
          code,
          name,
          semester,
          lecture_hours,
          lab_hours,
          abbreviation_name,
          credits,
          department_id,
          is_practical,
          is_theory,
          metadata,
          lesson_plan_status
        ),
        users (*),
        departments(*)
      `)
      .eq("id", lessonPlanId)
      .single()

    if (assignmentError || !assignment) {
      throw new Error("Assignment not found")
    }

    // Get existing form data
    const { data: existingForm, error: formError } = await supabase
      .from("forms")
      .select("form, complete_general, complete_unit, complete_practical, complete_cie, complete_additional")
      // @ts-ignore
      .eq("faculty_id", userData.id)
      .eq("subject_id", assignment.subjects.id)
      .single()

      console.log("Existing Form Data:", existingForm)

    // Get lesson plan data
    const { data: lessonPlanData, error: lessonPlanError } = await supabase
      .from("lesson_plans")
      .select("*")
      .eq("subject_id", assignment.subjects.id)
      // @ts-ignore
      .eq("faculty_id", userData.id)
      .single()

    // Check for faculty sharing - UPDATED LOGIC FOR SAME DIVISION ONLY
    const { data: allFacultyAssignments, error: sharingError } = await supabase
      .from("user_role")
      .select(`
        *,
        users (*)
      `)
      .eq("subject_id", assignment.subjects.id)
      .eq("role_name", "Faculty")

    let isSharing = false
    let allFaculty: any[] = []

    if (allFacultyAssignments && allFacultyAssignments.length > 0) {
      // Group by division to check for sharing within same division
      const divisionGroups = allFacultyAssignments.reduce(
        (acc, facultyAssignment) => {
          const division = facultyAssignment.division || "default"
          if (!acc[division]) {
            acc[division] = []
          }
          acc[division].push(facultyAssignment)
          return acc
        },
        {} as Record<string, any[]>,
      )

      // Check if any division has multiple faculty (sharing within same division)
      for (const [division, assignments] of Object.entries(divisionGroups)) {
        // @ts-ignore
        if (assignments.length > 1) {
          isSharing = true
          // Get unique faculty for this division
          // @ts-ignore
          const uniqueFaculty = assignments.reduce((acc, facultyAssignment) => {
            const facultyId = facultyAssignment.users?.id
            if (facultyId && !acc.find((f: any) => f.id === facultyId)) {
              acc.push({
                id: facultyId,
                name: facultyAssignment.users.name,
                email: facultyAssignment.users.email,
                division: division,
              })
            }
            return acc
          }, [])

          allFaculty = [...allFaculty, ...uniqueFaculty]
          break // We found sharing in at least one division, that's enough
        }
      }

      // If no sharing within same division, still get all faculty for reference
      if (!isSharing) {
        allFaculty = allFacultyAssignments.reduce((acc, facultyAssignment) => {
          const facultyId = facultyAssignment.users?.id
          if (facultyId && !acc.find((f: any) => f.id === facultyId)) {
            acc.push({
              id: facultyId,
              name: facultyAssignment.users.name,
              email: facultyAssignment.users.email,
              division: facultyAssignment.division || "default",
            })
          }
          return acc
        }, [])
      }
    }

    // Extract saved form data
    const savedFormData = existingForm?.form || {}
    const generalDetails = savedFormData.generalDetails || {}
    const units = savedFormData.units || []
    const practicals = savedFormData.practicals || []
    const cies = savedFormData.cies || []
    const additionalInfo = savedFormData.additionalInfo || {}

    // Process units to include faculty assignments
    const processedUnits = units.map((unit: any) => {
      // Ensure faculty assignment data is included
      return {
        ...unit,
        assigned_faculty_id: unit.assigned_faculty_id || null,
        faculty_name: unit.faculty_name || null,
      }
    })

    // Process practicals to include faculty assignments
    const processedPracticals = practicals.map((practical: any) => {
      // Ensure faculty assignment data is included
      return {
        ...practical,
        assigned_faculty_id: practical.assigned_faculty_id || null,
        faculty_name: practical.faculty_name || null,
      }
    })

    // Construct the lesson plan object with saved data including all subjects table fields
    const lessonPlan = {
      id: lessonPlanData?.id || lessonPlanId,
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
        metadata: assignment.subjects.metadata || {},
        pso: assignment.subjects.pso || [],
        peo: assignment.subjects.peo || [],
        lesson_plan_status: assignment.subjects.lesson_plan_status || 'draft',
        department: {
          id: assignment.subjects.department_id,
          name: assignment.departments.name,
          abbreviation_depart: assignment.departments.abbreviation_depart,
        },
      },
      faculty: {
        id: assignment.users.id,
        name: assignment.users.name,
        email: assignment.users.email,
      },
      academic_year: assignment.academic_year || "2025",
      division: generalDetails.division || assignment.division || "Division 1",
      credits: generalDetails.credits || assignment.subjects.credits || 0,
      lab_hours: generalDetails.lab_hours || assignment.subjects.lab_hours || 0,
      lecture_hours: generalDetails.lecture_hours || assignment.subjects.lecture_hours || 0,
      term_start_date: generalDetails.term_start_date || lessonPlanData?.term_start_date || "2024-12-10",
      term_end_date: generalDetails.term_end_date || lessonPlanData?.term_end_date || "2025-05-30",
      course_prerequisites: generalDetails.course_prerequisites || "",
      course_prerequisites_materials: generalDetails.course_prerequisites_materials || "",
      courseOutcomes: generalDetails.courseOutcomes || [],
      units: processedUnits,
      practicals: processedPracticals,
      cies: cies,
      additional_info: additionalInfo,
      unit_remarks: savedFormData.unit_remarks || "",
      practical_remarks: savedFormData.practical_remarks || "",
      cie_remarks: savedFormData.cie_remarks || "",
      status: lessonPlanData?.status || assignment.status || "Draft",
      is_sharing: isSharing, // Updated logic - only true for same division sharing
      sharing_faculty: allFaculty,
      general_details_completed: lessonPlanData?.general_details_completed || false,
      unit_planning_completed: lessonPlanData?.unit_planning_completed || false,
      practical_planning_completed: lessonPlanData?.practical_planning_completed || false,
      cie_planning_completed: lessonPlanData?.cie_planning_completed || false,
      additional_info_completed: lessonPlanData?.additional_info_completed || false,
      complete_general: existingForm?.complete_general || false,
      complete_unit: existingForm?.complete_unit || false, 
      complete_practical: existingForm?.complete_practical || false,
      complete_cie: existingForm?.complete_cie || false,
      complete_additional: existingForm?.complete_additional || false,
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



// "use server"

// import { createClient } from "@/utils/supabase/server"

// export async function fetchLessonPlanById(lessonPlanId: string) {
//   try {
//     const supabase = await createClient()

//     // Get the authenticated user
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       throw new Error("Authentication required")
//     }

//     console.log("🔍 Looking for lesson plan ID:", lessonPlanId)

//     // 🚀 SIMPLE APPROACH: Find form data directly by ID
//     const { data: formData, error: formError } = await supabase
//       .from("forms")
//       .select(`
//         *,
//         users!forms_faculty_id_fkey (
//           id,
//           name,
//           email
//         ),
//         subjects!forms_subject_id_fkey (
//           id,
//           code,
//           name,
//           semester,
//           lecture_hours,
//           lab_hours,
//           abbreviation_name,
//           credits,
//           department_id,
//           is_practical,
//           is_theory,
//           metadata,
//           departments (
//             id,
//             name,
//             abbreviation_depart
//           )
//         )
//       `)
//       .eq("id", lessonPlanId)
//       .single()

//     if (formError || !formData) {
//       console.error("❌ Form not found for ID:", lessonPlanId)

//       // 🚀 FALLBACK: Show available form IDs
//       const { data: availableForms } = await supabase.from("forms").select("id, subjects(name), users(name)").limit(10)

//       if (availableForms) {
//         console.log("📋 Available form IDs:")
//         availableForms.forEach((form) => {
//           console.log(`- ID: ${form.id} | Subject: ${form.subjects?.name} | Faculty: ${form.users?.name}`)
//         })
//       }

//       throw new Error(`Form not found for lesson plan ID: ${lessonPlanId}`)
//     }

//     console.log("✅ Found form data for:", formData.subjects?.name)

//     // Extract saved form data
//     const savedFormData = formData.form || {}
//     const generalDetails = savedFormData.generalDetails || {}
//     const units = savedFormData.units || []
//     const practicals = savedFormData.practicals || []
//     const cies = savedFormData.cies || []
//     const additionalInfo = savedFormData.additionalInfo || {}

//     console.log("📊 Data summary:", {
//       generalDetails: !!generalDetails,
//       units: units.length,
//       practicals: practicals.length,
//       cies: cies.length,
//       additionalInfo: !!additionalInfo,
//     })

//     // Process units to include faculty assignments
//     const processedUnits = units.map((unit: any) => ({
//       ...unit,
//       assigned_faculty_id: unit.assigned_faculty_id || null,
//       faculty_name: unit.faculty_name || null,
//     }))

//     // Process practicals to include faculty assignments
//     const processedPracticals = practicals.map((practical: any) => ({
//       ...practical,
//       assigned_faculty_id: practical.assigned_faculty_id || null,
//       faculty_name: practical.faculty_name || null,
//     }))

//     // 🚀 SIMPLE: Construct lesson plan object directly from form data
//     const lessonPlan = {
//       id: lessonPlanId,
//       subject: {
//         id: formData.subjects.id,
//         code: formData.subjects.code,
//         name: formData.subjects.name,
//         semester: formData.subjects.semester,
//         lecture_hours: formData.subjects.lecture_hours,
//         lab_hours: formData.subjects.lab_hours,
//         abbreviation_name: formData.subjects.abbreviation_name,
//         credits: formData.subjects.credits,
//         is_theory: formData.subjects.is_theory,
//         is_practical: formData.subjects.is_practical,
//         metadata: formData.subjects.metadata || {},
//         pso: formData.subjects.pso || [],
//         peo: formData.subjects.peo || [],
//         lesson_plan_status: formData.subjects.lesson_plan_status || "draft",
//         department: {
//           id: formData.subjects.department_id,
//           name: formData.subjects.departments?.name || "Unknown Department",
//           abbreviation_depart: formData.subjects.departments?.abbreviation_depart || "DEPT",
//         },
//       },
//       faculty: {
//         id: formData.users.id,
//         name: formData.users.name,
//         email: formData.users.email,
//       },
//       academic_year: "2025",
//       division: generalDetails.division || "Division 1",
//       credits: generalDetails.credits || formData.subjects.credits || 0,
//       lab_hours: generalDetails.lab_hours || formData.subjects.lab_hours || 0,
//       lecture_hours: generalDetails.lecture_hours || formData.subjects.lecture_hours || 0,
//       term_start_date: generalDetails.term_start_date || "2024-12-10",
//       term_end_date: generalDetails.term_end_date || "2025-05-30",
//       course_prerequisites: generalDetails.course_prerequisites || "",
//       course_prerequisites_materials: generalDetails.course_prerequisites_materials || "",
//       courseOutcomes: generalDetails.courseOutcomes || [],
//       units: processedUnits,
//       practicals: processedPracticals,
//       cies: cies,
//       additional_info: additionalInfo,
//       unit_remarks: savedFormData.unit_remarks || "",
//       practical_remarks: savedFormData.practical_remarks || "",
//       cie_remarks: savedFormData.cie_remarks || "",
//       status: "Draft",
//       is_sharing: false,
//       sharing_faculty: [],
//       complete_general: formData.complete_general || false,
//       complete_unit: formData.complete_unit || false,
//       complete_practical: formData.complete_practical || false,
//       complete_cie: formData.complete_cie || false,
//       complete_additional: formData.complete_additional || false,
//     }

//     console.log("✅ Successfully constructed lesson plan for:", formData.subjects.name)

//     return {
//       success: true,
//       data: lessonPlan,
//     }
//   } catch (error) {
//     console.error("💥 Error fetching lesson plan:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to fetch lesson plan",
//     }
//   }
// }
