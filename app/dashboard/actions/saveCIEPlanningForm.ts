"use server"

import { createClient } from "@/utils/supabase/server"
import {
  parseDDMMYYYYToDate,
  getDaysDifference,
  convertToStandardDateFormat,
  formatDateToDDMMYYYY,
  isDateWithinDays,
} from "@/utils/dateUtils"

// Define CIEData type
interface CIEData {
  date: string
  type: string
  blooms_taxonomy?: string[]
  evaluation_pedagogy: string
  duration?: number
  co_mapping?: string[]
  units_covered?: string[]
  practicals_covered?: string[]
  marks?: number
  other_pedagogy?: string
}

// Define CIEPlanningFormData type
interface CIEPlanningFormData {
  faculty_id: string
  subject_id: string
  cies: CIEData[]
  remarks?: string
}

// FIXED: Function to determine subject type based on subject flags and content
const determineSubjectType = (form: any, subjectData: any): "theory" | "practical" | "theory_practical" => {
  console.log("🔍 BACKEND Subject Type Detection:", {
    subjectFlags: {
      is_theory: subjectData?.is_theory,
      is_practical: subjectData?.is_practical,
    },
    contentData: {
      hasUnits: form.units && Array.isArray(form.units) && form.units.length > 0,
      hasPracticals: form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0,
    },
  })

  // Use subject flags first if available
  if (subjectData?.is_theory === true && subjectData?.is_practical === true) {
    console.log("🔍 BACKEND: Subject type determined as theory_practical (from flags)")
    return "theory_practical"
  } else if (subjectData?.is_practical === true && subjectData?.is_theory === false) {
    console.log("🔍 BACKEND: Subject type determined as practical (from flags)")
    return "practical"
  } else if (subjectData?.is_theory === true && subjectData?.is_practical === false) {
    console.log("🔍 BACKEND: Subject type determined as theory (from flags)")
    return "theory"
  }

  // Fall back to content-based detection
  const hasUnits = form.units && Array.isArray(form.units) && form.units.length > 0
  const hasPracticals = form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0

  if (hasUnits && hasPracticals) {
    console.log("🔍 BACKEND: Subject type determined as theory_practical (from content)")
    return "theory_practical"
  } else if (hasPracticals && !hasUnits) {
    console.log("🔍 BACKEND: Subject type determined as practical (from content)")
    return "practical"
  } else {
    console.log("🔍 BACKEND: Subject type determined as theory (from content)")
    return "theory"
  }
}

