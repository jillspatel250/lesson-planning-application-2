//@ts-nocheck
// // "use server"


// // import { createClient } from "@/utils/supabase/server"
// // import { revalidatePath } from "next/cache"

// // export interface CIEData {
// //   id: string
// //   type: string
// //   units_covered?: string[]
// //   practicals_covered?: string[]
// //   date: string
// //   marks: number
// //   duration: number
// //   blooms_taxonomy: string[]
// //   evaluation_pedagogy: string
// //   other_pedagogy?: string
// //   co_mapping: string[]
// //   pso_mapping?: string[]
// //   peo_mapping?: string[]
// //   skill_mapping: Array<{
// //     skill: string
// //     details: string
// //   }>
// // }

// // export interface CIEPlanningFormData {
// //   faculty_id: string
// //   subject_id: string
// //   cies: CIEData[]
// //   remarks?: string
// // }

// // export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
// //   try {
// //     const supabase = await createClient()

// //     // Validate minimum requirements
// //     if (formData.cies.length < 3) {
// //       return {
// //         success: false,
// //         error: "Minimum 3 CIEs are required for theory subjects",
// //       }
// //     }

// //     // Check for date conflicts
// //     const dates = formData.cies.map((cie) => cie.date).filter(Boolean)
// //     const uniqueDates = new Set(dates)
// //     if (dates.length !== uniqueDates.size) {
// //       return {
// //         success: false,
// //         error: "CIE dates must be unique",
// //       }
// //     }

// //     // Validate date gaps
// //     const sortedDates = dates.sort()
// //     for (let i = 1; i < sortedDates.length; i++) {
// //       const prevDate = new Date(sortedDates[i - 1])
// //       const currDate = new Date(sortedDates[i])
// //       const daysDiff = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

// //       if (daysDiff < 7) {
// //         return {
// //           success: false,
// //           error: "CIE dates must be at least 7 days apart",
// //         }
// //       }
// //       if (daysDiff > 30) {
// //         return {
// //           success: false,
// //           error: "CIE dates must not exceed 30 days gap",
// //         }
// //       }
// //     }

// //     // Check required CIE types
// //     const cieTypes = formData.cies.map((cie) => cie.type)
// //     const requiredTypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
// //     const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))

// //     if (missingTypes.length > 0) {
// //       return {
// //         success: false,
// //         error: `Missing required CIE types: ${missingTypes.join(", ")}`,
// //       }
// //     }

// //     // Validate traditional pedagogy usage
// //     const traditionalPedagogies = [
// //       "Objective-Based Assessment (Quiz/MCQ)",
// //       "Short/Descriptive Evaluation",
// //       "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
// //       "Assignment-Based Evaluation (Homework/Take-home assignments)",
// //     ]

// //     const usedTraditional = formData.cies
// //       .map((cie) => cie.evaluation_pedagogy)
// //       .filter((pedagogy) => traditionalPedagogies.includes(pedagogy))

// //     const uniqueTraditional = new Set(usedTraditional)
// //     if (usedTraditional.length !== uniqueTraditional.size) {
// //       return {
// //         success: false,
// //         error: "Each traditional pedagogy method must be used only once across CIEs",
// //       }
// //     }

// //     // Check for at least one alternative pedagogy
// //     const hasAlternative = formData.cies.some((cie) => !traditionalPedagogies.includes(cie.evaluation_pedagogy))

// //     if (!hasAlternative) {
// //       return {
// //         success: false,
// //         error: "At least one alternative pedagogy is required",
// //       }
// //     }

// //     // Save to database (forms table with JSONB)
// //     const { data: existingForm, error: fetchError } = await supabase
// //       .from("forms")
// //       .select("*")
// //       .eq("faculty_id", formData.faculty_id)
// //       .eq("subject_id", formData.subject_id)
// //       .single()

// //     if (fetchError && fetchError.code !== "PGRST116") {
// //       return {
// //         success: false,
// //         error: "Error fetching existing form",
// //       }
// //     }

// //     const formDataToSave = {
// //       faculty_id: formData.faculty_id,
// //       subject_id: formData.subject_id,
// //       form: {
// //         ...existingForm?.form,
// //         cie_planning: {
// //           cies: formData.cies,
// //           remarks: formData.remarks,
// //         },
// //       },
// //     }

