
// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { parseDDMMYYYYToDate, getDaysDifference } from "@/utils/dateUtils"

// // Define CIEData type
// interface CIEData {
//   date: string
//   type: string
//   blooms_taxonomy?: string[]
//   evaluation_pedagogy: string
//   duration?: number
//   co_mapping?: string[] // Add co_mapping property
// }

// // Define CIEPlanningFormData type
// interface CIEPlanningFormData {
//   faculty_id: string
//   subject_id: string
//   cies: CIEData[]
//   remarks?: string
// }

// // Function to determine subject type
// const determineSubjectType = (form: any): "theory" | "practical" | "theory_practical" => {
//   if (!form || !form.general_details || !form.subject_details) {
//     return "theory" // Default to theory if data is missing
//   }

//   const { subject_type } = form.general_details
//   return subject_type || "theory" // Default to theory if subject_type is missing
// }

// // Add comprehensive validation function
// const validateCIERequirements = (
//   cies: CIEData[],
//   subjectType: "theory" | "practical" | "theory_practical",
//   semester: number,
//   termStartDate: Date | null,
//   termEndDate: Date | null,
//   totalCredits: number,
//   courseOutcomes: any[] = [],
// ) => {
//   const errors: string[] = []

//   console.log("🔍 VALIDATION: Starting CIE validation with:", {
//     ciesCount: cies.length,
//     subjectType,
//     semester,
//     totalCredits,
//     courseOutcomesCount: courseOutcomes.length,
//   })

//   // VALIDATION 1: Date gap validation
//   const sortedCIEs = [...cies]
//     .filter((cie) => cie.date)
//     .sort((a, b) => {
//       const dateA = parseDDMMYYYYToDate(a.date)
//       const dateB = parseDDMMYYYYToDate(b.date)
//       if (!dateA || !dateB) return 0
//       return dateA.getTime() - dateB.getTime()
//     })

//   // Check term end date constraint
//   if (termEndDate) {
//     sortedCIEs.forEach((cie, index) => {
//       const cieDate = parseDDMMYYYYToDate(cie.date)
//       if (cieDate && cieDate > termEndDate) {
//         errors.push(`CIE ${index + 1} date cannot exceed the Course Term End Date`)
//       }
//     })
//   }

//   // Minimum 7 days gap between consecutive CIEs
//   for (let i = 1; i < sortedCIEs.length; i++) {
//     const prevDate = parseDDMMYYYYToDate(sortedCIEs[i - 1].date)
//     const currDate = parseDDMMYYYYToDate(sortedCIEs[i].date)
//     if (prevDate && currDate) {
//       const daysDiff = getDaysDifference(prevDate, currDate)
//       if (daysDiff < 7) {
//         errors.push("CIE dates must be at least 7 days apart")
//       }
//     }
//   }

//   // VALIDATION 1.5: Course Prerequisites CIE must be within 10 days of term start date
//   if (termStartDate) {
//     cies.forEach((cie, index) => {
//       if (cie.type === "Course Prerequisites CIE" && cie.date) {
//         const cieDate = parseDDMMYYYYToDate(cie.date)
//         if (cieDate) {
//           const daysDiff = getDaysDifference(termStartDate, cieDate)
//           if (daysDiff > 10) {
//             errors.push(
//               `CIE ${index + 1} (Course Prerequisites CIE) must be within 10 days of term start date (currently ${daysDiff} days)`,
//             )
//           }
//         }
//       }
//     })
//   }

//   // VALIDATION 2: Required CIE types based on subject type
//   const cieTypes = cies.map((cie) => cie.type)
//   let requiredTypes: string[] = []

//   if (subjectType === "theory") {
//     requiredTypes = ["Lecture CIE", "Mid-term/Internal Exam"]
//     if (semester > 1) {
//       requiredTypes.push("Course Prerequisites CIE")
//     }
//   } else if (subjectType === "practical") {
//     // PRACTICAL ONLY: Only require practical CIE types
//     requiredTypes = ["Practical CIE", "Internal Practical"]
//   } else if (subjectType === "theory_practical") {
//     requiredTypes = ["Lecture CIE", "Mid-term/Internal Exam", "Practical CIE", "Internal Practical"]
//     if (semester > 1) {
//       requiredTypes.push("Course Prerequisites CIE")
//     }
//   }

//   const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))
//   if (missingTypes.length > 0) {
//     const semesterNote = semester === 1 ? " (Note: Course Prerequisites CIE is optional for 1st semester)" : ""
//     errors.push(
//       `At least one CIE from each required type must be present. Missing: ${missingTypes.join(", ")}${semesterNote}`,
//     )
//   }

//   // VALIDATION 3 & 12: All CIEs should not have same Bloom's taxonomy
//   const bloomsCombinations = cies.map((cie) => (cie.blooms_taxonomy || []).sort().join(",")).filter(Boolean)

//   const uniqueBloomsCombinations = new Set(bloomsCombinations)
//   if (bloomsCombinations.length > 1 && uniqueBloomsCombinations.size === 1) {
//     errors.push("All CIEs should not have the same Bloom's Taxonomy combination")
//   }

//   // VALIDATION 13 & 14: Bloom's taxonomy restrictions and limits
//   const allBlooms = cies.flatMap((cie) => cie.blooms_taxonomy || [])
//   const rememberCount = allBlooms.filter((bloom) => bloom === "Remember").length
//   const understandCount = allBlooms.filter((bloom) => bloom === "Understand").length

