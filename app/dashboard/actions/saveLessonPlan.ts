// // @ts-nocheck
// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"

// export async function saveLessonPlan(lessonPlanData: any, section: string) {
//   const supabase = await createClient()

//   try {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       throw new Error("Authentication required")
//     }

//     // First, check if lesson plan exists
//     const { data: existingPlan, error: fetchError } = await supabase
//       .from("lesson_plans")
//       .select("*")
//       .eq("faculty_subject_id", lessonPlanData.id)
//       .eq("faculty_id", user.id)
//       .single()

//     let lessonPlanId: string

//     if (existingPlan) {
//       lessonPlanId = existingPlan.id
//       // Update existing lesson plan - ALWAYS set to "in_progress" when saving
//       const { error: updateError } = await supabase
//         .from("lesson_plans")
//         .update({
//           academic_year: lessonPlanData.academic_year,
//           division: lessonPlanData.division,
//           term_start_date: lessonPlanData.term_start_date,
//           term_end_date: lessonPlanData.term_end_date,
//           course_prerequisites: lessonPlanData.course_prerequisites,
//           course_prerequisites_materials: lessonPlanData.course_prerequisites_materials,
//           status: "in_progress", // Always set to in_progress when saving
//           [`${section}_completed`]: true,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", lessonPlanId)

//       if (updateError) throw updateError
//     } else {
//       // Create new lesson plan - set to "in_progress" immediately
//       const { data: newPlan, error: createError } = await supabase
//         .from("lesson_plans")
//         .insert({
//           faculty_subject_id: lessonPlanData.id,
//           faculty_id: user.id,
//           subject_id: lessonPlanData.subject.id,
//           academic_year: lessonPlanData.academic_year,
//           division: lessonPlanData.division,
//           term_start_date: lessonPlanData.term_start_date,
//           term_end_date: lessonPlanData.term_end_date,
//           course_prerequisites: lessonPlanData.course_prerequisites,
//           course_prerequisites_materials: lessonPlanData.course_prerequisites_materials,
//           status: "in_progress", // Start with in_progress, not draft
//           [`${section}_completed`]: true,
//         })
//         .select()
//         .single()

//       if (createError) throw createError
//       lessonPlanId = newPlan.id
//     }

//     // Save section-specific data
//     switch (section) {
//       case "general_details":
//         await saveGeneralDetails(supabase, lessonPlanId, lessonPlanData)
//         break
//       case "unit_planning":
//         await saveUnitPlanning(supabase, lessonPlanId, lessonPlanData.units)
//         break
//       case "practical_planning":
//         await savePracticalPlanning(supabase, lessonPlanId, lessonPlanData.practicals)
//         break
//       case "cie_planning":
//         await saveCIEPlanning(supabase, lessonPlanId, lessonPlanData.cies)
//         break
//       case "additional_info":
//         await saveAdditionalInfo(supabase, lessonPlanId, lessonPlanData.additional_info)
//         break
//     }

//     // Check if all required sections are completed and update status to "submitted"
//     await updateLessonPlanStatus(supabase, lessonPlanId, lessonPlanData.subject)

//     revalidatePath("/dashboard/lesson-plans")
//     return { success: true, lessonPlanId }
//   } catch (error) {
//     console.error("Error saving lesson plan:", error)
//     return { success: false, error: error.message }
//   }
// }

// async function saveGeneralDetails(supabase: any, lessonPlanId: string, data: any) {
//   // Save course outcomes
//   if (data.courseOutcomes && data.courseOutcomes.length > 0) {
//     // Delete existing course outcomes
//     await supabase.from("course_outcomes").delete().eq("lesson_plan_id", lessonPlanId)

//     // Insert new course outcomes
//     const courseOutcomes = data.courseOutcomes.map((outcome: any, index: number) => ({
//       lesson_plan_id: lessonPlanId,
//       outcome_number: index + 1,
//       description: outcome.description,
//     }))

//     await supabase.from("course_outcomes").insert(courseOutcomes)
//   }
// }

// async function saveUnitPlanning(supabase: any, lessonPlanId: string, units: any[]) {
//   if (units && units.length > 0) {
//     // Delete existing units
//     await supabase.from("lesson_plan_units").delete().eq("lesson_plan_id", lessonPlanId)

//     // Insert new units
//     const unitsData = units.map((unit: any, index: number) => ({
//       lesson_plan_id: lessonPlanId,
//       unit_number: index + 1,
//       unit_name: unit.unit_name,
//       no_of_lectures: unit.no_of_lectures,
//       unit_topics: unit.unit_topics,
//       self_study_topics: unit.self_study_topics,
//       self_study_materials: unit.self_study_materials,
//       unit_materials: unit.unit_materials,
//     }))