// //     let result
// //     if (existingForm) {
// //       // Update existing form
// //       result = await supabase
// //         .from("forms")
// //         .update(formDataToSave)
// //         .eq("faculty_id", formData.faculty_id)
// //         .eq("subject_id", formData.subject_id)
// //     } else {
// //       // Insert new form
// //       result = await supabase.from("forms").insert(formDataToSave)
// //     }

// //     if (result.error) {
// //       console.error("Error saving CIE planning:", result.error)
// //       return {
// //         success: false,
// //         error: "Failed to save CIE planning data",
// //       }
// //     }

// //     revalidatePath("/dashboard/lesson-plans")

// //     return {
// //       success: true,
// //       message: "CIE planning saved successfully",
// //     }
// //   } catch (error) {
// //     console.error("Error in saveCIEPlanningForm:", error)
// //     return {
// //       success: false,
// //       error: "An unexpected error occurred",
// //     }
// //   }
// // }

// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"

// export interface CIEData {
//   id: string
//   type: string
//   units_covered?: string[]
//   practicals_covered?: string[]
//   date: string
//   marks: number
//   duration: number
//   blooms_taxonomy: string[]
//   evaluation_pedagogy: string
//   other_pedagogy?: string
//   co_mapping: string[]
//   pso_mapping?: string[]
//   peo_mapping?: string[]
//   skill_mapping: Array<{
//     skill: string
//     details: string
//   }>
// }

// export interface CIEPlanningFormData {
//   faculty_id: string
//   subject_id: string
//   cies: CIEData[]
//   remarks?: string
// }

// // Helper function to parse DD-MM-YYYY format consistently
// const parseDDMMYYYY = (dateStr: string): Date | null => {
//   if (!dateStr) return null

//   // Handle DD-MM-YYYY format
//   if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
//     const [day, month, year] = dateStr.split("-").map(Number)
//     return new Date(year, month - 1, day)
//   }

//   // Handle DD/MM/YYYY format
//   if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
//     const [day, month, year] = dateStr.split("/").map(Number)
//     return new Date(year, month - 1, day)
//   }

//   // Handle YYYY-MM-DD format (convert to DD-MM-YYYY logic)
//   if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
//     const [year, month, day] = dateStr.split("-").map(Number)
//     return new Date(year, month - 1, day)
//   }

//   // Handle ISO format with time
//   if (dateStr.includes("T")) {
//     return new Date(dateStr)
//   }

//   try {
//     return new Date(dateStr)
//   } catch (e) {
//     return null
//   }
// }

// // Helper function to format date as DD-MM-YYYY
// const formatToDDMMYYYY = (date: Date): string => {
//   const day = date.getDate().toString().padStart(2, "0")
//   const month = (date.getMonth() + 1).toString().padStart(2, "0")
//   const year = date.getFullYear()
//   return `${day}-${month}-${year}`
// }

// // Helper function to calculate days difference
// const getDaysDifference = (date1: Date, date2: Date): number => {
//   const timeDiff = Math.abs(date2.getTime() - date1.getTime())
//   return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
// }

// export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
//   try {
//     const supabase = await createClient()

//     // Validate minimum requirements
//     if (formData.cies.length < 3) {
//       return {
//         success: false,
//         error: "Minimum 3 CIEs are required for theory subjects",
//       }
//     }

//     // Get term dates from lesson plan
//     const { data: lessonPlanData, error: lpError } = await supabase
//       .from("forms")
//       .select("form")
//       .eq("faculty_id", formData.faculty_id)
//       .eq("subject_id", formData.subject_id)
//       .single()

//     let termStartDate: Date | null = null
//     let termEndDate: Date | null = null

//     if (!lpError && lessonPlanData?.form?.general_details) {
//       const generalDetails = lessonPlanData.form.general_details
//       termStartDate = parseDDMMYYYY(generalDetails.term_start_date)
//       termEndDate = parseDDMMYYYY(generalDetails.term_end_date)
//     }

//     // Parse and validate CIE dates
//     const cieWithParsedDates = formData.cies
//       .map((cie) => ({
//         ...cie,
//         parsedDate: parseDDMMYYYY(cie.date),
//       }))
//       .filter((cie) => cie.parsedDate !== null)

//     // Check for date conflicts (unique dates)
//     const dates = cieWithParsedDates.map((cie) => cie.date)
//     const uniqueDates = new Set(dates)
//     if (dates.length !== uniqueDates.size) {
//       return {
//         success: false,
//         error: "CIE dates must be unique",
//       }
//     }