//   if (semester > 2) {
//     const hasRemember = allBlooms.includes("Remember")
//     if (hasRemember) {
//       errors.push(`'Remember' bloom's taxonomy is not allowed for semester ${semester}`)
//     }
//   }

//   if (rememberCount > 1) {
//     errors.push("'Remember' bloom's taxonomy can be used maximum once across all CIEs")
//   }

//   if (understandCount > 2) {
//     errors.push("'Understand' bloom's taxonomy can be used maximum twice across all CIEs")
//   }

//   // VALIDATION 5: Open Book Assessment restrictions
//   cies.forEach((cie, index) => {
//     if (cie.evaluation_pedagogy === "Open Book Assessment") {
//       const allowedBlooms = ["Analyze", "Evaluate", "Create"]
//       const hasInvalidBlooms = cie.blooms_taxonomy?.some((bloom) => !allowedBlooms.includes(bloom))
//       if (hasInvalidBlooms) {
//         errors.push(`CIE ${index + 1}: Open Book Assessment only allows Analyze, Evaluate, and Create levels`)
//       }
//     }
//   })

//   // SKIP THEORY-SPECIFIC VALIDATIONS FOR PRACTICAL-ONLY SUBJECTS
//   if (subjectType !== "practical") {
//     // VALIDATION 6: Duration requirements for theory CIEs (SKIP for practical-only)
//     const theoryCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
//     const theoryCIEs = cies.filter((cie) => theoryCIETypes.includes(cie.type))
//     const totalTheoryDurationHours = theoryCIEs.reduce((sum, cie) => sum + (cie.duration || 0), 0) / 60
//     const requiredMinimumHours = Math.max(0, totalCredits - 1)

//     if (totalTheoryDurationHours < requiredMinimumHours) {
//       errors.push(
//         `Total Theory CIE duration must be at least ${requiredMinimumHours} hours (currently ${totalTheoryDurationHours.toFixed(1)} hours)`,
//       )
//     }

//     // VALIDATION 7 & 11: Traditional pedagogy uniqueness (SKIP for practical-only)
//     const traditionalPedagogies = [
//       "Objective-Based Assessment (Quiz/MCQ)",
//       "Short/Descriptive Evaluation",
//       "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
//       "Assignment-Based Evaluation (Homework/Take-home assignments)",
//     ]

//     const lectureCIEs = cies.filter((cie) => cie.type === "Lecture CIE")
//     const lecturePedagogies = lectureCIEs.map((cie) => cie.evaluation_pedagogy).filter(Boolean)
//     const usedTraditionalInLecture = lecturePedagogies.filter((pedagogy) => traditionalPedagogies.includes(pedagogy))

//     const uniqueTraditionalInLecture = new Set(usedTraditionalInLecture)
//     if (usedTraditionalInLecture.length !== uniqueTraditionalInLecture.size) {
//       errors.push("Each traditional pedagogy method must be used only once across Lecture CIEs")
//     }

//     // VALIDATION 8: At least one alternative pedagogy required (SKIP for practical-only)
//     const alternativePedagogies = [
//       "Problem-Based Evaluation",
//       "Open Book Assessment",
//       "Peer Assessment",
//       "Case Study-Based Evaluation",
//       "Concept Mapping Evaluation",
//       "Analytical Reasoning Test",
//       "Critical Thinking Assessment",
//       "Project-Based Assessment",
//       "Group/Team Assessment",
//       "Certification-Based Evaluation",
//     ]

//     if (lectureCIEs.length > 0) {
//       const usedAlternativeInLecture = lecturePedagogies.filter((pedagogy) => alternativePedagogies.includes(pedagogy))

//       if (usedAlternativeInLecture.length === 0) {
//         errors.push("At least one alternative pedagogy is required in Lecture CIEs")
//       }
//     }

//     // VALIDATION 9: CO coverage across relevant CIE types (SKIP for practical-only)
//     const relevantCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
//     const relevantCIEs = cies.filter((cie) => relevantCIETypes.includes(cie.type))

//     if (semester === 1) {
//       const hasPrereqCIE = cies.some((cie) => cie.type === "Course Prerequisites CIE")

//       if (!hasPrereqCIE) {
//         const firstSemRelevantTypes = ["Lecture CIE", "Mid-term/Internal Exam"]
//         const firstSemRelevantCIEs = cies.filter((cie) => firstSemRelevantTypes.includes(cie.type))

//         if (firstSemRelevantCIEs.length > 0 && courseOutcomes.length > 0) {
//           const allCOMappings = new Set()
//           firstSemRelevantCIEs.forEach((cie) => {
//             if (cie.co_mapping && Array.isArray(cie.co_mapping)) {
//               cie.co_mapping.forEach((coId: string) => allCOMappings.add(coId))
//             }
//           })

//           if (allCOMappings.size < courseOutcomes.length) {
//             errors.push("All COs must be covered across Lecture CIEs + Mid-term/Internal Exams")
//           }
//         }
//       } else {
//         if (relevantCIEs.length > 0 && courseOutcomes.length > 0) {
//           const allCOMappings = new Set()
//           relevantCIEs.forEach((cie) => {
//             if (cie.co_mapping && Array.isArray(cie.co_mapping)) {
//               cie.co_mapping.forEach((coId: string) => allCOMappings.add(coId))
//             }
//           })

