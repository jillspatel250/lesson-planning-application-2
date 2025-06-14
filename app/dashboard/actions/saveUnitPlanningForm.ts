
// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"
// import { saveUnitPlanningSchema } from "@/utils/schema"
// import { z } from "zod"

// export async function saveUnitPlanningForm(data: z.infer<typeof saveUnitPlanningSchema>) {
//   try {
//     const validatedData = saveUnitPlanningSchema.parse(data)
//     const supabase = await createClient()

//     // Get the authenticated user
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       console.error("Authentication error:", authError)
//       return { success: false, error: "User not authenticated" }
//     }

//     // Find the user record in the users table
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("id, name, email")
//       .eq("auth_id", user.id)
//       .single()

//     if (userError || !userData) {
//       console.error("Error finding user:", userError)
//       return { success: false, error: "User not found in database" }
//     }

//     const faculty_id = userData.id

//     // Get subject and course details for validation
//     const { data: subjectData, error: subjectError } = await supabase
//       .from("subjects")
//       .select("credits, lecture_hours")
//       .eq("id", validatedData.subject_id)
//       .single()

//     if (subjectError || !subjectData) {
//       console.error("Error fetching subject data:", subjectError)
//       return { success: false, error: "Subject not found" }
//     }

//     // Get existing form data to check for course outcomes
//     const { data: existingForm, error: formError } = await supabase
//       .from("forms")
//       .select("form")
//       .eq("faculty_id", faculty_id)
//       .eq("subject_id", validatedData.subject_id)
//       .single()

//     if (formError && formError.code !== "PGRST116") {
//       console.error("Error fetching existing form:", formError)
//       return { success: false, error: "Error fetching form data" }
//     }

//     const courseOutcomes = existingForm?.form?.generalDetails?.courseOutcomes || []

//     // Perform validations
//     const validationResult = validateUnitPlanning(validatedData.formData, subjectData, courseOutcomes)
//     if (!validationResult.isValid) {
//       return { success: false, error: validationResult.message }
//     }

//     // Check if a form already exists for this faculty and subject
//     if (existingForm) {
//       // Update existing form
//       const existingFormData = existingForm.form || {}

//       // Ensure faculty assignments are preserved
//       const updatedUnits = validatedData.formData.units.map((unit) => {
//         return {
//           ...unit,
//           // Make sure faculty assignment data is included
//           assigned_faculty_id: unit.assigned_faculty_id || userData.id,
//           faculty_name: unit.faculty_name || userData.name,
//         }
//       })

//       const updatedFormData = {
//         ...existingFormData,
//         units: updatedUnits,
//         unitPlanning: {
//           ...validatedData.formData,
//           units: updatedUnits,
//         },
//         unit_remarks: validatedData.formData.remarks,
//         unit_planning_completed: true,
//         last_updated: new Date().toISOString(),
//       }

//       const { error: updateError } = await supabase
//         .from("forms")
//         .update({ form: updatedFormData })
//         .eq("faculty_id", faculty_id)
//         .eq("subject_id", validatedData.subject_id)

//       if (updateError) {
//         console.error("Error updating form:", updateError)
//         return { success: false, error: updateError.message }
//       }
//     } else {
//       // Create new form with just unit planning
//       const updatedUnits = validatedData.formData.units.map((unit) => {
//         return {
//           ...unit,
//           // Make sure faculty assignment data is included
//           assigned_faculty_id: unit.assigned_faculty_id || userData.id,
//           faculty_name: unit.faculty_name || userData.name,
//         }
//       })

//       const formData = {
//         units: updatedUnits,
//         unitPlanning: {
//           ...validatedData.formData,
//           units: updatedUnits,
//         },
//         unit_remarks: validatedData.formData.remarks,
//         unit_planning_completed: true,
//         last_updated: new Date().toISOString(),
//       }

//       const { error: insertError } = await supabase.from("forms").insert({
//         faculty_id: faculty_id,
//         subject_id: validatedData.subject_id,
//         form: formData,
//       })

//       if (insertError) {
//         console.error("Error creating form:", insertError)
//         return { success: false, error: insertError.message }
//       }
//     }

//     revalidatePath("/dashboard/lesson-plans")
//     return { success: true }
//   } catch (error) {
//     console.error("Unexpected error saving unit planning form:", error)
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         error: "Validation failed",
//         fieldErrors: error.flatten().fieldErrors,
//       }
//     }
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//     }
//   }
// }