//     await supabase.from("lesson_plan_units").insert(unitsData)
//   }
// }

// async function savePracticalPlanning(supabase: any, lessonPlanId: string, practicals: any[]) {
//   if (practicals && practicals.length > 0) {
//     // Delete existing practicals
//     await supabase.from("lesson_plan_practicals").delete().eq("lesson_plan_id", lessonPlanId)

//     // Insert new practicals
//     const practicalsData = practicals.map((practical: any, index: number) => ({
//       lesson_plan_id: lessonPlanId,
//       practical_number: index + 1,
//       practical_aim: practical.practical_aim,
//       lab_hours: practical.lab_hours,
//       probable_week: practical.probable_week,
//       associated_units: practical.associated_units,
//       software_hardware_requirements: practical.software_hardware_requirements,
//       practical_tasks: practical.practical_tasks,
//       evaluation_methods: practical.evaluation_methods,
//       practical_pedagogy: practical.practical_pedagogy,
//       blooms_taxonomy: practical.blooms_taxonomy,
//       reference_material: practical.reference_material,
//     }))

//     await supabase.from("lesson_plan_practicals").insert(practicalsData)
//   }
// }

// async function saveCIEPlanning(supabase: any, lessonPlanId: string, cies: any[]) {
//   if (cies && cies.length > 0) {
//     // Delete existing CIEs
//     await supabase.from("lesson_plan_cies").delete().eq("lesson_plan_id", lessonPlanId)

//     // Insert new CIEs
//     const ciesData = cies.map((cie: any, index: number) => ({
//       lesson_plan_id: lessonPlanId,
//       cie_number: index + 1,
//       type: cie.type,
//       units_covered: cie.units_covered,
//       practicals_covered: cie.practicals_covered,
//       date: cie.date,
//       marks: cie.marks,
//       duration: cie.duration,
//       blooms_taxonomy: cie.blooms_taxonomy,
//       evaluation_pedagogy: cie.evaluation_pedagogy,
//       other_pedagogy: cie.other_pedagogy,
//       co_mapping: cie.co_mapping,
//       pso_mapping: cie.pso_mapping,
//       peo_mapping: cie.peo_mapping,
//       skill_mapping: cie.skill_mapping,
//     }))

//     await supabase.from("lesson_plan_cies").insert(ciesData)
//   }
// }

// async function saveAdditionalInfo(supabase: any, lessonPlanId: string, additionalInfo: any) {
//   if (additionalInfo) {
//     // Delete existing additional info
//     await supabase.from("lesson_plan_additional_info").delete().eq("lesson_plan_id", lessonPlanId)

//     // Insert new additional info
//     await supabase.from("lesson_plan_additional_info").insert({
//       lesson_plan_id: lessonPlanId,
//       classroom_conduct: additionalInfo.classroom_conduct,
//       attendance_policy: additionalInfo.attendance_policy,
//       lesson_planning_guidelines: additionalInfo.lesson_planning_guidelines,
//       cie_guidelines: additionalInfo.cie_guidelines,
//       self_study_guidelines: additionalInfo.self_study_guidelines,
//     })
//   }
// }

// async function updateLessonPlanStatus(supabase: any, lessonPlanId: string, subject: any) {
//   // Get current completion status
//   const { data: lessonPlan } = await supabase.from("lesson_plans").select("*").eq("id", lessonPlanId).single()

//   if (!lessonPlan) return

//   // Check if all required sections are completed
//   let allCompleted = true

//   // General details is always required
//   if (!lessonPlan.general_details_completed) allCompleted = false

//   // Unit planning required for theory subjects
//   if (subject.is_theory && !lessonPlan.unit_planning_completed) allCompleted = false

//   // Practical planning required for practical subjects
//   if (subject.is_practical && !lessonPlan.practical_planning_completed) allCompleted = false

//   // CIE planning is always required
//   if (!lessonPlan.cie_planning_completed) allCompleted = false

//   // Additional info is always required
//   if (!lessonPlan.additional_info_completed) allCompleted = false

//   // Only update to "submitted" if ALL required sections are completed
//   // Otherwise keep as "in_progress"
//   const newStatus = allCompleted ? "submitted" : "in_progress"

//   await supabase
//     .from("lesson_plans")
//     .update({ status: newStatus, updated_at: new Date().toISOString() })
//     .eq("id", lessonPlanId)
// }