//           if (allCOMappings.size < courseOutcomes.length) {
//             errors.push(
//               "All COs must be covered across Lecture CIEs + Course Prerequisites CIEs + Mid-term/Internal Exams",
//             )
//           }
//         }
//       }
//     } else {
//       if (relevantCIEs.length > 0 && courseOutcomes.length > 0) {
//         const allCOMappings = new Set()
//         relevantCIEs.forEach((cie) => {
//           if (cie.co_mapping && Array.isArray(cie.co_mapping)) {
//             cie.co_mapping.forEach((coId: string) => allCOMappings.add(coId))
//           }
//         })

//         if (allCOMappings.size < courseOutcomes.length) {
//           errors.push(
//             "All COs must be covered across Lecture CIEs + Course Prerequisites CIEs + Mid-term/Internal Exams",
//           )
//         }
//       }
//     }
//   }

//   console.log("🔍 VALIDATION: Completed with errors:", errors)
//   return errors
// }

// // Simple test function to check database connectivity
// export async function testDatabaseConnection() {
//   try {
//     console.log("🔍 TEST: Testing database connection...")
//     const supabase = await createClient()

//     // Test basic connection
//     const { data, error } = await supabase.from("users").select("id").limit(1)

//     if (error) {
//       console.error("🔍 TEST: Database connection failed:", error)
//       return { success: false, error: error.message }
//     }

//     console.log("🔍 TEST: Database connection successful")
//     return { success: true }
//   } catch (error) {
//     console.error("🔍 TEST: Database connection error:", error)
//     return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
//   }
// }

// // Simple test function to check cie_planning table
// export async function testCIEPlanningTable() {
//   try {
//     console.log("🔍 TEST: Testing cie_planning table...")
//     const supabase = await createClient()

//     // Test table access
//     const { data, error } = await supabase.from("cie_planning").select("id").limit(1)

//     if (error) {
//       console.error("🔍 TEST: cie_planning table access failed:", error)
//       return { success: false, error: error.message }
//     }

//     console.log("🔍 TEST: cie_planning table access successful")
//     return { success: true, data }
//   } catch (error) {
//     console.error("🔍 TEST: cie_planning table error:", error)
//     return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
//   }
// }

// // Update the main saveCIEPlanningForm function to use this validation
// export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
//   console.log("🔍 SAVE: === CIE PLANNING FORM SAVE STARTED ===")
//   console.log("🔍 SAVE: Input data:", JSON.stringify(formData, null, 2))

//   try {
//     console.log("🔍 SAVE: Starting CIE planning form save with:", {
//       faculty_id: formData.faculty_id,
//       subject_id: formData.subject_id,
//       ciesCount: formData.cies?.length || 0,
//     })

//     const supabase = await createClient()

//     // Validate required fields
//     if (!formData.faculty_id || !formData.subject_id) {
//       console.error("🔍 SAVE: Missing required fields")
//       return {
//         success: false,
//         error: "Faculty ID and Subject ID are required",
//       }
//     }

//     if (!formData.cies || formData.cies.length === 0) {
//       console.error("🔍 SAVE: No CIEs provided")
//       return {
//         success: false,
//         error: "At least one CIE is required",
//       }
//     }

//     // Get existing form data from forms table
//     console.log("🔍 SAVE: Fetching existing form data...")
//     const { data: existingForm, error: formError } = await supabase
//       .from("forms")
//       .select("form")
//       .eq("faculty_id", formData.faculty_id)
//       .eq("subject_id", formData.subject_id)
//       .single()

//     if (formError) {
//       console.error("🔍 SAVE: Error fetching existing form:", formError)
//       return {
//         success: false,
//         error: `Failed to fetch existing form data: ${formError.message}`,
//       }
//     }

//     if (!existingForm) {
//       console.error("🔍 SAVE: No existing form found")
//       return {
//         success: false,
//         error: "No lesson plan found. Please complete the lesson plan first before adding CIE planning.",
//       }
//     }

//     console.log("🔍 SAVE: Existing form found, processing...")

//     // Get subject data for validation
//     const { data: subjectData, error: subjectError } = await supabase
//       .from("subjects")
//       .select("semester, credits")
//       .eq("id", formData.subject_id)
//       .single()

//     if (subjectError) {
//       console.error("🔍 SAVE: Subject fetch error:", subjectError)
//       return {
//         success: false,
//         error: `Failed to validate CIE planning: ${subjectError.message}`,
//       }
//     }

//     console.log("🔍 SAVE: Subject data fetched successfully:", subjectData)

//     // Extract data for validation
//     let termStartDate: Date | null = null
//     let termEndDate: Date | null = null
//     let subjectType: "theory" | "practical" | "theory_practical" = "theory"
//     let courseOutcomes: any[] = []

//     const form = existingForm.form || {}

//     // Get term dates
//     if (form.generalDetails) {
//       termStartDate = parseDDMMYYYYToDate(form.generalDetails.term_start_date)
//       termEndDate = parseDDMMYYYYToDate(form.generalDetails.term_end_date)
//     }

//     // Get course outcomes
//     if (form.generalDetails?.courseOutcomes && Array.isArray(form.generalDetails.courseOutcomes)) {
//       courseOutcomes = form.generalDetails.courseOutcomes
//     } else if (form.courseOutcomes && Array.isArray(form.courseOutcomes)) {
//       courseOutcomes = form.courseOutcomes
//     }

//     // Determine subject type based on existing data
//     const hasUnits = form.units && Array.isArray(form.units) && form.units.length > 0
//     const hasPracticals = form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0

//     // Check if there's an explicit subject type in general details
//     if (form.generalDetails?.subject_type) {
//       subjectType = form.generalDetails.subject_type
//     } else {
//       // Fallback to determining from units/practicals
//       if (hasUnits && hasPracticals) {
//         subjectType = "theory_practical"
//       } else if (hasPracticals && !hasUnits) {
//         subjectType = "practical"
//       } else {
//         subjectType = "theory"
//       }
//     }