// function validateUnitPlanning(
//   unitData: any,
//   subjectData: { credits: number; lecture_hours: number },
//   courseOutcomes: any[],
// ): { isValid: boolean; message?: string } {
//   const units = unitData.units
//   const errors: string[] = []

//   // Validation 1: At least two alternative pedagogies must be entered in different units
//   const alternativePedagogies = [
//     "Active Learning",
//     "Blended Learning",
//     "Concept/Mind Mapping",
//     "Demonstration/Simulation-Based Learning",
//     "Experiential Learning",
//     "Flipped Classroom",
//     "Collaborative Learning",
//     "Peer Learning",
//     "Problem-Based Learning",
//     "Project-Based Learning",
//     "Reflective Learning",
//     "Role Play",
//     "Storytelling/Narrative Pedagogy",
//   ]

//   const unitsWithAlternatePedagogy = units.filter((unit: any) =>
//     unit.teaching_pedagogy.some(
//       (pedagogy: string) => alternativePedagogies.includes(pedagogy) || pedagogy.startsWith("Other:"),
//     ),
//   )

//   if (unitsWithAlternatePedagogy.length < 2) {
//     errors.push("Please ensure that at least two alternative pedagogies are selected across different units.")
//   }

//   // Validation 2: All entered COs must be covered by all units
//   if (courseOutcomes.length > 0) {
//     const allMappedCOs = new Set()
//     units.forEach((unit: any) => {
//       unit.co_mapping.forEach((co: string) => allMappedCOs.add(co))
//     })

//     const allCOIds = courseOutcomes.map((co: any) => `CO${courseOutcomes.indexOf(co) + 1}`)
//     const unmappedCOs = allCOIds.filter((co) => !allMappedCOs.has(co))

//     if (unmappedCOs.length > 0) {
//       errors.push("All entered COs must cover across all Units.")
//     }
//   }

//   // Validation 3: Total lectures must equal credits × 15
//   const totalLectures = units.reduce((sum: number, unit: any) => sum + unit.no_of_lectures, 0)
//   const expectedLectures = subjectData.credits * 15

//   if (totalLectures !== expectedLectures) {
//     errors.push("Total sum of no. of lectures across all Units must be credit x 15.")
//   }

//   // Validation 4: At least one skill must be filled including details
//   const hasSkillMapping = units.some(
//     (unit: any) => unit.skill_mapping.length > 0 && unit.skill_objectives.trim().length > 0,
//   )

//   if (!hasSkillMapping) {
//     errors.push("At least one skill must be mapped with detailed objectives.")
//   }

//   if (errors.length > 0) {
//     return {
//       isValid: false,
//       message: `Dear Professor,\n\nKindly review the following requirements before saving the form:\n\n${errors.map((error) => `• ${error}`).join("\n")}\n\nWe appreciate your attention to detail in maintaining the academic integrity of your course design.`,
//     }
//   }

//   return { isValid: true }
// }



// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"
// import { saveUnitPlanningSchema } from "@/utils/schema"
// import { z } from "zod"

// export async function saveUnitPlanningForm(data: z.infer<typeof saveUnitPlanningSchema>) {
//   try {
//     const validatedData = saveUnitPlanningSchema.parse(data)
//     const supabase = await createClient()

//     // Get the authenticated user
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       console.error("Authentication error:", authError)
//       return { success: false, error: "User not authenticated" }
//     }

//     // Find the user record in the users table
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("id, name, email")
//       .eq("auth_id", user.id)
//       .single()

//     if (userError || !userData) {
//       console.error("Error finding user:", userError)
//       return { success: false, error: "User not found in database" }
//     }

//     const faculty_id = userData.id

//     // Get subject and course details for validation
//     const { data: subjectData, error: subjectError } = await supabase
//       .from("subjects")
//       .select("credits, lecture_hours")
//       .eq("id", validatedData.subject_id)
//       .single()

//     if (subjectError || !subjectData) {
//       console.error("Error fetching subject data:", subjectError)
//       return { success: false, error: "Subject not found" }
//     }

//     // Get existing form data to check for course outcomes
//     const { data: existingForm, error: formError } = await supabase
//       .from("forms")
//       .select("form")
//       .eq("faculty_id", faculty_id)
//       .eq("subject_id", validatedData.subject_id)
//       .single()