// NEW: Function to check for CIE date conflicts
const checkCIEDateConflicts = async (
  supabase: any,
  cies: CIEData[],
  subjectId: string,
  facultyId: string,
): Promise<string[]> => {
  const errors: string[] = []

  try {
    // Get current subject's semester and department
    const { data: currentSubject, error: subjectError } = await supabase
      .from("subjects")
      .select("semester, department_id")
      .eq("id", subjectId)
      .single()

    if (subjectError || !currentSubject) {
      console.error("Error fetching current subject for conflict check:", subjectError)
      return errors
    }

    // Get all subjects in the same semester and department
    const { data: sameSubjects, error: sameSubjectsError } = await supabase
      .from("subjects")
      .select("id, name, code")
      .eq("semester", currentSubject.semester)
      .eq("department_id", currentSubject.department_id)

    if (sameSubjectsError) {
      console.error("Error fetching same semester subjects:", sameSubjectsError)
      return errors
    }

    const subjectIds = sameSubjects.map((s: any) => s.id)

    // Get all forms for subjects in the same semester and department
    const { data: allForms, error: formsError } = await supabase
      .from("forms")
      .select("form, subject_id, faculty_id")
      .in("subject_id", subjectIds)

    if (formsError) {
      console.error("Error fetching forms for conflict check:", formsError)
      return errors
    }
    
    // Get faculty information for better error messages
    const { data: facultiesData, error: facultyError } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .in("id", allForms.map((record: any) => record.faculty_id))
    
    if (facultyError) {
      console.error("Error fetching faculty details:", facultyError)
    }

    // Check each CIE date for conflicts
    cies.forEach((cie, cieIndex) => {
      if (!cie.date) return

      const cieDate = convertToStandardDateFormat(cie.date)

      for (const formRecord of allForms) {
        const form = formRecord.form
        if (form && form.cies && Array.isArray(form.cies)) {
          for (let i = 0; i < form.cies.length; i++) {
            const existingCIE = form.cies[i]
            if (existingCIE.date) {
              const existingCIEDate = convertToStandardDateFormat(existingCIE.date)

              // Skip if it's the same CIE being edited
              if (formRecord.subject_id === subjectId && formRecord.faculty_id === facultyId && i === cieIndex) {
                continue
              }

              if (cieDate === existingCIEDate) {
                // Find faculty name
                const facultyInfo = facultiesData?.find((f: any) => f.id === formRecord.faculty_id)
                const facultyName = facultyInfo 
                  ? `${facultyInfo.first_name} ${facultyInfo.last_name}`
                  : "another faculty"
                
                // Find subject name
                const subjectInfo = sameSubjects.find((s: any) => s.id === formRecord.subject_id)
                const subjectName = subjectInfo 
                  ? `${subjectInfo.name} ${subjectInfo.code ? `(${subjectInfo.code})` : ''}`
                  : "another subject"
                
                errors.push(`CIE ${cieIndex + 1}: There is another ${existingCIE.type || "CIE"} taken by ${facultyName} on the same date for ${subjectName}`)
                break
              }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error("Error checking CIE date conflicts:", error)
  }

  return errors
}

// OPTIMIZED: Lightweight validation function for critical requirements only
const validateCriticalRequirements = async (
  supabase: any,
  cies: CIEData[],
  subjectType: "theory" | "practical" | "theory_practical",
  semester: number,
  termStartDate: Date | null,
  termEndDate: Date | null,
  totalCredits: number,
  courseOutcomes: any[] = [],
  subjectId: string,
  facultyId: string,
) => {
  const errors: string[] = []

  console.log("🔍 VALIDATION: Running critical validation only for performance")
  console.log("🔍 VALIDATION: Subject type:", subjectType)

  // NEW: Check for CIE date conflicts
  const conflictErrors = await checkCIEDateConflicts(supabase, cies, subjectId, facultyId)
  errors.push(...conflictErrors)

  // CRITICAL 1: Course Prerequisites CIE date validation
  if (termStartDate) {
    cies.forEach((cie, index) => {
      if (cie.type === "Course Prerequisites CIE" && cie.date) {
        const standardCieDate = convertToStandardDateFormat(cie.date)
        const cieDate = parseDDMMYYYYToDate(standardCieDate)

        if (cieDate) {
          const isWithin10Days = isDateWithinDays(cieDate, termStartDate, 10)
          if (!isWithin10Days) {
            const daysDiff = getDaysDifference(cieDate, termStartDate)
            errors.push(
              `CIE ${index + 1} (Course Prerequisites CIE) must be within 10 days of term start date (currently ${daysDiff} days apart)`,
            )
          }
        }
      }
    })
  }

  // CRITICAL 2: Required CIE types based on subject type
  const cieTypes = cies.map((cie) => cie.type)
  let requiredTypes: string[] = []

  if (subjectType === "theory") {
    requiredTypes = ["Lecture CIE", "Mid-term/Internal Exam"]
    if (semester > 1) {
      requiredTypes.push("Course Prerequisites CIE")
    }
  } else if (subjectType === "practical") {
    requiredTypes = ["Practical CIE", "Internal Practical"]
  } else if (subjectType === "theory_practical") {
    requiredTypes = ["Lecture CIE", "Mid-term/Internal Exam", "Practical CIE", "Internal Practical"]
    if (semester > 1) {
      requiredTypes.push("Course Prerequisites CIE")
    }
  }

  const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))
  if (missingTypes.length > 0) {
    const semesterNote =
      semester === 1 && subjectType === "theory_practical"
        ? " (Note: Course Prerequisites CIE is optional for 1st semester Theory+Practical subjects)"
        : semester === 1 && subjectType === "theory"
          ? " (Note: Course Prerequisites CIE is optional for 1st semester Theory subjects)"
          : ""
    errors.push(
      `At least one CIE from each required type must be present. Missing: ${missingTypes.join(", ")}${semesterNote}`,
    )
  }

  // CRITICAL 3: Term end date constraint
  if (termEndDate) {
    cies.forEach((cie, index) => {
      const cieDate = parseDDMMYYYYToDate(cie.date)
      if (cieDate && termEndDate && cieDate.getTime() > termEndDate.getTime()) {
        errors.push(`CIE ${index + 1} date cannot exceed the Course Term End Date`)
      }
    })
  }

  // CRITICAL 4: Basic field validation
  cies.forEach((cie, index) => {
    if (!cie.type) {
      errors.push(`CIE ${index + 1}: Type of evaluation is required`)
    }
    if (!cie.date) {
      errors.push(`CIE ${index + 1}: Date is required`)
    }
    if (!cie.evaluation_pedagogy) {
      errors.push(`CIE ${index + 1}: Evaluation pedagogy is required`)
    }
    if (!cie.blooms_taxonomy || cie.blooms_taxonomy.length === 0) {
      errors.push(`CIE ${index + 1}: At least one Bloom's taxonomy level is required`)
    }
  })

  // CRITICAL 5: FIXED - Total duration validation (ONLY FOR THEORY AND THEORY_PRACTICAL SUBJECTS)
  // Skip this validation entirely for practical-only subjects
  if (subjectType === "theory" || subjectType === "theory_practical") {
    const requiredMinimumHours = Math.max(0, totalCredits - 1)

    const theoryCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
    const theoryCIEs = cies.filter((cie: any) => theoryCIETypes.includes(cie.type))
    const totalTheoryDurationHours = theoryCIEs.reduce((sum, cie) => sum + (cie.duration || 0), 0) / 60

    if (totalTheoryDurationHours < requiredMinimumHours) {
      errors.push(
        `Total Theory CIE duration must be at least ${requiredMinimumHours} hours (currently ${totalTheoryDurationHours.toFixed(1)} hours). Practical CIEs are not counted in this validation.`,
      )
    }
  } else {
    console.log("🔍 VALIDATION: Skipping theory CIE duration validation for practical-only subject")
  }

  console.log("🔍 VALIDATION: Critical validation completed with errors:", errors)
  return errors
}

// OPTIMIZED: Main save function with parallel queries and reduced validation
export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
  console.log("🔍 SAVE: === CIE PLANNING FORM SAVE STARTED ===")

  try {
    const supabase = await createClient()

    // Validate required fields first (fast validation)
    if (!formData.faculty_id || !formData.subject_id) {
      return {
        success: false,
        error: "Faculty ID and Subject ID are required",
      }
    }

    if (!formData.cies || formData.cies.length === 0) {
      return {
        success: false,
        error: "At least one CIE is required",
      }
    }

    // OPTIMIZED: Run all database queries in parallel
    const [{ data: existingForm, error: formError }, { data: subjectData, error: subjectError }] = await Promise.all([
      supabase
        .from("forms")
        .select("form")
        .eq("faculty_id", formData.faculty_id)
        .eq("subject_id", formData.subject_id)
        .single(),
      supabase
        .from("subjects")
        .select("semester, credits, metadata, is_theory, is_practical")
        .eq("id", formData.subject_id)
        .single(),
    ])

    if (formError || !existingForm) {
      return {
        success: false,
        error: "No lesson plan found. Please complete the lesson plan first before adding CIE planning.",
      }
    }

    if (subjectError) {
      return {
        success: false,
        error: `Failed to validate CIE planning: ${subjectError.message}`,
      }
    }

    // OPTIMIZED: Get term dates directly from subjects table metadata (no additional query)
    let termStartDate: Date | null = null
    let termEndDate: Date | null = null

    if (subjectData.metadata) {
      if (subjectData.metadata.term_start_date) {
        if (typeof subjectData.metadata.term_start_date === "string") {
          if (subjectData.metadata.term_start_date.includes("T")) {
            termStartDate = new Date(subjectData.metadata.term_start_date)
          } else {
            termStartDate = parseDDMMYYYYToDate(subjectData.metadata.term_start_date)
          }
        }
      }

      if (subjectData.metadata.term_end_date) {
        if (typeof subjectData.metadata.term_end_date === "string") {
          if (subjectData.metadata.term_end_date.includes("T")) {
            termEndDate = new Date(subjectData.metadata.term_end_date)
          } else {
            termEndDate = parseDDMMYYYYToDate(subjectData.metadata.term_end_date)
          }
        }
      }
    }

    // Extract validation data from form
    const form = existingForm.form || {}
    let courseOutcomes: any[] = []
    let units: any[] = []

    // Get course outcomes and units
    if (form.generalDetails?.courseOutcomes && Array.isArray(form.generalDetails.courseOutcomes)) {
      courseOutcomes = form.generalDetails.courseOutcomes
    } else if (form.courseOutcomes && Array.isArray(form.courseOutcomes)) {
      courseOutcomes = form.courseOutcomes
    }

    if (form.units && Array.isArray(form.units)) {
      units = form.units
    }

    // Determine subject type using both form data and subject flags
    const subjectType = determineSubjectType(form, subjectData)

    console.log("🔍 SAVE: Final validation context:", {
      subjectType,
      semester: subjectData.semester,
      credits: subjectData.credits,
      termStartDate: termStartDate ? formatDateToDDMMYYYY(termStartDate) : null,
      termEndDate: termEndDate ? formatDateToDDMMYYYY(termEndDate) : null,
      courseOutcomesCount: courseOutcomes.length,
      unitsCount: units.length,
    })

    // OPTIMIZED: Run only critical validations for performance (including date conflict check)
    const criticalErrors = await validateCriticalRequirements(
      supabase,
      formData.cies,
      subjectType,
      subjectData.semester || 1,
      termStartDate,
      termEndDate,
      subjectData.credits || 0,
      courseOutcomes,
      formData.subject_id,
      formData.faculty_id,
    )

    if (criticalErrors.length > 0) {
      console.error("🔍 SAVE: Critical validation failed:", criticalErrors)
      return {
        success: false,
        error: criticalErrors.join("; "),
      }
    }

    // If critical validation passes, update the form
    const updatedForm = {
      ...form,
      cies: formData.cies,
      cie_remarks: formData.remarks || null,
      cie_planning_completed: true,
      last_updated: new Date().toISOString(),
    }

    const { data: updateResult, error: updateError } = await supabase
      .from("forms")
      .update({ form: updatedForm })
      .eq("faculty_id", formData.faculty_id)
      .eq("subject_id", formData.subject_id)
      .select()

    if (updateError) {
      console.log("🔍 SAVE: Update error:", updateError.message)
      return {
        success: false,
        error: `Failed to save CIE planning: ${updateError.message || "Database error"}`,
      }
    }

    console.log("🔍 SAVE: Successfully saved CIE planning")
    return {
      success: true,
      data: updateResult,
    }
  } catch (error) {
    console.error("🔍 SAVE: Unexpected error:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
    }
  }
}