//     console.log("🔍 SAVE: Subject type determination:", {
//       hasUnits,
//       hasPracticals,
//       explicitSubjectType: form.generalDetails?.subject_type,
//       finalSubjectType: subjectType,
//     })

//     console.log("🔍 SAVE: Running validation with:", {
//       subjectType,
//       semester: subjectData.semester,
//       credits: subjectData.credits,
//       courseOutcomesCount: courseOutcomes.length,
//     })

//     // Run comprehensive validation
//     const validationErrors = validateCIERequirements(
//       formData.cies,
//       subjectType,
//       subjectData.semester || 1,
//       termStartDate,
//       termEndDate,
//       subjectData.credits || 0,
//       courseOutcomes,
//     )

//     if (validationErrors.length > 0) {
//       console.error("🔍 SAVE: Validation failed:", validationErrors)
//       return {
//         success: false,
//         error: validationErrors.join("; "),
//       }
//     }

//     console.log("🔍 SAVE: Validation passed, updating form...")

//     // Update the existing form with CIE planning data
//     const updatedForm = {
//       ...form,
//       cies: formData.cies,
//       cie_remarks: formData.remarks || null,
//       cie_planning_completed: true,
//       last_updated: new Date().toISOString(),
//     }

//     console.log("🔍 SAVE: About to update forms table...")
//     console.log("🔍 SAVE: Update data structure:", {
//       cies_count: formData.cies?.length,
//       has_existing_form: !!form,
//       form_keys: Object.keys(form),
//     })

//     // Update the forms table
//     const { data: updateResult, error: updateError } = await supabase
//       .from("forms")
//       .update({
//         form: updatedForm,
//       })
//       .eq("faculty_id", formData.faculty_id)
//       .eq("subject_id", formData.subject_id)
//       .select()

//     if (updateError) {
//       console.error("🔍 SAVE: === UPDATE ERROR ===")
//       console.error("🔍 SAVE: Update error type:", typeof updateError)
//       console.error("🔍 SAVE: Update error:", updateError)
//       console.error("🔍 SAVE: Update error message:", updateError.message)
//       console.error("🔍 SAVE: Update error details:", updateError.details)
//       console.error("🔍 SAVE: Update error hint:", updateError.hint)
//       console.error("🔍 SAVE: Update error code:", updateError.code)
//       return {
//         success: false,
//         error: `Failed to save CIE planning: ${updateError.message || "Database error"}`,
//       }
//     }

//     console.log("🔍 SAVE: Update successful:", updateResult)
//     return {
//       success: true,
//       data: updateResult,
//     }
//   } catch (error) {
//     console.error("🔍 SAVE: === UNEXPECTED ERROR OCCURRED ===")
//     console.error("🔍 SAVE: Error type:", typeof error)
//     console.error("🔍 SAVE: Error constructor:", error?.constructor?.name)
//     console.error("🔍 SAVE: Error message:", error?.message)
//     console.error("🔍 SAVE: Error stack:", error?.stack)
//     console.error("🔍 SAVE: Full error object:", error)

//     return {
//       success: false,
//       error: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
//     }
//   }
// }



























// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { parseDDMMYYYYToDate, getDaysDifference } from "@/utils/dateUtils"

// // Define CIEData type
// interface CIEData {
//   date: string
//   type: string
//   blooms_taxonomy?: string[]
//   evaluation_pedagogy: string
//   duration?: number
//   co_mapping?: string[] // Add co_mapping property
// }

// // Define CIEPlanningFormData type
// interface CIEPlanningFormData {
//   faculty_id: string
//   subject_id: string
//   cies: CIEData[]
//   remarks?: string
// }

// // Function to determine subject type - IMPROVED LOGIC using database flags
// const determineSubjectType = async (
//   form: any,
//   subjectId: string,
// ): Promise<"theory" | "practical" | "theory_practical"> => {
//   console.log("🔍 SUBJECT TYPE: Determining subject type with form data:", {
//     hasGeneralDetails: !!form.general_details,
//     hasGeneralDetailsSubjectType: !!form.general_details?.subject_type,
//     hasUnits: !!(form.units && Array.isArray(form.units) && form.units.length > 0),
//     hasPracticals: !!(form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0),
//     formKeys: Object.keys(form || {}),
//     subjectId,
//   })

//   // Method 1: Get subject flags from database (most reliable)
//   try {
//     const supabase = await createClient()
//     const { data: subjectData, error } = await supabase
//       .from("subjects")
//       .select("is_practical, is_theory")
//       .eq("id", subjectId)
//       .single()

//     if (!error && subjectData) {
//       const { is_practical, is_theory } = subjectData
//       console.log("🔍 SUBJECT TYPE: Using database flags:", { is_practical, is_theory })

//       if (is_practical && is_theory) {
//         console.log("🔍 SUBJECT TYPE: Both flags true - theory_practical")
//         return "theory_practical"
//       } else if (is_practical && !is_theory) {
//         console.log("🔍 SUBJECT TYPE: Only practical flag true - practical")
//         return "practical"
//       } else if (!is_practical && is_theory) {
//         console.log("🔍 SUBJECT TYPE: Only theory flag true - theory")
//         return "theory"
//       }
//     } else {
//       console.log("🔍 SUBJECT TYPE: Could not fetch subject flags:", error)
//     }
//   } catch (error) {
//     console.log("🔍 SUBJECT TYPE: Error fetching subject flags:", error)
//   }