//     if (formError && formError.code !== "PGRST116") {
//       console.error("Error fetching existing form:", formError)
//       return { success: false, error: "Error fetching form data" }
//     }

//     const courseOutcomes = existingForm?.form?.generalDetails?.courseOutcomes || []

//     // Perform validations
//     const validationResult = validateUnitPlanning(validatedData.formData, subjectData, courseOutcomes)
//     if (!validationResult.isValid) {
//       return { success: false, error: validationResult.message }
//     }

//     // Check if a form already exists for this faculty and subject
//     if (existingForm) {
//       // Update existing form
//       const existingFormData = existingForm.form || {}

//       // Ensure faculty assignments are preserved
//       const updatedUnits = validatedData.formData.units.map((unit) => {
//         return {
//           ...unit,
//           // Make sure faculty assignment data is included
//           assigned_faculty_id: unit.assigned_faculty_id || userData.id,
//           faculty_name: unit.faculty_name || userData.name,
//         }
//       })

//       const updatedFormData = {
//         ...existingFormData,
//         units: updatedUnits,
//         unitPlanning: {
//           ...validatedData.formData,
//           units: updatedUnits,
//         },
//         unit_remarks: validatedData.formData.remarks,
//         unit_planning_completed: true,
//         last_updated: new Date().toISOString(),
//       }

//       const { error: updateError } = await supabase
//         .from("forms")
//         .update({ form: updatedFormData })
//         .eq("faculty_id", faculty_id)
//         .eq("subject_id", validatedData.subject_id)

//       if (updateError) {
//         console.error("Error updating form:", updateError)
//         return { success: false, error: updateError.message }
//       }
//     } else {
//       // Create new form with just unit planning
//       const updatedUnits = validatedData.formData.units.map((unit) => {
//         return {
//           ...unit,
//           // Make sure faculty assignment data is included
//           assigned_faculty_id: unit.assigned_faculty_id || userData.id,
//           faculty_name: unit.faculty_name || userData.name,
//         }
//       })

//       const formData = {
//         units: updatedUnits,
//         unitPlanning: {
//           ...validatedData.formData,
//           units: updatedUnits,
//         },
//         unit_remarks: validatedData.formData.remarks,
//         unit_planning_completed: true,
//         last_updated: new Date().toISOString(),
//       }

//       const { error: insertError } = await supabase.from("forms").insert({
//         faculty_id: faculty_id,
//         subject_id: validatedData.subject_id,
//         form: formData,
//       })

//       if (insertError) {
//         console.error("Error creating form:", insertError)
//         return { success: false, error: insertError.message }
//       }
//     }

//     revalidatePath("/dashboard/lesson-plans")
//     return { success: true }
//   } catch (error) {
//     console.error("Unexpected error saving unit planning form:", error)
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         error: "Validation failed",
//         fieldErrors: error.flatten().fieldErrors,
//       }
//     }
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//     }
//   }
// }

// function validateUnitPlanning(
//   unitData: any,
//   subjectData: { credits: number; lecture_hours: number },
//   courseOutcomes: any[],
// ): { isValid: boolean; message?: string } {
//   const units = unitData.units
//   const errors: string[] = []

//   // Validation 1: At least two alternative pedagogies must be entered in different units
//   const alternativePedagogies = [
//     "Active Learning",
//     "Blended Learning",
//     "Concept/Mind Mapping",
//     "Demonstration/Simulation-Based Learning",
//     "Experiential Learning",
//     "Flipped Classroom",
//     "Collaborative Learning",
//     "Peer Learning",
//     "Problem-Based Learning",
//     "Project-Based Learning",
//     "Reflective Learning",
//     "Role Play",
//     "Storytelling/Narrative Pedagogy",
//   ]

//   const unitsWithAlternatePedagogy = units.filter((unit: any) =>
//     unit.teaching_pedagogy.some(
//       (pedagogy: string) => alternativePedagogies.includes(pedagogy) || pedagogy.startsWith("Other:"),
//     ),
//   )

//   if (unitsWithAlternatePedagogy.length < 2) {
//     errors.push("Please ensure that at least two alternative pedagogies are selected across different units.")
//   }