// @ts-nocheck
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveLessonPlan(lessonPlanData: any, section: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // First, check if lesson plan exists
    const { data: existingPlan, error: fetchError } = await supabase
      .from("lesson_plans")
      .select("*")
      .eq("faculty_subject_id", lessonPlanData.id)
      .eq("faculty_id", user.id)
      .single()

    let lessonPlanId: string

    if (existingPlan) {
      lessonPlanId = existingPlan.id
      // Update existing lesson plan - ALWAYS set to "in_progress" when saving
      const { error: updateError } = await supabase
        .from("lesson_plans")
        .update({
          academic_year: lessonPlanData.academic_year,
          division: lessonPlanData.division,
          term_start_date: lessonPlanData.term_start_date,
          term_end_date: lessonPlanData.term_end_date,
          course_prerequisites: lessonPlanData.course_prerequisites,
          course_prerequisites_materials: lessonPlanData.course_prerequisites_materials,
          status: "in_progress", // Always set to in_progress when saving
          [`${section}_completed`]: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lessonPlanId)

      if (updateError) throw updateError
    } else {
      // Create new lesson plan - set to "in_progress" immediately
      const { data: newPlan, error: createError } = await supabase
        .from("lesson_plans")
        .insert({
          faculty_subject_id: lessonPlanData.id,
          faculty_id: user.id,
          subject_id: lessonPlanData.subject.id,
          academic_year: lessonPlanData.academic_year,
          division: lessonPlanData.division,
          term_start_date: lessonPlanData.term_start_date,
          term_end_date: lessonPlanData.term_end_date,
          course_prerequisites: lessonPlanData.course_prerequisites,
          course_prerequisites_materials: lessonPlanData.course_prerequisites_materials,
          status: "in_progress", // Start with in_progress, not draft
          [`${section}_completed`]: true,
        })
        .select()
        .single()

      if (createError) throw createError
      lessonPlanId = newPlan.id
    }

    // Save section-specific data
    switch (section) {
      case "general_details":
        await saveGeneralDetails(supabase, lessonPlanId, lessonPlanData)
        break
      case "unit_planning":
        await saveUnitPlanning(supabase, lessonPlanId, lessonPlanData.units)
        break
      case "practical_planning":
        await savePracticalPlanning(supabase, lessonPlanId, lessonPlanData.practicals)
        break
      case "cie_planning":
        await saveCIEPlanning(supabase, lessonPlanId, lessonPlanData.cies)
        break
      case "additional_info":
        await saveAdditionalInfo(supabase, lessonPlanId, lessonPlanData.additional_info)
        break
    }

    // Check if all required sections are completed and update status to "submitted"
    await updateLessonPlanStatus(supabase, lessonPlanId, lessonPlanData.subject)

    revalidatePath("/dashboard/lesson-plans")
    return { success: true, lessonPlanId }
  } catch (error) {
    console.error("Error saving lesson plan:", error)
    return { success: false, error: error.message }
  }
}

async function saveGeneralDetails(supabase: any, lessonPlanId: string, data: any) {
  // Save course outcomes
  if (data.courseOutcomes && data.courseOutcomes.length > 0) {
    // Delete existing course outcomes
    await supabase.from("course_outcomes").delete().eq("lesson_plan_id", lessonPlanId)

    // Insert new course outcomes
    const courseOutcomes = data.courseOutcomes.map((outcome: any, index: number) => ({
      lesson_plan_id: lessonPlanId,
      outcome_number: index + 1,
      description: outcome.description,
    }))

    await supabase.from("course_outcomes").insert(courseOutcomes)
  }
}

// Update the saveUnitPlanning function to store faculty assignments
async function saveUnitPlanning(supabase: any, lessonPlanId: string, units: any[]) {
  if (units && units.length > 0) {
    // Delete existing units
    await supabase.from("lesson_plan_units").delete().eq("lesson_plan_id", lessonPlanId)

    // Insert new units with faculty assignments
    const unitsData = units.map((unit: any, index: number) => ({
      lesson_plan_id: lessonPlanId,
      unit_number: index + 1,
      unit_name: unit.unit_name,
      no_of_lectures: unit.no_of_lectures,
      unit_topics: unit.unit_topics,
      self_study_topics: unit.self_study_topics,
      self_study_materials: unit.self_study_materials,
      unit_materials: unit.unit_materials,
      assigned_faculty_id: unit.assigned_faculty_id || null,
      faculty_name: unit.faculty_name || null,
      faculty_assignments: JSON.stringify({
        assigned_faculty_id: unit.assigned_faculty_id,
        faculty_name: unit.faculty_name,
      }),
    }))

    await supabase.from("lesson_plan_units").insert(unitsData)
  }
}