//   // Method 2: Check for explicit subject type first (fallback)
//   if (form.general_details?.subject_type) {
//     console.log("🔍 SUBJECT TYPE: Found explicit subject type:", form.general_details.subject_type)
//     return form.general_details.subject_type
//   }

//   // Check for subject_type at root level (fallback)
//   if (form.subject_type) {
//     console.log("🔍 SUBJECT TYPE: Found root level subject type:", form.subject_type)
//     return form.subject_type
//   }

//   // Method 3: Determine from units/practicals presence (last resort)
//   const hasUnits = form.units && Array.isArray(form.units) && form.units.length > 0
//   const hasPracticals = form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0

//   console.log("🔍 SUBJECT TYPE: Determining from content:", { hasUnits, hasPracticals })

//   if (hasPracticals && !hasUnits) {
//     console.log("🔍 SUBJECT TYPE: Determined as practical (has practicals, no units)")
//     return "practical"
//   } else if (hasUnits && hasPracticals) {
//     console.log("🔍 SUBJECT TYPE: Determined as theory_practical (has both)")
//     return "theory_practical"
//   } else if (hasUnits && !hasPracticals) {
//     console.log("🔍 SUBJECT TYPE: Determined as theory (has units, no practicals)")
//     return "theory"
//   }

//   // Default fallback
//   console.log("🔍 SUBJECT TYPE: Defaulting to theory (no clear indicators)")
//   return "theory"
// }

// // Add comprehensive validation function
// const validateCIERequirements = (
//   cies: CIEData[],
//   subjectType: "theory" | "practical" | "theory_practical",
//   semester: number,
//   termStartDate: Date | null,
//   termEndDate: Date | null,
//   totalCredits: number,
//   courseOutcomes: any[] = [],
// ) => {
//   const errors: string[] = []

//   console.log("🔍 VALIDATION: Starting CIE validation with:", {
//     ciesCount: cies.length,
//     subjectType,
//     semester,
//     totalCredits,
//     courseOutcomesCount: courseOutcomes.length,
//   })

//   // VALIDATION 1: Date gap validation
//   const sortedCIEs = [...cies]
//     .filter((cie) => cie.date)
//     .sort((a, b) => {
//       const dateA = parseDDMMYYYYToDate(a.date)
//       const dateB = parseDDMMYYYYToDate(b.date)
//       if (!dateA || !dateB) return 0
//       return dateA.getTime() - dateB.getTime()
//     })

//   // Check term end date constraint
//   if (termEndDate) {
//     sortedCIEs.forEach((cie, index) => {
//       const cieDate = parseDDMMYYYYToDate(cie.date)
//       if (cieDate && cieDate > termEndDate) {
//         errors.push(`CIE ${index + 1} date cannot exceed the Course Term End Date`)
//       }
//     })
//   }

//   // Minimum 7 days gap between consecutive CIEs
//   for (let i = 1; i < sortedCIEs.length; i++) {
//     const prevDate = parseDDMMYYYYToDate(sortedCIEs[i - 1].date)
//     const currDate = parseDDMMYYYYToDate(sortedCIEs[i].date)
//     if (prevDate && currDate) {
//       const daysDiff = getDaysDifference(prevDate, currDate)
//       if (daysDiff < 7) {
//         errors.push("CIE dates must be at least 7 days apart")
//       }
//     }
//   }

//   // VALIDATION 1.5: Course Prerequisites CIE must be within 10 days of term start date
//   if (termStartDate) {
//     cies.forEach((cie, index) => {
//       if (cie.type === "Course Prerequisites CIE" && cie.date) {
//         const cieDate = parseDDMMYYYYToDate(cie.date)
//         if (cieDate) {
//           const daysDiff = getDaysDifference(termStartDate, cieDate)
//           if (daysDiff > 10) {
//             errors.push(
//               `CIE ${index + 1} (Course Prerequisites CIE) must be within 10 days of term start date (currently ${daysDiff} days)`,
//             )
//           }
//         }
//       }
//     })
//   }

//   // VALIDATION 2: Required CIE types based on subject type - FIXED LOGIC
//   const cieTypes = cies.map((cie) => cie.type)
//   let requiredTypes: string[] = []

//   console.log("🔍 VALIDATION: Determining required CIE types for subject type:", subjectType)

//   if (subjectType === "practical") {
//     // PRACTICAL ONLY: Only require practical CIE types
//     requiredTypes = ["Practical CIE", "Internal Practical"]
//     console.log("🔍 VALIDATION: Practical subject - required types:", requiredTypes)
//   } else if (subjectType === "theory") {
//     requiredTypes = ["Lecture CIE", "Mid-term/Internal Exam"]
//     if (semester > 1) {
//       requiredTypes.push("Course Prerequisites CIE")
//     }
//     console.log("🔍 VALIDATION: Theory subject - required types:", requiredTypes)
//   } else if (subjectType === "theory_practical") {
//     requiredTypes = ["Lecture CIE", "Mid-term/Internal Exam", "Practical CIE", "Internal Practical"]
//     if (semester > 1) {
//       requiredTypes.push("Course Prerequisites CIE")
//     }
//     console.log("🔍 VALIDATION: Theory+Practical subject - required types:", requiredTypes)
//   }