//   // Validation 2: All entered COs must be covered by all units
//   if (courseOutcomes.length > 0) {
//     const allMappedCOs = new Set()
//     units.forEach((unit: any) => {
//       unit.co_mapping.forEach((co: string) => allMappedCOs.add(co))
//     })

//     const allCOIds = courseOutcomes.map((co: any) => co.id)
//     const unmappedCOs = allCOIds.filter((co) => !allMappedCOs.has(co))

//     if (unmappedCOs.length > 0) {
//       errors.push("All entered COs must cover across all Units.")
//     }
//   }

//   // Validation 3: Total lectures must equal credits × 15
//   const totalLectures = units.reduce((sum: number, unit: any) => sum + unit.no_of_lectures, 0)
//   const expectedLectures = subjectData.credits * 15

//   if (totalLectures !== expectedLectures) {
//     errors.push("Total sum of no. of lectures across all Units must be credit x 15.")
//   }

//   // Validation 4: At least one skill must be filled including details
//   const hasSkillMapping = units.some(
//     (unit: any) => unit.skill_mapping.length > 0 && unit.skill_objectives.trim().length > 0,
//   )

//   if (!hasSkillMapping) {
//     errors.push("At least one skill must be mapped with detailed objectives.")
//   }

//   if (errors.length > 0) {
//     return {
//       isValid: false,
//       message: `Dear Professor,\n\nKindly review the following requirements before saving the form:\n\n${errors.map((error) => `• ${error}`).join("\n")}\n\nWe appreciate your attention to detail in maintaining the academic integrity of your course design.`,
//     }
//   }

//   return { isValid: true }
// }


"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { saveUnitPlanningSchema } from "@/utils/schema"
import { z } from "zod"