//     // Validate date gaps (minimum 7 days apart)
//     const sortedCIEs = [...cieWithParsedDates].sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())

//     for (let i = 1; i < sortedCIEs.length; i++) {
//       const prevDate = sortedCIEs[i - 1].parsedDate!
//       const currDate = sortedCIEs[i].parsedDate!
//       const daysDiff = getDaysDifference(prevDate, currDate)

//       if (daysDiff < 7) {
//         return {
//           success: false,
//           error: "CIE dates must be at least 7 days apart",
//         }
//       }
//     }

//     // Validate against term end date
//     if (termEndDate) {
//       for (const cie of cieWithParsedDates) {
//         if (cie.parsedDate! > termEndDate) {
//           const cieFormattedDate = formatToDDMMYYYY(cie.parsedDate!)
//           const termEndFormattedDate = formatToDDMMYYYY(termEndDate)
//           return {
//             success: false,
//             error: `CIE date (${cieFormattedDate}) cannot exceed the Course Term End Date (${termEndFormattedDate})`,
//           }
//         }
//       }
//     }

//     // Validate Course Prerequisites CIE date (within 10 days of term start)
//     const prereqCIE = formData.cies.find((cie) => cie.type === "Course Prerequisites CIE")
//     if (prereqCIE && termStartDate) {
//       const prereqDate = parseDDMMYYYY(prereqCIE.date)
//       if (prereqDate) {
//         const daysDiff = getDaysDifference(termStartDate, prereqDate)
//         if (daysDiff > 10) {
//           const termStartFormatted = formatToDDMMYYYY(termStartDate)
//           return {
//             success: false,
//             error: `Course Prerequisites CIE must be conducted within 10 days of term start date (${termStartFormatted})`,
//           }
//         }
//       }
//     }

//     // Check required CIE types
//     const cieTypes = formData.cies.map((cie) => cie.type)
//     const requiredTypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
//     const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))

//     if (missingTypes.length > 0) {
//       return {
//         success: false,
//         error: `Missing required CIE types: ${missingTypes.join(", ")}`,
//       }
//     }

//     // Validate traditional pedagogy usage
//     const traditionalPedagogies = [
//       "Objective-Based Assessment (Quiz/MCQ)",
//       "Short/Descriptive Evaluation",
//       "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
//       "Assignment-Based Evaluation (Homework/Take-home assignments)",
//     ]

//     const usedTraditional = formData.cies
//       .map((cie) => cie.evaluation_pedagogy)
//       .filter((pedagogy) => traditionalPedagogies.includes(pedagogy))

//     const uniqueTraditional = new Set(usedTraditional)
//     if (usedTraditional.length !== uniqueTraditional.size) {
//       return {
//         success: false,
//         error: "Each traditional pedagogy method must be used only once across CIEs",
//       }
//     }

//     // Check for at least one alternative pedagogy
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

//     const hasAlternative = formData.cies.some((cie) => alternativePedagogies.includes(cie.evaluation_pedagogy))

//     if (!hasAlternative) {
//       return {
//         success: false,
//         error: "At least one alternative pedagogy is required",
//       }
//     }

//     // Save to database (forms table with JSONB)
//     const { data: existingForm, error: fetchError } = await supabase
//       .from("forms")
//       .select("*")
//       .eq("faculty_id", formData.faculty_id)
//       .eq("subject_id", formData.subject_id)
//       .single()

//     if (fetchError && fetchError.code !== "PGRST116") {
//       return {
//         success: false,
//         error: "Error fetching existing form",
//       }
//     }

//     // Ensure all dates are in DD-MM-YYYY format before saving
//     const normalizedCIEs = formData.cies.map((cie) => ({
//       ...cie,
//       date: cie.parsedDate ? formatToDDMMYYYY(cie.parsedDate) : cie.date,
//     }))

//     const formDataToSave = {
//       faculty_id: formData.faculty_id,
//       subject_id: formData.subject_id,
//       form: {
//         ...existingForm?.form,
//         cie_planning: {
//           cies: normalizedCIEs,
//           remarks: formData.remarks,
//         },
//       },
//     }

//     let result
//     if (existingForm) {
//       result = await supabase
//         .from("forms")
//         .update(formDataToSave)
//         .eq("faculty_id", formData.faculty_id)
//         .eq("subject_id", formData.subject_id)
//     } else {
//       result = await supabase.from("forms").insert(formDataToSave)
//     }