//   const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))
//   if (missingTypes.length > 0) {
//     const semesterNote =
//       semester === 1 && subjectType !== "practical"
//         ? " (Note: Course Prerequisites CIE is optional for 1st semester)"
//         : ""
//     errors.push(
//       `At least one CIE from each required type must be present. Missing: ${missingTypes.join(", ")}${semesterNote}`,
//     )
//   }

//   // VALIDATION 3 & 12: All CIEs should not have same Bloom's taxonomy
//   const bloomsCombinations = cies.map((cie) => (cie.blooms_taxonomy || []).sort().join(",")).filter(Boolean)

//   const uniqueBloomsCombinations = new Set(bloomsCombinations)
//   if (bloomsCombinations.length > 1 && uniqueBloomsCombinations.size === 1) {
//     errors.push("All CIEs should not have the same Bloom's Taxonomy combination")
//   }

//   // VALIDATION 13 & 14: Bloom's taxonomy restrictions and limits
//   const allBlooms = cies.flatMap((cie) => cie.blooms_taxonomy || [])
//   const rememberCount = allBlooms.filter((bloom) => bloom === "Remember").length
//   const understandCount = allBlooms.filter((bloom) => bloom === "Understand").length

//   if (semester > 2) {
//     const hasRemember = allBlooms.includes("Remember")
//     if (hasRemember) {
//       errors.push(`'Remember' bloom's taxonomy is not allowed for semester ${semester}`)
//     }
//   }

//   if (rememberCount > 1) {
//     errors.push("'Remember' bloom's taxonomy can be used maximum once across all CIEs")
//   }

//   if (understandCount > 2) {
//     errors.push("'Understand' bloom's taxonomy can be used maximum twice across all CIEs")
//   }

//   // VALIDATION 5: Open Book Assessment restrictions
//   cies.forEach((cie, index) => {
//     if (cie.evaluation_pedagogy === "Open Book Assessment") {
//       const allowedBlooms = ["Analyze", "Evaluate", "Create"]
//       const hasInvalidBlooms = cie.blooms_taxonomy?.some((bloom) => !allowedBlooms.includes(bloom))
//       if (hasInvalidBlooms) {
//         errors.push(`CIE ${index + 1}: Open Book Assessment only allows Analyze, Evaluate, and Create levels`)
//       }
//     }
//   })

//   // SKIP ALL THEORY-SPECIFIC VALIDATIONS FOR PRACTICAL-ONLY SUBJECTS
//   if (subjectType === "practical") {
//     console.log("🔍 VALIDATION: Skipping all theory-specific validations for practical subject")
//   } else {
//     console.log("🔍 VALIDATION: Running theory-specific validations for subject type:", subjectType)

//     // VALIDATION 6: Duration requirements for theory CIEs (SKIP for practical-only)
//     const theoryCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
//     const theoryCIEs = cies.filter((cie) => theoryCIETypes.includes(cie.type))
//     const totalTheoryDurationHours = theoryCIEs.reduce((sum, cie) => sum + (cie.duration || 0), 0) / 60
//     const requiredMinimumHours = Math.max(0, totalCredits - 1)

//     if (totalTheoryDurationHours < requiredMinimumHours) {
//       errors.push(
//         `Total Theory CIE duration must be at least ${requiredMinimumHours} hours (currently ${totalTheoryDurationHours.toFixed(1)} hours)`,
//       )
//     }

//     // VALIDATION 7 & 11: Traditional pedagogy uniqueness (SKIP for practical-only)
//     const traditionalPedagogies = [
//       "Objective-Based Assessment (Quiz/MCQ)",
//       "Short/Descriptive Evaluation",
//       "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
//       "Assignment-Based Evaluation (Homework/Take-home assignments)",
//     ]

//     const lectureCIEs = cies.filter((cie) => cie.type === "Lecture CIE")
//     const lecturePedagogies = lectureCIEs.map((cie) => cie.evaluation_pedagogy).filter(Boolean)
//     const usedTraditionalInLecture = lecturePedagogies.filter((pedagogy) => traditionalPedagogies.includes(pedagogy))

//     const uniqueTraditionalInLecture = new Set(usedTraditionalInLecture)
//     if (usedTraditionalInLecture.length !== uniqueTraditionalInLecture.size) {
//       errors.push("Each traditional pedagogy method must be used only once across Lecture CIEs")
//     }

//     // VALIDATION 8: At least one alternative pedagogy required (SKIP for practical-only)
//     const alternativePedagogies = [
//       "Problem-Based Evaluation",
//       "Open Book Assessment",
//       "Peer Assessment",
//       "Case Study-Based Evaluation",
//       "Concept Mapping Evaluation",
//       "Analytical Reasoning Test",
//       "Critical Thinking Assessment",
//       "Project-Based Assessment",
//       "Group/Team Assessment",
//       "Certification-Based Evaluation",
//     ]

//     if (lectureCIEs.length > 0) {
//       const usedAlternativeInLecture = lecturePedagogies.filter((pedagogy) => alternativePedagogies.includes(pedagogy))

//       if (usedAlternativeInLecture.length === 0) {
//         errors.push("At least one alternative pedagogy is required in Lecture CIEs")
//       }
//     }

//     // VALIDATION 9: CO coverage across relevant CIE types (SKIP - made optional)
//     // This validation is now completely skipped as requested
//   }

//   console.log("🔍 VALIDATION: Completed with errors:", errors)
//   return errors
// }

// // Simple test function to check database connectivity
// export async function testDatabaseConnection() {
//   try {
//     console.log("🔍 TEST: Testing database connection...")
//     const supabase = await createClient()

//     // Test basic connection
//     const { data, error } = await supabase.from("users").select("id").limit(1)