// Update the savePracticalPlanning function to store faculty assignments
async function savePracticalPlanning(supabase: any, lessonPlanId: string, practicals: any[]) {
  if (practicals && practicals.length > 0) {
    // Delete existing practicals
    await supabase.from("lesson_plan_practicals").delete().eq("lesson_plan_id", lessonPlanId)

    // Insert new practicals with faculty assignments
    const practicalsData = practicals.map((practical: any, index: number) => ({
      lesson_plan_id: lessonPlanId,
      practical_number: index + 1,
      practical_aim: practical.practical_aim,
      lab_hours: practical.lab_hours,
      probable_week: practical.probable_week,
      associated_units: practical.associated_units,
      software_hardware_requirements: practical.software_hardware_requirements,
      practical_tasks: practical.practical_tasks,
      evaluation_methods: practical.evaluation_methods,
      practical_pedagogy: practical.practical_pedagogy,
      blooms_taxonomy: practical.blooms_taxonomy,
      reference_material: practical.reference_material,
      assigned_faculty_id: practical.assigned_faculty_id || null,
      faculty_name: practical.faculty_name || null,
      faculty_assignments: JSON.stringify({
        assigned_faculty_id: practical.assigned_faculty_id,
        faculty_name: practical.faculty_name,
      }),
    }))

    await supabase.from("lesson_plan_practicals").insert(practicalsData)
  }
}

async function saveCIEPlanning(supabase: any, lessonPlanId: string, cies: any[]) {
  if (cies && cies.length > 0) {
    // Delete existing CIEs
    await supabase.from("lesson_plan_cies").delete().eq("lesson_plan_id", lessonPlanId)

    // Insert new CIEs
    const ciesData = cies.map((cie: any, index: number) => ({
      lesson_plan_id: lessonPlanId,
      cie_number: index + 1,
      type: cie.type,
      units_covered: cie.units_covered,
      practicals_covered: cie.practicals_covered,
      date: cie.date,
      marks: cie.marks,
      duration: cie.duration,
      blooms_taxonomy: cie.blooms_taxonomy,
      evaluation_pedagogy: cie.evaluation_pedagogy,
      other_pedagogy: cie.other_pedagogy,
      co_mapping: cie.co_mapping,
      pso_mapping: cie.pso_mapping,
      peo_mapping: cie.peo_mapping,
      skill_mapping: cie.skill_mapping,
    }))

    await supabase.from("lesson_plan_cies").insert(ciesData)
  }
}

async function saveAdditionalInfo(supabase: any, lessonPlanId: string, additionalInfo: any) {
  if (additionalInfo) {
    // Delete existing additional info
    await supabase.from("lesson_plan_additional_info").delete().eq("lesson_plan_id", lessonPlanId)

    // Insert new additional info
    await supabase.from("lesson_plan_additional_info").insert({
      lesson_plan_id: lessonPlanId,
      classroom_conduct: additionalInfo.classroom_conduct,
      attendance_policy: additionalInfo.attendance_policy,
      lesson_planning_guidelines: additionalInfo.lesson_planning_guidelines,
      cie_guidelines: additionalInfo.cie_guidelines,
      self_study_guidelines: additionalInfo.self_study_guidelines,
    })
  }
}

// Update the updateLessonPlanStatus function to include faculty assignments:
async function updateLessonPlanStatus(supabase: any, lessonPlanId: string, subject: any) {
  // Get current completion status
  const { data: lessonPlan } = await supabase.from("lesson_plans").select("*").eq("id", lessonPlanId).single()

  if (!lessonPlan) return

  // Check if all required sections are completed
  let allCompleted = true

  // General details is always required
  if (!lessonPlan.general_details_completed) allCompleted = false

  // Unit planning required for theory subjects
  if (subject.is_theory && !lessonPlan.unit_planning_completed) allCompleted = false

  // Practical planning required for practical subjects
  if (subject.is_practical && !lessonPlan.practical_planning_completed) allCompleted = false

  // CIE planning is always required
  if (!lessonPlan.cie_planning_completed) allCompleted = false

  // Additional info is always required
  if (!lessonPlan.additional_info_completed) allCompleted = false

  // Only update to "submitted" if ALL required sections are completed
  // Otherwise keep as "in_progress"
  const newStatus = allCompleted ? "submitted" : "in_progress"

  await supabase
    .from("lesson_plans")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonPlanId)
}