export async function saveUnitPlanningForm(data: z.infer<typeof saveUnitPlanningSchema>) {
  try {
    const validatedData = saveUnitPlanningSchema.parse(data)
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return { success: false, error: "User not authenticated" }
    }

    // Find the user record in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      console.error("Error finding user:", userError)
      return { success: false, error: "User not found in database" }
    }

    const faculty_id = userData.id

    // Get subject and course details for validation
    const { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .select("credits, lecture_hours")
      .eq("id", validatedData.subject_id)
      .single()

    if (subjectError || !subjectData) {
      console.error("Error fetching subject data:", subjectError)
      return { success: false, error: "Subject not found" }
    }

    // Get existing form data to check for course outcomes
    const { data: existingForm, error: formError } = await supabase
      .from("forms")
      .select("form")
      .eq("faculty_id", faculty_id)
      .eq("subject_id", validatedData.subject_id)
      .single()

    if (formError && formError.code !== "PGRST116") {
      console.error("Error fetching existing form:", formError)
      return { success: false, error: "Error fetching form data" }
    }

    const courseOutcomes = existingForm?.form?.generalDetails?.courseOutcomes || []

    // Perform validations
    const validationResult = validateUnitPlanning(validatedData.formData, subjectData, courseOutcomes)
    if (!validationResult.isValid) {
      return { success: false, error: validationResult.message }
    }

    // Check if a form already exists for this faculty and subject
    if (existingForm) {
      // Update existing form
      const existingFormData = existingForm.form || {}

      // Ensure faculty assignments are preserved
      const updatedUnits = validatedData.formData.units.map((unit) => {
        return {
          ...unit,
          // Make sure faculty assignment data is included
          assigned_faculty_id: unit.assigned_faculty_id || userData.id,
          faculty_name: unit.faculty_name || userData.name,
        }
      })

      const updatedFormData = {
        ...existingFormData,
        units: updatedUnits,
        unitPlanning: {
          ...validatedData.formData,
          units: updatedUnits,
        },
        unit_remarks: validatedData.formData.remarks,
        unit_planning_completed: true,
        last_updated: new Date().toISOString(),
      }

      const { error: updateError } = await supabase
        .from("forms")
        .update({ form: updatedFormData })
        .eq("faculty_id", faculty_id)
        .eq("subject_id", validatedData.subject_id)

      if (updateError) {
        console.error("Error updating form:", updateError)
        return { success: false, error: updateError.message }
      }
    } else {
      // Create new form with just unit planning
      const updatedUnits = validatedData.formData.units.map((unit) => {
        return {
          ...unit,
          // Make sure faculty assignment data is included
          assigned_faculty_id: unit.assigned_faculty_id || userData.id,
          faculty_name: unit.faculty_name || userData.name,
        }
      })

      const formData = {
        units: updatedUnits,
        unitPlanning: {
          ...validatedData.formData,
          units: updatedUnits,
        },
        unit_remarks: validatedData.formData.remarks,
        unit_planning_completed: true,
        last_updated: new Date().toISOString(),
      }

      const { error: insertError } = await supabase.from("forms").insert({
        faculty_id: faculty_id,
        subject_id: validatedData.subject_id,
        form: formData,
      })

      if (insertError) {
        console.error("Error creating form:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    revalidatePath("/dashboard/lesson-plans")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error saving unit planning form:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

function validateUnitPlanning(
  unitData: any,
  subjectData: { credits: number; lecture_hours: number },
  courseOutcomes: any[],
): { isValid: boolean; message?: string } {
  const units = unitData.units
  const errors: string[] = []

  // Validation 1: Each unit must have at least one teaching pedagogy (any pedagogy)
  units.forEach((unit: any, index: number) => {
    if (!unit.teaching_pedagogy || unit.teaching_pedagogy.length === 0) {
      errors.push(`Unit ${index + 1}: At least one teaching pedagogy must be selected.`)
    }
  })

  // Validation 2: At least two unique alternative pedagogies must be used across ALL units (only if multiple units)
  if (units.length > 1) {
    const alternativePedagogies = [
      "Active Learning",
      "Blended Learning",
      "Concept/Mind Mapping",
      "Demonstration/Simulation-Based Learning",
      "Experiential Learning",
      "Flipped Classroom",
      "Collaborative Learning",
      "Peer Learning",
      "Problem-Based Learning",
      "Project-Based Learning",
      "Reflective Learning",
      "Role Play",
      "Storytelling/Narrative Pedagogy",
    ]

    const uniqueAlternativePedagogies = new Set<string>()

    // Collect unique alternative pedagogies from ALL units
    units.forEach((unit: any) => {
      unit.teaching_pedagogy?.forEach((pedagogy: string) => {
        // Include both predefined alternative pedagogies and "Other" options
        if (alternativePedagogies.includes(pedagogy) || pedagogy.startsWith("Other:")) {
          uniqueAlternativePedagogies.add(pedagogy)
        }
      })
    })

    // Check if at least 2 unique alternative pedagogies are used across ALL units
    if (uniqueAlternativePedagogies.size < 2) {
      errors.push(
        "Minimum 2 different alternative pedagogies must be selected across all units (including 'Other' options).",
      )
    }
  }

  // Validation 3: All entered COs must be covered by all units
  if (courseOutcomes.length > 0) {
    const allMappedCOs = new Set()
    units.forEach((unit: any) => {
      unit.co_mapping.forEach((co: string) => allMappedCOs.add(co))
    })

    const allCOIds = courseOutcomes.map((co: any) => co.id)
    const unmappedCOs = allCOIds.filter((co) => !allMappedCOs.has(co))

    if (unmappedCOs.length > 0) {
      errors.push("All entered COs must be covered across all units.")
    }
  }

  // Validation 4: Total lectures must equal credits × 15
  const totalLectures = units.reduce((sum: number, unit: any) => sum + unit.no_of_lectures, 0)
  const expectedLectures = subjectData.credits * 15

  if (totalLectures !== expectedLectures) {
    errors.push(`Total lectures (${totalLectures}) must equal credits × 15 (${expectedLectures}).`)
  }

  // Validation 5: At least one skill must be filled including details
  const hasSkillMapping = units.some(
    (unit: any) => unit.skill_mapping.length > 0 && unit.skill_objectives.trim().length > 0,
  )

  if (!hasSkillMapping) {
    errors.push("At least one skill must be mapped with detailed objectives.")
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      message: `Dear Professor,\n\nKindly review the following requirements before saving the form:\n\n${errors.map((error, index) => `${index + 1}. ${error}`).join("\n")}\n\nNote: \n- Each unit requires at least one pedagogy (traditional or alternative)\n- If you have multiple units, at least 2 different alternative pedagogies must be used across all units\n- Alternative pedagogies include items 3-15 from the dropdown menu and any custom 'Other' options you specify.\n\nWe appreciate your attention to detail in maintaining the academic integrity of your course design.`,
    }
  }

  return { isValid: true }
}