//     if (error) {
//       console.error("🔍 TEST: Database connection failed:", error)
//       return { success: false, error: error.message }
//     }

//     console.log("🔍 TEST: Database connection successful")
//     return { success: true }
//   } catch (error) {
//     console.error("🔍 TEST: Database connection error:", error)
//     return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
//   }
// }

// // Simple test function to check cie_planning table
// export async function testCIEPlanningTable() {
//   try {
//     console.log("🔍 TEST: Testing cie_planning table...")
//     const supabase = await createClient()

//     // Test table access
//     const { data, error } = await supabase.from("cie_planning").select("id").limit(1)

//     if (error) {
//       console.error("🔍 TEST: cie_planning table access failed:", error)
//       return { success: false, error: error.message }
//     }

//     console.log("🔍 TEST: cie_planning table access successful")
//     return { success: true, data }
//   } catch (error) {
//     console.error("🔍 TEST: cie_planning table error:", error)
//     return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
//   }
// }

// // Update the main saveCIEPlanningForm function to use this validation
// export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
//   console.log("🔍 SAVE: === CIE PLANNING FORM SAVE STARTED ===")
//   console.log("🔍 SAVE: Input data:", JSON.stringify(formData, null, 2))

//   try {
//     console.log("🔍 SAVE: Starting CIE planning form save with:", {
//       faculty_id: formData.faculty_id,
//       subject_id: formData.subject_id,
//       ciesCount: formData.cies?.length || 0,
//     })

//     const supabase = await createClient()

//     // Validate required fields
//     if (!formData.faculty_id || !formData.subject_id) {
//       console.error("🔍 SAVE: Missing required fields")
//       return {
//         success: false,
//         error: "Faculty ID and Subject ID are required",
//       }
//     }

//     if (!formData.cies || formData.cies.length === 0) {
//       console.error("🔍 SAVE: No CIEs provided")
//       return {
//         success: false,
//         error: "At least one CIE is required",
//       }
//     }

//     // Get existing form data from forms table
//     console.log("🔍 SAVE: Fetching existing form data...")
//     const { data: existingForm, error: formError } = await supabase
//       .from("forms")
//       .select("form")
//       .eq("faculty_id", formData.faculty_id)
//       .eq("subject_id", formData.subject_id)
//       .single()

//     if (formError) {
//       console.error("🔍 SAVE: Error fetching existing form:", formError)
//       return {
//         success: false,
//         error: `Failed to fetch existing form data: ${formError.message}`,
//       }
//     }

//     if (!existingForm) {
//       console.error("🔍 SAVE: No existing form found")
//       return {
//         success: false,
//         error: "No lesson plan found. Please complete the lesson plan first before adding CIE planning.",
//       }
//     }

//     console.log("🔍 SAVE: Existing form found, processing...")

//     // Get subject data for validation
//     const { data: subjectData, error: subjectError } = await supabase
//       .from("subjects")
//       .select("semester, credits")
//       .eq("id", formData.subject_id)
//       .single()

//     if (subjectError) {
//       console.error("🔍 SAVE: Subject fetch error:", subjectError)
//       return {
//         success: false,
//         error: `Failed to validate CIE planning: ${subjectError.message}`,
//       }
//     }

//     console.log("🔍 SAVE: Subject data fetched successfully:", subjectData)

//     // Extract data for validation
//     let termStartDate: Date | null = null
//     let termEndDate: Date | null = null
//     let courseOutcomes: any[] = []

//     const form = existingForm.form || {}

//     console.log("🔍 SAVE: Form structure analysis:", {
//       formKeys: Object.keys(form),
//       hasGeneralDetails: !!form.generalDetails,
//       hasUnits: !!(form.units && Array.isArray(form.units) && form.units.length > 0),
//       hasPracticals: !!(form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0),
//       generalDetailsKeys: form.generalDetails ? Object.keys(form.generalDetails) : [],
//     })

//     // Get term dates
//     if (form.generalDetails) {
//       termStartDate = parseDDMMYYYYToDate(form.generalDetails.term_start_date)
//       termEndDate = parseDDMMYYYYToDate(form.generalDetails.term_end_date)
//     }

//     // Get course outcomes
//     if (form.generalDetails?.courseOutcomes && Array.isArray(form.generalDetails.courseOutcomes)) {
//       courseOutcomes = form.generalDetails.courseOutcomes
//     } else if (form.courseOutcomes && Array.isArray(form.courseOutcomes)) {
//       courseOutcomes = form.courseOutcomes
//     }

//     // Determine subject type using improved logic
//     const subjectType = await determineSubjectType(form, formData.subject_id)

//     console.log("🔍 SAVE: Subject type determination result:", {
//       finalSubjectType: subjectType,
//       hasUnits: !!(form.units && Array.isArray(form.units) && form.units.length > 0),
//       hasPracticals: !!(form.practicals && Array.isArray(form.practicals) && form.practicals.length > 0),
//       explicitSubjectType: form.generalDetails?.subject_type || form.subject_type,
//     })

//     console.log("🔍 SAVE: Running validation with:", {
//       subjectType,
//       semester: subjectData.semester,
//       credits: subjectData.credits,
//       courseOutcomesCount: courseOutcomes.length,
//     })

//     // Run comprehensive validation
//     const validationErrors = validateCIERequirements(
//       formData.cies,
//       subjectType,
//       subjectData.semester || 1,
//       termStartDate,
//       termEndDate,
//       subjectData.credits || 0,
//       courseOutcomes,
//     )