//     if (result.error) {
//       console.error("Error saving CIE planning:", result.error)
//       return {
//         success: false,
//         error: "Failed to save CIE planning data",
//       }
//     }

//     revalidatePath("/dashboard/lesson-plans")

//     return {
//       success: true,
//       message: "CIE planning saved successfully",
//     }
//   } catch (error) {


//     console.error("Error in saveCIEPlanningForm:", error)
//     return {
//       success: false,
//       error: "An unexpected error occurred",
//     }
//   }
// }



"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface CIEData {
  id: string
  type: string
  units_covered?: string[]
  practicals_covered?: string[]
  date: string
  marks: number
  duration: number
  blooms_taxonomy: string[]
  evaluation_pedagogy: string
  other_pedagogy?: string
  co_mapping: string[]
  pso_mapping?: string[]
  peo_mapping?: string[]
  skill_mapping: Array<{
    skill: string
    details: string
  }>
}

export interface CIEPlanningFormData {
  faculty_id: string
  subject_id: string
  cies: CIEData[]
  remarks?: string
}

// Helper function to parse DD-MM-YYYY format consistently
const parseDDMMYYYY = (dateStr: string): Date | null => {
  if (!dateStr) return null

  // Handle DD-MM-YYYY format
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [day, month, year] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Handle DD/MM/YYYY format
  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  // Handle YYYY-MM-DD format (convert to DD-MM-YYYY logic)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Handle ISO format with time
  if (dateStr.includes("T")) {
    return new Date(dateStr)
  }

  try {
    return new Date(dateStr)
  } catch (e) {
    return null
  }
}

// Helper function to format date as DD-MM-YYYY
const formatToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Helper function to calculate days difference
const getDaysDifference = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
}