//     if (validationErrors.length > 0) {
//       console.error("🔍 SAVE: Validation failed:", validationErrors)
//       return {
//         success: false,
//         error: validationErrors.join("; "),
//       }
//     }

//     console.log("🔍 SAVE: Validation passed, updating form...")

//     // Update the existing form with CIE planning data
//     const updatedForm = {
//       ...form,
//       cies: formData.cies,
//       cie_remarks: formData.remarks || null,
//       cie_planning_completed: true,
//       last_updated: new Date().toISOString(),
//     }

//     console.log("🔍 SAVE: About to update forms table...")
//     console.log("🔍 SAVE: Update data structure:", {
//       cies_count: formData.cies?.length,
//       has_existing_form: !!form,
//       form_keys: Object.keys(form),
//     })

//     // Update the forms table
//     const { data: updateResult, error: updateError } = await supabase
//       .from("forms")
//       .update({
//         form: updatedForm,
//       })
//       .eq("faculty_id", formData.faculty_id)
//       .eq("subject_id", formData.subject_id)
//       .select()

//     if (updateError) {
//       console.error("🔍 SAVE: === UPDATE ERROR ===")
//       console.error("🔍 SAVE: Update error type:", typeof updateError)
//       console.error("🔍 SAVE: Update error:", updateError)
//       console.error("🔍 SAVE: Update error message:", updateError.message)
//       console.error("🔍 SAVE: Update error details:", updateError.details)
//       console.error("🔍 SAVE: Update error hint:", updateError.hint)
//       console.error("🔍 SAVE: Update error code:", updateError.code)
//       return {
//         success: false,
//         error: `Failed to save CIE planning: ${updateError.message || "Database error"}`,
//       }
//     }

//     console.log("🔍 SAVE: Update successful:", updateResult)
//     return {
//       success: true,
//       data: updateResult,
//     }
//   } catch (error) {
//     console.error("🔍 SAVE: === UNEXPECTED ERROR OCCURRED ===")
//     console.error("🔍 SAVE: Error type:", typeof error)
//     console.error("🔍 SAVE: Error constructor:", error?.constructor?.name)
//     console.error("🔍 SAVE: Error message:", error?.message)
//     console.error("🔍 SAVE: Error stack:", error?.stack)
//     console.error("🔍 SAVE: Full error object:", error)

//     return {
//       success: false,
//       error: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
//     }
//   }
// }





























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

// FIXED: Get term dates directly from subjects table metadata
const getTermDatesFromSubject = async (supabase: any, subjectId: string) => {
  console.log("🔍 GETTING TERM DATES: Fetching from subjects table for:", subjectId)

  const { data: subjectData, error: subjectError } = await supabase
    .from("subjects")
    .select("metadata")
    .eq("id", subjectId)
    .single()

  if (subjectError || !subjectData) {
    console.log("🔍 GETTING TERM DATES: Error or no data:", subjectError)
    return { termStartDate: null, termEndDate: null }
  }

  console.log("🔍 GETTING TERM DATES: Subject metadata:", subjectData.metadata)

  let termStartDate: Date | null = null
  let termEndDate: Date | null = null

  if (subjectData.metadata) {
    // Extract term dates from metadata
    if (subjectData.metadata.term_start_date) {
      console.log("🔍 GETTING TERM DATES: Raw term_start_date:", subjectData.metadata.term_start_date)

      // Handle different date formats from metadata
      if (typeof subjectData.metadata.term_start_date === "string") {
        if (subjectData.metadata.term_start_date.includes("T")) {
          // ISO format: "2025-10-04T18:30:00.000Z"
          termStartDate = new Date(subjectData.metadata.term_start_date)
        } else {
          // DD-MM-YYYY format: "04-10-2025"
          termStartDate = parseDDMMYYYYToDate(subjectData.metadata.term_start_date)
        }
      }

      console.log("🔍 GETTING TERM DATES: Parsed term start date:", termStartDate?.toString())
    }

    if (subjectData.metadata.term_end_date) {
      console.log("🔍 GETTING TERM DATES: Raw term_end_date:", subjectData.metadata.term_end_date)

      // Handle different date formats from metadata
      if (typeof subjectData.metadata.term_end_date === "string") {
        if (subjectData.metadata.term_end_date.includes("T")) {
          // ISO format: "2025-10-05T18:30:00.000Z"
          termEndDate = new Date(subjectData.metadata.term_end_date)
        } else {
          // DD-MM-YYYY format: "05-10-2025"
          termEndDate = parseDDMMYYYYToDate(subjectData.metadata.term_end_date)
        }
      }

      console.log("🔍 GETTING TERM DATES: Parsed term end date:", termEndDate?.toString())
    }
  }

  return { termStartDate, termEndDate }
}

// OPTIMIZED: Lightweight validation function for critical requirements only
const validateCriticalRequirements = (
  cies: CIEData[],
  subjectType: "theory" | "practical" | "theory_practical",
  semester: number,
  termStartDate: Date | null,
  termEndDate: Date | null,
  totalCredits: number,
  courseOutcomes: any[] = [],
) => {
  const errors: string[] = []

  console.log("🔍 VALIDATION: Running critical validation only for performance")
  console.log("🔍 VALIDATION: Subject type:", subjectType)

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

    // OPTIMIZED: Run only critical validations for performance
    const criticalErrors = validateCriticalRequirements(
      formData.cies,
      subjectType,
      subjectData.semester || 1,
      termStartDate,
      termEndDate,
      subjectData.credits || 0,
      courseOutcomes,
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