export async function saveCIEPlanningForm(formData: CIEPlanningFormData) {
  try {
    const supabase = await createClient()

    // Validate minimum requirements
    if (formData.cies.length < 3) {
      return {
        success: false,
        error: "Minimum 3 CIEs are required for theory subjects",
      }
    }

    // Get term dates from lesson plan
    const { data: lessonPlanData, error: lpError } = await supabase
      .from("forms")
      .select("form")
      .eq("faculty_id", formData.faculty_id)
      .eq("subject_id", formData.subject_id)
      .single()

    let termStartDate: Date | null = null
    let termEndDate: Date | null = null

    if (!lpError && lessonPlanData?.form?.general_details) {
      const generalDetails = lessonPlanData.form.general_details
      termStartDate = parseDDMMYYYY(generalDetails.term_start_date)
      termEndDate = parseDDMMYYYY(generalDetails.term_end_date)
    }

    // Parse and validate CIE dates
    const cieWithParsedDates = formData.cies
      .map((cie) => ({
        ...cie,
        parsedDate: parseDDMMYYYY(cie.date),
      }))
      .filter((cie) => cie.parsedDate !== null)

    // Check for date conflicts (unique dates)
    const dates = cieWithParsedDates.map((cie) => cie.date)
    const uniqueDates = new Set(dates)
    if (dates.length !== uniqueDates.size) {
      return {
        success: false,
        error: "CIE dates must be unique",
      }
    }

    // Validate date gaps (minimum 7 days apart)
    const sortedCIEs = [...cieWithParsedDates].sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())

    for (let i = 1; i < sortedCIEs.length; i++) {
      const prevDate = sortedCIEs[i - 1].parsedDate!
      const currDate = sortedCIEs[i].parsedDate!
      const daysDiff = getDaysDifference(prevDate, currDate)

      if (daysDiff < 7) {
        return {
          success: false,
          error: "CIE dates must be at least 7 days apart",
        }
      }
    }

    // Validate against term end date
    if (termEndDate) {
      for (const cie of cieWithParsedDates) {
        if (cie.parsedDate! > termEndDate) {
          const cieFormattedDate = formatToDDMMYYYY(cie.parsedDate!)
          const termEndFormattedDate = formatToDDMMYYYY(termEndDate)
          return {
            success: false,
            error: `CIE date (${cieFormattedDate}) cannot exceed the Course Term End Date (${termEndFormattedDate})`,
          }
        }
      }
    }

    // Validate Course Prerequisites CIE date (within 10 days of term start)
    const prereqCIE = formData.cies.find((cie) => cie.type === "Course Prerequisites CIE")
    if (prereqCIE && termStartDate) {
      const prereqDate = parseDDMMYYYY(prereqCIE.date)
      if (prereqDate) {
        const daysDiff = getDaysDifference(termStartDate, prereqDate)
        if (daysDiff > 10) {
          const termStartFormatted = formatToDDMMYYYY(termStartDate)
          return {
            success: false,
            error: `Course Prerequisites CIE must be conducted within 10 days of term start date (${termStartFormatted})`,
          }
        }
      }
    }

    // Validate duration constraints
    for (let index = 0; index < formData.cies.length; index++) {
      const cie = formData.cies[index]
      // Minimum 30 minutes for all CIEs
      if (cie.duration < 30) {
        return {
          success: false,
          error: `CIE ${index + 1}: Duration must be at least 30 minutes`,
        }
      }

      // Maximum 50 minutes for Quiz/MCQ
      if (cie.evaluation_pedagogy === "Objective-Based Assessment (Quiz/MCQ)" && cie.duration > 50) {
        return {
          success: false,
          error: `CIE ${index + 1}: Quiz/MCQ duration cannot exceed 50 minutes`,
        }
      }
    }

    // Check required CIE types
    const cieTypes = formData.cies.map((cie) => cie.type)
    const requiredTypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
    const missingTypes = requiredTypes.filter((type) => !cieTypes.includes(type))

    if (missingTypes.length > 0) {
      return {
        success: false,
        error: `Missing required CIE types: ${missingTypes.join(", ")}`,
      }
    }

    // Validate traditional pedagogy usage
    const traditionalPedagogies = [
      "Objective-Based Assessment (Quiz/MCQ)",
      "Short/Descriptive Evaluation",
      "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
      "Assignment-Based Evaluation (Homework/Take-home assignments)",
    ]

    const usedTraditional = formData.cies
      .map((cie) => cie.evaluation_pedagogy)
      .filter((pedagogy) => traditionalPedagogies.includes(pedagogy))

    const uniqueTraditional = new Set(usedTraditional)
    if (usedTraditional.length !== uniqueTraditional.size) {
      return {
        success: false,
        error: "Each traditional pedagogy method must be used only once across CIEs",
      }
    }

    // Check for at least one alternative pedagogy
    const alternativePedagogies = [
      "Problem-Based Evaluation",
      "Open Book Assessment",
      "Peer Assessment",
      "Case Study-Based Evaluation",
      "Concept Mapping Evaluation",
      "Analytical Reasoning Test",
      "Critical Thinking Assessment",
      "Project-Based Assessment",
      "Group/Team Assessment",
      "Certification-Based Evaluation",
    ]

    const hasAlternative = formData.cies.some((cie) => alternativePedagogies.includes(cie.evaluation_pedagogy))

    if (!hasAlternative) {
      return {
        success: false,
        error: "At least one alternative pedagogy is required",
      }
    }

    // Save to database (forms table with JSONB)
    const { data: existingForm, error: fetchError } = await supabase
      .from("forms")
      .select("*")
      .eq("faculty_id", formData.faculty_id)
      .eq("subject_id", formData.subject_id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      return {
        success: false,
        error: "Error fetching existing form",
      }
    }

    // Ensure all dates are in DD-MM-YYYY format before saving
    const normalizedCIEs = formData.cies.map((cie) => ({
      ...cie,
      date: cie.parsedDate ? formatToDDMMYYYY(cie.parsedDate) : cie.date,
    }))

    const formDataToSave = {
      faculty_id: formData.faculty_id,
      subject_id: formData.subject_id,
      form: {
        ...existingForm?.form,
        cie_planning: {
          cies: normalizedCIEs,
          remarks: formData.remarks,
        },
      },
    }

    let result
    if (existingForm) {
      result = await supabase
        .from("forms")
        .update(formDataToSave)
        .eq("faculty_id", formData.faculty_id)
        .eq("subject_id", formData.subject_id)
    } else {
      result = await supabase.from("forms").insert(formDataToSave)
    }

    if (result.error) {
      console.error("Error saving CIE planning:", result.error)
      return {
        success: false,
        error: "Failed to save CIE planning data",
      }
    }

    revalidatePath("/dashboard/lesson-plans")

    return {
      success: true,
      message: "CIE planning saved successfully",
    }
  } catch (error) {
    console.error("Error in saveCIEPlanningForm:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
