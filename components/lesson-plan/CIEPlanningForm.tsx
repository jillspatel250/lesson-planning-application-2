//@ts-nocheck

// "use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, AlertTriangle, Info } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { supabase } from "@/utils/supabase/client"
import { saveCIEPlanningForm } from "@/app/dashboard/actions/saveCIEPlanningForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { saveFormDraft, loadFormDraft, deleteFormDraft } from "@/app/dashboard/actions/saveFormDraft"

interface PSOPEOItem {
  id: string
  label?: string
  description: string
}

interface CIEPlanningFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
  userData: any
}

// Date utility functions specifically for this component
const convertYYYYMMDDToDDMMYYYY = (dateStr: string): string => {
  if (!dateStr) return ""

  // If already in DD-MM-YYYY format
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    return dateStr
  }

  // If in YYYY-MM-DD format, convert to DD-MM-YYYY
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split("-")
    return `${day}-${month}-${year}`
  }

  return dateStr
}

const convertDDMMYYYYToYYYYMMDD = (dateStr: string): string => {
  if (!dateStr) return ""

  // If already in YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr
  }

  // If in DD-MM-YYYY format, convert to YYYY-MM-DD
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [day, month, year] = dateStr.split("-")
    return `${year}-${month}-${day}`
  }

  return dateStr
}

const parseDateToDDMMYYYY = (dateStr: string): Date | null => {
  if (!dateStr) return null

  const standardDate = convertYYYYMMDDToDDMMYYYY(dateStr)
  if (!standardDate.match(/^\d{2}-\d{2}-\d{4}$/)) return null

  const [day, month, year] = standardDate.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const getDaysDifferenceBetweenDates = (date1: string, date2: string): number => {
  const d1 = parseDateToDDMMYYYY(date1)
  const d2 = parseDateToDDMMYYYY(date2)

  if (!d1 || !d2) return 0

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// CIE Type Options
const cieTypeOptions = [
  "Lecture CIE",
  "Course Prerequisites CIE",
  "Mid-term/Internal Exam",
  "Practical CIE",
  "Internal Practical",
]

// Evaluation Pedagogy Options
const evaluationPedagogyOptions = {
  traditional: [
    "Objective-Based Assessment (Quiz/MCQ)",
    "Short/Descriptive Evaluation",
    "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
    "Assignment-Based Evaluation (Homework/Take-home assignments)",
  ],
  alternative: [
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
  ],
  other: ["Other"],
}

// Bloom's Taxonomy Options
const bloomsTaxonomyOptions = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]

// Skill Mapping Options
const skillMappingOptions = [
  "Technical Skills",
  "Cognitive Skills",
  "Professional Skills",
  "Research and Innovation Skills",
  "Entrepreneurial or Managerial Skills",
  "Communication Skills",
  "Leadership and Teamwork Skills",
  "Creativity and Design Thinking Skills",
  "Ethical, Social, and Environmental Awareness Skills",
]

export default function CIEPlanningForm({ lessonPlan, setLessonPlan, userData }: CIEPlanningFormProps) {
  const [activeCIE, setActiveCIE] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [departmentPsoPeo, setDepartmentPsoPeo] = useState<{
    pso_data: PSOPEOItem[]
    peo_data: PSOPEOItem[]
  }>({
    pso_data: [],
    peo_data: [],
  })
  const [loadingPsoPeo, setLoadingPsoPeo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [currentWarning, setCurrentWarning] = useState("")
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Field-specific error states
  const [typeError, setTypeError] = useState("")
  const [unitsCoveredError, setUnitsCoveredError] = useState("")
  const [dateError, setDateError] = useState("")
  const [marksError, setMarksError] = useState("")
  const [durationError, setDurationError] = useState("")
  const [bloomsError, setBloomsError] = useState("")
  const [pedagogyError, setPedagogyError] = useState("")
  const [coMappingError, setCoMappingError] = useState("")
  const [skillMappingError, setSkillMappingError] = useState("")

  // Initialize CIEs if empty
  useEffect(() => {
    if (!lessonPlan.cies || lessonPlan.cies.length === 0) {
      const initialCIE = {
        id: "cie1",
        type: "",
        units_covered: [],
        practicals_covered: [],
        date: "",
        marks: 50,
        duration: 50,
        blooms_taxonomy: [],
        evaluation_pedagogy: "",
        other_pedagogy: "",
        co_mapping: [],
        pso_mapping: [],
        peo_mapping: [],
        skill_mapping: [{ skill: "", details: "" }],
      }

      setLessonPlan((prev: any) => ({
        ...prev,
        cies: [initialCIE],
      }))
    }
  }, [lessonPlan?.cies, setLessonPlan])

  // Load PSO/PEO data
  useEffect(() => {
    const loadPsoPeoData = async () => {
      if (lessonPlan.subject?.id) {
        setLoadingPsoPeo(true)
        try {
          const { data: subjectData, error: subjectError } = await supabase
            .from("subjects")
            .select("pso, peo, department_id")
            .eq("id", lessonPlan.subject.id)
            .single()

          if (subjectError) {
            console.error("Error fetching subject PSO/PEO data:", subjectError)
            return
          }

          let psoData: PSOPEOItem[] = []
          let peoData: PSOPEOItem[] = []

          if (subjectData?.pso?.items && subjectData.pso.items.length > 0) {
            psoData = subjectData.pso.items
          }
          if (subjectData?.peo?.items && subjectData.peo.items.length > 0) {
            peoData = subjectData.peo.items
          }

          if (psoData.length === 0 || peoData.length === 0) {
            const { data: departmentSubjects, error: deptError } = await supabase
              .from("subjects")
              .select("pso, peo")
              .eq("department_id", subjectData.department_id)
              .not("pso", "is", null)
              .not("peo", "is", null)
              .limit(1)

            if (!deptError && departmentSubjects && departmentSubjects.length > 0) {
              const deptSubject = departmentSubjects[0]
              if (psoData.length === 0 && deptSubject.pso?.items) {
                psoData = deptSubject.pso.items
              }
              if (peoData.length === 0 && deptSubject.peo?.items) {
                peoData = deptSubject.peo.items
              }
            }
          }

          setDepartmentPsoPeo({
            pso_data: psoData,
            peo_data: peoData,
          })
        } catch (error) {
          console.error("Error loading PSO/PEO data:", error)
          setDepartmentPsoPeo({
            pso_data: [],
            peo_data: [],
          })
        } finally {
          setLoadingPsoPeo(false)
        }
      }
    }

    loadPsoPeoData()
  }, [lessonPlan.subject?.id])

  useEffect(() => {
    const loadDraft = async () => {
      if (!userData?.id || !lessonPlan?.subject?.id) return

      try {
        console.log("Loading CIE draft for:", lessonPlan?.faculty?.id || userData.id, lessonPlan.subject.id)

        const result = await loadFormDraft(
          lessonPlan?.faculty?.id || userData.id,
          lessonPlan.subject.id,
          "cie_planning",
        )

        if (result.success && result.data) {
          const data = result.data
          console.log("Loaded CIE draft data:", data)

          // Check if we have valid CIE data
          if (data.cies && Array.isArray(data.cies) && data.cies.length > 0) {
            // Ensure each CIE has proper structure
            const validCIEs = data.cies.map((cie: any, index: number) => ({
              id: cie.id || `cie${index + 1}`,
              type: cie.type || "",
              units_covered: Array.isArray(cie.units_covered) ? cie.units_covered : [],
              practicals_covered: Array.isArray(cie.practicals_covered) ? cie.practicals_covered : [],
              date: cie.date || "",
              marks: typeof cie.marks === "number" ? cie.marks : 50,
              duration: typeof cie.duration === "number" ? cie.duration : 50,
              blooms_taxonomy: Array.isArray(cie.blooms_taxonomy) ? cie.blooms_taxonomy : [],
              evaluation_pedagogy: cie.evaluation_pedagogy || "",
              other_pedagogy: cie.other_pedagogy || "",
              co_mapping: Array.isArray(cie.co_mapping) ? cie.co_mapping : [],
              pso_mapping: Array.isArray(cie.pso_mapping) ? cie.pso_mapping : [],
              peo_mapping: Array.isArray(cie.peo_mapping) ? cie.peo_mapping : [],
              skill_mapping:
                Array.isArray(cie.skill_mapping) && cie.skill_mapping.length > 0
                  ? cie.skill_mapping
                  : [{ skill: "", details: "" }],
            }))

            console.log("Setting CIEs to lesson plan:", validCIEs)

            setLessonPlan((prev: any) => ({
              ...prev,
              cies: validCIEs,
              cie_remarks: data.remarks || "",
            }))

            toast.success(`Draft loaded successfully with ${validCIEs.length} CIE(s)`)
          } else {
            console.log("No valid CIE data found in draft")
          }
        } else {
          console.log("No CIE draft found or failed to load")
        }
      } catch (error) {
        console.error("Error loading CIE draft:", error)
      }
    }

    // Load draft when component mounts and we have the required data
    // Also check if current CIEs are empty/default
    const currentCIEs = lessonPlan?.cies || []
    const shouldLoadDraft =
      currentCIEs.length === 0 ||
      (currentCIEs.length === 1 &&
        (!currentCIEs[0].type || currentCIEs[0].type === "") &&
        (!currentCIEs[0].date || currentCIEs[0].date === ""))

    if (shouldLoadDraft && userData?.id && lessonPlan?.subject?.id) {
      loadDraft()
    }
  }, [userData?.id, lessonPlan?.subject?.id, lessonPlan?.faculty?.id])

  const handleCIEChange = (index: number, field: string, value: any) => {
    const updatedCIEs = [...(lessonPlan.cies || [])]

    // Handle date conversion from HTML5 input (YYYY-MM-DD) to our format (DD-MM-YYYY)
    if (field === "date" && value) {
      value = convertYYYYMMDDToDDMMYYYY(value)
    }

    updatedCIEs[index] = {
      ...updatedCIEs[index],
      [field]: value,
    }

    // Auto-calculate duration based on marks and bloom's taxonomy - MORE RESPONSIVE
    if (field === "marks" || field === "blooms_taxonomy") {
      const marks = field === "marks" ? value : updatedCIEs[index].marks
      const blooms = field === "blooms_taxonomy" ? value : updatedCIEs[index].blooms_taxonomy

      const calculatedDuration = calculateMinimumDuration(marks, blooms)
      // Always update duration when marks or blooms change
      updatedCIEs[index].duration = Math.max(calculatedDuration, 30) // Ensure minimum 30 minutes

      // Clear duration error when auto-calculating
      setDurationError("")
    }

    // Real-time duration validation when manually changed
    if (field === "duration") {
      const marks = updatedCIEs[index].marks || 0
      const blooms = updatedCIEs[index].blooms_taxonomy || []
      const minDuration = Math.max(calculateMinimumDuration(marks, blooms), 30)
      const pedagogy = updatedCIEs[index].evaluation_pedagogy

      if (value < 30) {
        setDurationError("Duration must be at least 30 minutes")
      } else if (value < minDuration) {
        setDurationError(`Duration should be at least ${minDuration} minutes based on marks and Bloom's taxonomy`)
      } else if (pedagogy === "Objective-Based Assessment (Quiz/MCQ)" && value > 50) {
        setDurationError("Quiz/MCQ duration cannot exceed 50 minutes")
      } else {
        setDurationError("")
      }
    }

    // Clear units/practicals based on CIE type
    if (field === "type") {
      if (value === "Course Prerequisites CIE") {
        updatedCIEs[index].units_covered = []
        updatedCIEs[index].practicals_covered = []
      } else if (value === "Practical CIE" || value === "Internal Practical") {
        updatedCIEs[index].units_covered = []
      } else {
        updatedCIEs[index].practicals_covered = []
      }
    }

    // VALIDATION 4: Check for Bloom's taxonomy warnings when selecting bloom's levels (THEORY CIEs ONLY)
    if (field === "blooms_taxonomy" && value.length > 0) {
      const theoryCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
      if (theoryCIETypes.includes(updatedCIEs[index].type)) {
        const hasRememberOrUnderstand = value.some((level: string) => ["Remember", "Understand"].includes(level))
        const currentUnits = updatedCIEs[index].units_covered || []

        if (hasRememberOrUnderstand && currentUnits.length > 0) {
          const units = lessonPlan.units || []
          const selectedUnits = currentUnits.map((unitId: string) => {
            const unitIndex = units.findIndex((u: any) => u.id === unitId)
            return { id: unitId, index: unitIndex }
          })

          // Check if any selected unit is not first or last
          const hasMiddleChapter = selectedUnits.some((unit: any) => {
            const unitIndex = unit.index
            const totalUnits = units.length
            return unitIndex > 0 && unitIndex < totalUnits - 1 // Not first or last unit
          })

          if (hasMiddleChapter) {
            const warning = "You should avoid Remember & Understand bloom's taxonomy except first and last chapter."
            setCurrentWarning(warning)
            setWarningDialogOpen(true)
          }
        }
      }
    }

    // VALIDATION 4: Check for Bloom's taxonomy warnings when selecting units (THEORY CIEs ONLY)
    if (field === "units_covered" && value.length > 0) {
      const theoryCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
      if (theoryCIETypes.includes(updatedCIEs[index].type)) {
        const currentBlooms = updatedCIEs[index].blooms_taxonomy || []
        const hasRememberOrUnderstand = currentBlooms.some((level: string) =>
          ["Remember", "Understand"].includes(level),
        )

        if (hasRememberOrUnderstand) {
          const units = lessonPlan.units || []
          const selectedUnits = value.map((unitId: string) => {
            const unitIndex = units.findIndex((u: any) => u.id === unitId)
            return { id: unitId, index: unitIndex }
          })

          // Check if any selected unit is not first or last
          const hasMiddleChapter = selectedUnits.some((unit: any) => {
            const unitIndex = unit.index
            const totalUnits = units.length
            return unitIndex > 0 && unitIndex < totalUnits - 1 // Not first or last unit
          })

          if (hasMiddleChapter) {
            const warning = "You should avoid Remember & Understand bloom's taxonomy except first and last chapter."
            setCurrentWarning(warning)
            setWarningDialogOpen(true)
          }
        }
      }
    }

    // VALIDATION 5: Check for Bloom's taxonomy restrictions when selecting Open Book Assessment
    if (field === "evaluation_pedagogy" && value === "Open Book Assessment") {
      const currentBlooms = updatedCIEs[index].blooms_taxonomy || []
      const allowedBlooms = ["Analyze", "Evaluate", "Create"]
      const filteredBlooms = currentBlooms.filter((bloom: string) => allowedBlooms.includes(bloom))

      if (filteredBlooms.length !== currentBlooms.length) {
        updatedCIEs[index].blooms_taxonomy = filteredBlooms
        toast.warning(
          "For Open Book Assessment, only Analyze, Evaluate, and Create levels are allowed. Other levels have been removed.",
        )
      }
    }

    // Real-time validation for evaluation pedagogy and duration
    if (field === "evaluation_pedagogy") {
      const currentDuration = updatedCIEs[index].duration
      if (value === "Objective-Based Assessment (Quiz/MCQ)" && currentDuration > 50) {
        updatedCIEs[index].duration = 50
        toast.info("Duration automatically adjusted to 50 minutes for Quiz/MCQ")
      }
    }

    setLessonPlan((prev: any) => ({
      ...prev,
      cies: updatedCIEs,
    }))

    validateCIE(updatedCIEs[index], index)
  }

  const calculateMinimumDuration = (marks: number, bloomsLevels: string[]): number => {
    if (!marks || !bloomsLevels || bloomsLevels.length === 0) return 30

    const hasHigherOrder = bloomsLevels.some((level) => ["Analyze", "Evaluate", "Create"].includes(level))
    const hasOnlyLowerOrder = bloomsLevels.every((level) => ["Remember", "Understand"].includes(level))

    let duration = 0

    if (hasOnlyLowerOrder) {
      duration = marks * 2 // 1 mark = 2 minutes for lower order
    } else if (hasHigherOrder) {
      duration = marks * 3 // 1 mark = 3 minutes for higher order
    } else {
      duration = marks * 2.5 // Mixed levels
    }

    // Ensure minimum 30 minutes
    return Math.max(duration, 30)
  }

  const validateCIE = (cie: any, index: number) => {
    const errors: string[] = []
    const warnings: string[] = []

    // VALIDATION 3: Validate Bloom's taxonomy based on semester
    const semester = lessonPlan.subject?.semester || 1
    if (semester > 2 && cie.blooms_taxonomy?.includes("Remember")) {
      errors.push(`CIE ${index + 1}: 'Remember' level not allowed for semester ${semester}`)
    }

    // Validate duration for practical CIEs
    if ((cie.type === "Practical CIE" || cie.type === "Internal Practical") && cie.duration < 120) {
      errors.push(`CIE ${index + 1}: Practical CIE must be minimum 2 hours (120 minutes)`)
    }

    // Validate Mid-term duration
    if (cie.type === "Mid-term/Internal Exam" && cie.duration <= 60) {
      errors.push(`CIE ${index + 1}: Warning - Mid-term exam duration should be more than 60 minutes`)
    }

    // VALIDATION 5: Validate Open Book Assessment
    if (cie.evaluation_pedagogy === "Open Book Assessment") {
      const allowedBlooms = ["Analyze", "Evaluate", "Create"]
      const hasInvalidBlooms = cie.blooms_taxonomy?.some((bloom: string) => !allowedBlooms.includes(bloom))
      if (hasInvalidBlooms) {
        errors.push(`CIE ${index + 1}: Open Book Assessment only allows Analyze, Evaluate, and Create levels`)
      }
    }

    setValidationErrors(errors)
    setValidationWarnings(warnings)
  }

  const validateAllCIEs = () => {
    const errors: string[] = []
    const warnings: string[] = []
    const currentCIEs = lessonPlan.cies || []

    // Helper function to format date for display
    const formatForDisplay = (dateStr: string): string => {
      return convertYYYYMMDDToDDMMYYYY(dateStr)
    }

    // VALIDATION 1: Date gap validation (must not exceed Course Term End Date)
    const sortedCIEs = [...currentCIEs]
      .filter((cie) => cie.date)
      .sort((a, b) => {
        const dateA = parseDateToDDMMYYYY(a.date)
        const dateB = parseDateToDDMMYYYY(b.date)
        if (!dateA || !dateB) return 0
        return dateA.getTime() - dateB.getTime()
      })

    if (lessonPlan.term_end_date) {
      const termEndDateStr = convertYYYYMMDDToDDMMYYYY(lessonPlan.term_end_date)
      const termEndDate = parseDateToDDMMYYYY(termEndDateStr)

      if (termEndDate) {
        sortedCIEs.forEach((cie, index) => {
          const cieDateStr = convertYYYYMMDDToDDMMYYYY(cie.date)
          const cieDate = parseDateToDDMMYYYY(cieDateStr)

          if (cieDate && cieDate > termEndDate) {
            errors.push(
              `CIE ${index + 1} date (${formatForDisplay(cie.date)}) cannot exceed the Course Term End Date (${formatForDisplay(lessonPlan.term_end_date)})`,
            )
          }
        })
      }
    }

    // Minimum 7 days gap between consecutive CIEs
    for (let i = 1; i < sortedCIEs.length; i++) {
      const prevDateStr = convertYYYYMMDDToDDMMYYYY(sortedCIEs[i - 1].date)
      const currDateStr = convertYYYYMMDDToDDMMYYYY(sortedCIEs[i].date)

      const daysDiff = getDaysDifferenceBetweenDates(prevDateStr, currDateStr)
      if (daysDiff < 7) {
        errors.push(`CIE dates must be at least 7 days apart`)
      }
    }

    // VALIDATION 2: Check that at least one of each CIE type is present
    const cieTypes = currentCIEs.map((cie: any) => cie.type).filter(Boolean)
    const allRequiredTypes = [
      "Lecture CIE",
      "Course Prerequisites CIE",
      "Mid-term/Internal Exam",
      "Practical CIE",
      "Internal Practical",
    ]

    let hasAtLeastOne = false
    allRequiredTypes.forEach((type) => {
      if (cieTypes.includes(type)) {
        hasAtLeastOne = true
      }
    })

    if (!hasAtLeastOne) {
      errors.push("At least one CIE from the available types must be present")
    }

    // VALIDATION 6: Total duration validation (n credit = n - 1 hours) - ONLY FOR THEORY CIEs
    const totalCredits = lessonPlan.subject?.credits || 0
    const requiredMinimumHours = Math.max(0, totalCredits - 1) // n - 1 hours

    const theoryCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
    const theoryCIEs = currentCIEs.filter((cie: any) => theoryCIETypes.includes(cie.type))
    const totalTheoryDurationHours = theoryCIEs.reduce((sum, cie) => sum + (cie.duration || 0), 0) / 60

    if (totalTheoryDurationHours < requiredMinimumHours) {
      errors.push(
        `Total Theory CIE duration must be at least ${requiredMinimumHours} hours (currently ${totalTheoryDurationHours.toFixed(
          1,
        )} hours). Practical CIEs are not counted in this validation.`,
      )
    }

    // VALIDATION 7: Pedagogy usage validation
    const traditionalPedagogies = evaluationPedagogyOptions.traditional
    const alternativePedagogies = evaluationPedagogyOptions.alternative

    const allPedagogies = currentCIEs.map((cie: any) => cie.evaluation_pedagogy).filter(Boolean)
    const usedTraditional = allPedagogies.filter((pedagogy: string) => traditionalPedagogies.includes(pedagogy))
    const usedAlternative = allPedagogies.filter((pedagogy: string) => alternativePedagogies.includes(pedagogy))

    // At least one traditional pedagogy is required
    if (usedTraditional.length === 0) {
      errors.push("At least one traditional pedagogy method must be used")
    }

    // Traditional pedagogy should be unique across all CIEs
    const uniqueTraditional = new Set(usedTraditional)
    if (usedTraditional.length !== uniqueTraditional.size) {
      errors.push("Each traditional pedagogy method must be used only once across all CIEs")
    }

    // VALIDATION 8: At least one alternative pedagogy is required
    if (usedAlternative.length === 0) {
      errors.push("At least one alternative pedagogy is required")
    }

    // Validate Course Prerequisites CIE date (must be within 10 days of term start)
    const prereqCIE = currentCIEs.find((cie: any) => cie.type === "Course Prerequisites CIE")
    if (prereqCIE && prereqCIE.date && lessonPlan.term_start_date) {
      const termStartStr = convertYYYYMMDDToDDMMYYYY(lessonPlan.term_start_date)
      const prereqDateStr = convertYYYYMMDDToDDMMYYYY(prereqCIE.date)

      const daysDiff = getDaysDifferenceBetweenDates(termStartStr, prereqDateStr)

      if (daysDiff > 10) {
        errors.push(
          `Course Prerequisites CIE must be conducted within 10 days of term start date (${formatForDisplay(lessonPlan.term_start_date)})`,
        )
      }
    }

    // VALIDATION 9: CO coverage across Lecture CIEs + Course Prerequisites CIEs + Mid-term/Internal Exams
    const relevantCIETypes = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
    const relevantCIEs = currentCIEs.filter((cie: any) => relevantCIETypes.includes(cie.type))

    if (relevantCIEs.length > 0) {
      const allCOMappings = new Set()

      relevantCIEs.forEach((cie: any) => {
        if (cie.co_mapping && Array.isArray(cie.co_mapping)) {
          cie.co_mapping.forEach((coId: string) => allCOMappings.add(coId))
        }
      })

      const totalCOs = lessonPlan.courseOutcomes?.length || 0
      if (totalCOs > 0 && allCOMappings.size < totalCOs) {
        const coveredCOs = Array.from(allCOMappings)
        const allCOIds = lessonPlan.courseOutcomes?.map((co: any) => co.id) || []
        const missingCOs = allCOIds.filter((coId: string) => !coveredCOs.includes(coId))

        errors.push(
          `All COs must be covered across Lecture CIEs + Course Prerequisites CIEs + Mid-term/Internal Exams. Missing COs: ${missingCOs
            .map((coId: string) => {
              const coIndex = lessonPlan.courseOutcomes?.findIndex((co: any) => co.id === coId)
              return `CO${(coIndex || 0) + 1}`
            })
            .join(", ")}`,
        )
      }
    }

    // VALIDATION 3: Validate Bloom's taxonomy usage limits
    const allBloomsUsage = currentCIEs.flatMap((cie: any) => cie.blooms_taxonomy || [])
    const rememberCount = allBloomsUsage.filter((bloom: string) => bloom === "Remember").length
    const understandCount = allBloomsUsage.filter((bloom: string) => bloom === "Understand").length

    if (rememberCount > 1) {
      errors.push("'Remember' bloom's taxonomy can be used maximum once across all CIEs")
    }

    if (understandCount > 2) {
      errors.push("'Understand' bloom's taxonomy can be used maximum twice across all CIEs")
    }

    // VALIDATION 3: Check if all CIEs have the same Bloom's taxonomy
    const allBloomsCombinations = currentCIEs
      .map((cie: any) => (cie.blooms_taxonomy || []).sort().join(","))
      .filter(Boolean)

    const uniqueBloomsCombinations = new Set(allBloomsCombinations)
    if (allBloomsCombinations.length > 1 && uniqueBloomsCombinations.size === 1) {
      errors.push("All CIEs should not have the same Bloom's Taxonomy combination")
    }

    return { errors, warnings }
  }

  const resetFieldErrors = () => {
    setTypeError("")
    setUnitsCoveredError("")
    setDateError("")
    setMarksError("")
    setDurationError("")
    setBloomsError("")
    setPedagogyError("")
    setCoMappingError("")
    setSkillMappingError("")
  }

  const addCIE = () => {
    const currentCIEs = lessonPlan.cies || []
    const newCIENumber = currentCIEs.length + 1
    const newCIE = {
      id: `cie${newCIENumber}`,
      type: "",
      units_covered: [],
      practicals_covered: [],
      date: "",
      marks: 50,
      duration: 50,
      blooms_taxonomy: [],
      evaluation_pedagogy: "",
      other_pedagogy: "",
      co_mapping: [],
      pso_mapping: [],
      peo_mapping: [],
      skill_mapping: [{ skill: "", details: "" }],
    }

    setLessonPlan((prev: any) => ({
      ...prev,
      cies: [...currentCIEs, newCIE],
    }))

    setActiveCIE(currentCIEs.length)
  }

  const removeCIE = (index: number) => {
    const currentCIEs = lessonPlan.cies || []
    if (currentCIEs.length <= 1) {
      toast.error("At least one CIE is required")
      return
    }

    const updatedCIEs = currentCIEs.filter((_: any, i: number) => i !== index)
    setLessonPlan((prev: any) => ({
      ...prev,
      cies: updatedCIEs,
    }))

    if (activeCIE >= index && activeCIE > 0) {
      setActiveCIE(activeCIE - 1)
    }
  }

  const addSkillMapping = (cieIndex: number) => {
    const updatedCIEs = [...(lessonPlan.cies || [])]
    if (!updatedCIEs[cieIndex].skill_mapping) {
      updatedCIEs[cieIndex].skill_mapping = []
    }
    updatedCIEs[cieIndex].skill_mapping.push({ skill: "", details: "" })

    setLessonPlan((prev: any) => ({
      ...prev,
      cies: updatedCIEs,
    }))
  }

  const removeSkillMapping = (cieIndex: number, skillIndex: number) => {
    const updatedCIEs = [...(lessonPlan.cies || [])]
    if (updatedCIEs[cieIndex].skill_mapping && Array.isArray(updatedCIEs[cieIndex].skill_mapping)) {
      updatedCIEs[cieIndex].skill_mapping = updatedCIEs[cieIndex].skill_mapping.filter(
        (_: any, i: number) => i !== skillIndex,
      )
    }

    setLessonPlan((prev: any) => ({
      ...prev,
      cies: updatedCIEs,
    }))
  }

  const handleSkillMappingChange = (cieIndex: number, skillIndex: number, field: string, value: string) => {
    const updatedCIEs = [...(lessonPlan.cies || [])]
    if (!updatedCIEs[cieIndex].skill_mapping) {
      updatedCIEs[cieIndex].skill_mapping = []
    }
    if (!updatedCIEs[cieIndex].skill_mapping[skillIndex]) {
      updatedCIEs[cieIndex].skill_mapping[skillIndex] = {
        skill: "",
        details: "",
      }
    }
    updatedCIEs[cieIndex].skill_mapping[skillIndex][field] = value

    setLessonPlan((prev: any) => ({
      ...prev,
      cies: updatedCIEs,
    }))
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)

    try {
      // Ensure we have valid CIE data structure
      const validCIEs = (lessonPlan.cies || []).map((cie: any) => ({
        ...cie,
        // Ensure all required fields have default values
        id: cie.id || `cie${Date.now()}`,
        type: cie.type || "",
        units_covered: cie.units_covered || [],
        practicals_covered: cie.practicals_covered || [],
        date: cie.date || "",
        marks: cie.marks || 50,
        duration: cie.duration || 50,
        blooms_taxonomy: cie.blooms_taxonomy || [],
        evaluation_pedagogy: cie.evaluation_pedagogy || "",
        other_pedagogy: cie.other_pedagogy || "",
        co_mapping: cie.co_mapping || [],
        pso_mapping: cie.pso_mapping || [],
        peo_mapping: cie.peo_mapping || [],
        skill_mapping: cie.skill_mapping || [{ skill: "", details: "" }],
      }))

      const formData = {
        cies: validCIEs,
        remarks: lessonPlan.cie_remarks || "",
      }

      console.log("Saving CIE draft data:", formData) // Debug log

      const result = await saveFormDraft(
        lessonPlan?.faculty?.id || userData?.id || "",
        lessonPlan?.subject?.id || "",
        "cie_planning",
        formData,
      )

      if (result.success) {
        setLastSaved(new Date())
        toast.success("Draft saved successfully")
      } else {
        console.error("Draft save failed:", result.error)
        toast.error(`Failed to save draft: ${result.error}`)
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error("Failed to save draft")
    } finally {
      setIsSavingDraft(false)
    }
  }

  const clearDraft = async () => {
    try {
      const result = await deleteFormDraft(
        lessonPlan?.faculty?.id || userData?.id || "",
        lessonPlan?.subject?.id || "",
        "cie_planning",
      )

      if (result.success) {
        console.log("CIE draft cleared after successful submission")
      }
    } catch (error) {
      console.error("Error clearing CIE draft:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    resetFieldErrors()

    // Validate current CIE fields
    let hasFieldErrors = false

    if (!currentCIE.type) {
      setTypeError("Type of evaluation is required")
      hasFieldErrors = true
    }

    if (currentCIE.type !== "Course Prerequisites CIE") {
      if (currentCIE.type === "Practical CIE" || currentCIE.type === "Internal Practical") {
        if (!currentCIE.practicals_covered || currentCIE.practicals_covered.length === 0) {
          setUnitsCoveredError("Practicals covered is required")
          hasFieldErrors = true
        }
      } else {
        if (!currentCIE.units_covered || currentCIE.units_covered.length === 0) {
          setUnitsCoveredError("Units covered is required")
          hasFieldErrors = true
        }
      }
    }

    if (!currentCIE.date) {
      setDateError("Date is required")
      hasFieldErrors = true
    }

    if (!currentCIE.marks || currentCIE.marks < 1) {
      setMarksError("Marks must be at least 1")
      hasFieldErrors = true
    }

    if (!currentCIE.duration || currentCIE.duration < 1) {
      setDurationError("Duration must be at least 1 minute")
      hasFieldErrors = true
    }

    if (!currentCIE.blooms_taxonomy || currentCIE.blooms_taxonomy.length === 0) {
      setBloomsError("At least one Bloom's taxonomy level is required")
      hasFieldErrors = true
    }

    if (!currentCIE.evaluation_pedagogy) {
      setPedagogyError("Evaluation pedagogy is required")
      hasFieldErrors = true
    }

    const requiresCOMapping = ["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"]
    if (requiresCOMapping.includes(currentCIE.type) && (!currentCIE.co_mapping || currentCIE.co_mapping.length === 0)) {
      setCoMappingError(`CO mapping is required for ${currentCIE.type}`)
      hasFieldErrors = true
    }

    if (
      !currentCIE.skill_mapping ||
      currentCIE.skill_mapping.length === 0 ||
      currentCIE.skill_mapping.some((skill: any) => !skill.skill || !skill.details)
    ) {
      setSkillMappingError("All skill mappings must have both skill and details")
      hasFieldErrors = true
    }

    const { errors, warnings } = validateAllCIEs()

    if (errors.length > 0 || hasFieldErrors) {
      setValidationErrors(errors)
      setValidationWarnings(warnings)
      toast.error("Please fix validation errors before saving")
      setSaving(false)
      return
    }

    if (warnings.length > 0) {
      setValidationWarnings(warnings)
    }

    try {
      const result = await saveCIEPlanningForm({
        faculty_id: lessonPlan.faculty?.id || userData?.id || "",
        subject_id: lessonPlan.subject?.id || "",
        cies: lessonPlan.cies,
        remarks: lessonPlan.cie_remarks,
      })

      if (result.success) {
        toast.success("CIE details saved successfully")
        setValidationErrors([])
        setValidationWarnings([])

        setLessonPlan((prev: any) => ({
          ...prev,
          cie_planning_completed: true,
        }))

        // Clear the draft after successful submission
        await clearDraft()
      } else {
        toast.error(result.error || "Failed to save CIE details")
      }
    } catch (error) {
      console.error("Error saving CIE details:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  const currentCIEs = lessonPlan.cies || []
  const currentCIE = currentCIEs[activeCIE]

  if (!currentCIE) {
    return <div>Loading...</div>
  }

  if (!currentCIE.skill_mapping || !Array.isArray(currentCIE.skill_mapping)) {
    currentCIE.skill_mapping = [{ skill: "", details: "" }]
  }

  return (
    <div className="p-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-red-800">
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="mb-6 border border-amber-200 bg-amber-50 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-amber-800">
              <ul className="list-disc list-inside space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CIE Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 flex-wrap">
          {currentCIEs.map((cie: any, index: number) => (
            <Button
              key={cie.id}
              variant={activeCIE === index ? "default" : "outline"}
              className={activeCIE === index ? "bg-[#1A5CA1] hover:bg-[#154A80]" : ""}
              onClick={() => setActiveCIE(index)}
            >
              CIE {index + 1}
              {cie.type && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {cie.type.split(" ")[0]}
                </Badge>
              )}
            </Button>
          ))}
          <Button variant="outline" onClick={addCIE}>
            <Plus className="h-4 w-4 mr-1" />
            Add CIE
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const result = await loadFormDraft(
                lessonPlan?.faculty?.id || userData.id,
                lessonPlan.subject.id,
                "cie_planning",
              )
              if (result.success && result.data?.cies) {
                setLessonPlan((prev: any) => ({
                  ...prev,
                  cies: result.data.cies,
                  cie_remarks: result.data.remarks || "",
                }))
                toast.success("Draft loaded manually")
              }
            }}
          >
            Load Draft
          </Button>
        </div>
        {currentCIEs.length > 1 && (
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeCIE(activeCIE)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove CIE
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">CIE {activeCIE + 1}</h3>
        </div>

        {/* Type of Evaluation */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type-of-evaluation">Type of Evaluation *</Label>
            <Select value={currentCIE.type || ""} onValueChange={(value) => handleCIEChange(activeCIE, "type", value)}>
              <SelectTrigger id="type-of-evaluation" className="mt-1">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {cieTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {typeError && <p className="text-red-500 text-xs mt-1">{typeError}</p>}
          </div>

          {/* Units/Practicals Covered */}
          <div>
            <Label htmlFor="units-covered">
              {currentCIE.type === "Practical CIE" || currentCIE.type === "Internal Practical"
                ? "Practicals Covered *"
                : "Units Covered *"}
            </Label>
            <Select
              value={currentCIE.type === "Course Prerequisites CIE" ? "disabled" : ""}
              disabled={currentCIE.type === "Course Prerequisites CIE"}
              onValueChange={(value) => {
                if (currentCIE.type === "Practical CIE" || currentCIE.type === "Internal Practical") {
                  const currentPracticals = currentCIE.practicals_covered || []
                  const updatedPracticals = currentPracticals.includes(value)
                    ? currentPracticals.filter((id) => id !== value)
                    : [...currentPracticals, value]
                  handleCIEChange(activeCIE, "practicals_covered", updatedPracticals)
                } else {
                  const currentUnits = currentCIE.units_covered || []
                  const updatedUnits = currentUnits.includes(value)
                    ? currentUnits.filter((id) => id !== value)
                    : [...currentUnits, value]
                  handleCIEChange(activeCIE, "units_covered", updatedUnits)
                }
              }}
            >
              <SelectTrigger id="units-covered" className="mt-1">
                <SelectValue
                  placeholder={
                    currentCIE.type === "Course Prerequisites CIE"
                      ? "N/A for Prerequisites CIE"
                      : currentCIE.type === "Practical CIE" || currentCIE.type === "Internal Practical"
                        ? `${(currentCIE.practicals_covered || []).length} practical(s) selected`
                        : `${(currentCIE.units_covered || []).length} unit(s) selected`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {currentCIE.type === "Practical CIE" || currentCIE.type === "Internal Practical"
                  ? lessonPlan.practicals?.map((practical: any, index: number) => (
                      <SelectItem
                        key={practical.id || `practical-${index}`}
                        value={practical.id || `practical-${index}`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(currentCIE.practicals_covered || []).includes(
                              practical.id || `practical-${index}`,
                            )}
                            onChange={() => {}}
                            className="mr-2"
                          />
                          Practical {index + 1}: {practical.practical_aim || "No aim specified"}
                        </div>
                      </SelectItem>
                    ))
                  : lessonPlan.units?.map((unit: any, index: number) => (
                      <SelectItem key={unit.id || `unit-${index}`} value={unit.id || `unit-${index}`}>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(currentCIE.units_covered || []).includes(unit.id || `unit-${index}`)}
                            onChange={() => {}}
                            className="mr-2"
                          />
                          Unit {index + 1}: {unit.unit_name || "No name specified"}
                        </div>
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            {unitsCoveredError && <p className="text-red-500 text-xs mt-1">{unitsCoveredError}</p>}

            {/* Display selected items */}
            {currentCIE.type === "Practical CIE" || currentCIE.type === "Internal Practical"
              ? currentCIE.practicals_covered &&
                currentCIE.practicals_covered.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentCIE.practicals_covered.map((practicalId: string) => {
                      const practical = lessonPlan.practicals?.find((p: any) => p.id === practicalId)
                      const practicalIndex = lessonPlan.practicals?.findIndex((p: any) => p.id === practicalId)
                      return (
                        <Badge key={practicalId} variant="secondary" className="text-xs">
                          Practical {(practicalIndex || 0) + 1}: {practical?.practical_aim || "Unknown"}
                          <button
                            onClick={() => {
                              const updated = currentCIE.practicals_covered.filter((id: string) => id !== practicalId)
                              handleCIEChange(activeCIE, "practicals_covered", updated)
                            }}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )
              : currentCIE.units_covered &&
                currentCIE.units_covered.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentCIE.units_covered.map((unitId: string) => {
                      const unit = lessonPlan.units?.find((u: any) => u.id === unitId)
                      const unitIndex = lessonPlan.units?.findIndex((u: any) => u.id === unitId)
                      return (
                        <Badge key={unitId} variant="secondary" className="text-xs">
                          Unit {(unitIndex || 0) + 1}: {unit?.unit_name || "Unknown"}
                          <button
                            onClick={() => {
                              const updated = currentCIE.units_covered.filter((id: string) => id !== unitId)
                              handleCIEChange(activeCIE, "units_covered", updated)
                            }}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}
          </div>
        </div>

        {/* Date, Marks, Duration */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={convertDDMMYYYYToYYYYMMDD(currentCIE.date || "")}
              onChange={(e) => handleCIEChange(activeCIE, "date", e.target.value)}
              className="mt-1"
            />
            {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
            {currentCIE.type === "Course Prerequisites CIE" && (
              <p className="text-xs text-amber-600 mt-1">Must be within 10 days of term start date</p>
            )}
          </div>
          <div>
            <Label htmlFor="marks">Marks *</Label>
            <Input
              id="marks"
              type="number"
              min="1"
              value={currentCIE.marks || ""}
              onChange={(e) => handleCIEChange(activeCIE, "marks", Number(e.target.value))}
              className="mt-1"
            />
            {marksError && <p className="text-red-500 text-xs mt-1">{marksError}</p>}
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="30"
              max={currentCIE.evaluation_pedagogy === "Objective-Based Assessment (Quiz/MCQ)" ? "50" : undefined}
              value={currentCIE.duration || ""}
              onChange={(e) => {
                const value = Number(e.target.value)
                handleCIEChange(activeCIE, "duration", value)
              }}
              onBlur={() => {
                // Recalculate and validate on blur
                const marks = currentCIE.marks || 0
                const blooms = currentCIE.blooms_taxonomy || []
                const minDuration = Math.max(calculateMinimumDuration(marks, blooms), 30)

                if (currentCIE.duration < minDuration) {
                  handleCIEChange(activeCIE, "duration", minDuration)
                  toast.info(`Duration automatically adjusted to minimum required: ${minDuration} minutes`)
                }
              }}
              className="mt-1"
            />
            {durationError && <p className="text-red-500 text-xs mt-1">{durationError}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Minimum 30 minutes required.
              {currentCIE.marks && currentCIE.blooms_taxonomy?.length > 0 && (
                <span className="text-blue-600">
                  {" "}
                  Recommended: {Math.max(calculateMinimumDuration(currentCIE.marks, currentCIE.blooms_taxonomy), 30)}{" "}
                  minutes based on marks and Bloom's levels.
                </span>
              )}
              {currentCIE.evaluation_pedagogy === "Objective-Based Assessment (Quiz/MCQ)" &&
                " Maximum 50 minutes for Quiz/MCQ."}
            </p>
          </div>
        </div>

        {/* Bloom's Taxonomy */}
        <div>
          <Label>
            Bloom's Taxonomy *
            <span className="text-xs text-amber-600 ml-1">
              (Remember max once, Understand max twice across all CIEs)
            </span>
          </Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {bloomsTaxonomyOptions.map((level) => {
              const semester = lessonPlan.subject?.semester || 1
              const isDisabled = semester > 2 && level === "Remember"

              // Count usage of this level across all CIEs
              const levelUsage = currentCIEs
                .filter((cie: any, i: number) => i !== activeCIE)
                .flatMap((cie: any) => cie.blooms_taxonomy || [])
                .filter((bloom: string) => bloom === level).length

              const isRememberDisabled = level === "Remember" && levelUsage >= 1
              const isUnderstandDisabled = level === "Understand" && levelUsage >= 2

              const finalDisabled = isDisabled || isRememberDisabled || isUnderstandDisabled

              return (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bloom-${level}`}
                    checked={currentCIE.blooms_taxonomy?.includes(level) || false}
                    disabled={finalDisabled}
                    onCheckedChange={(checked) => {
                      const current = currentCIE.blooms_taxonomy || []
                      const updated = checked ? [...current, level] : current.filter((l: string) => l !== level)
                      handleCIEChange(activeCIE, "blooms_taxonomy", updated)
                    }}
                  />
                  <Label
                    htmlFor={`bloom-${level}`}
                    className={finalDisabled ? "text-gray-400" : ""}
                    title={
                      isRememberDisabled
                        ? "Remember can be used maximum once across all CIEs"
                        : isUnderstandDisabled
                          ? "Understand can be used maximum twice across all CIEs"
                          : ""
                    }
                  >
                    {level}
                    {level === "Remember" && <span className="text-xs text-amber-600 ml-1">(max 1)</span>}
                    {level === "Understand" && <span className="text-xs text-amber-600 ml-1">(max 2)</span>}
                  </Label>
                </div>
              )
            })}
          </div>
          {bloomsError && <p className="text-red-500 text-xs mt-1">{bloomsError}</p>}
          {lessonPlan.subject?.semester > 2 && (
            <p className="text-xs text-amber-600 mt-2">
              'Remember' level is disabled for semester {lessonPlan.subject.semester}
            </p>
          )}
        </div>

        {/* Evaluation Pedagogy */}
        <div>
          <Label htmlFor="evaluation-pedagogy">Evaluation Pedagogy *</Label>
          <Select
            value={currentCIE.evaluation_pedagogy || ""}
            onValueChange={(value) => handleCIEChange(activeCIE, "evaluation_pedagogy", value)}
          >
            <SelectTrigger id="evaluation-pedagogy" className="mt-1">
              <SelectValue placeholder="Select Evaluation Pedagogy" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-sm font-semibold text-gray-700">Traditional Pedagogy</div>
              {evaluationPedagogyOptions.traditional.map((pedagogy) => (
                <SelectItem key={pedagogy} value={pedagogy}>
                  {pedagogy}
                </SelectItem>
              ))}
              <div className="px-2 py-1 text-sm font-semibold text-gray-700 border-t mt-2 pt-2">
                Alternative Pedagogy
              </div>
              {evaluationPedagogyOptions.alternative.map((pedagogy) => (
                <SelectItem key={pedagogy} value={pedagogy}>
                  {pedagogy}
                  {pedagogy === "Open Book Assessment" && (
                    <span className="text-xs text-amber-600 ml-1">(only Analyze, Evaluate, Create levels)</span>
                  )}
                </SelectItem>
              ))}
              <div className="px-2 py-1 text-sm font-semibold text-gray-700 border-t mt-2 pt-2">Other</div>
              {evaluationPedagogyOptions.other.map((pedagogy) => (
                <SelectItem key={pedagogy} value={pedagogy}>
                  {pedagogy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pedagogyError && <p className="text-red-500 text-xs mt-1">{pedagogyError}</p>}
          {currentCIE.evaluation_pedagogy === "Open Book Assessment" && (
            <p className="text-xs text-amber-600 mt-1">
              Open Book Assessment only allows Analyze, Evaluate, and Create levels
            </p>
          )}

          {currentCIE.evaluation_pedagogy === "Other" && (
            <div className="mt-2">
              <Label htmlFor="other-pedagogy">Specify Other Pedagogy</Label>
              <Input
                id="other-pedagogy"
                value={currentCIE.other_pedagogy || ""}
                onChange={(e) => handleCIEChange(activeCIE, "other_pedagogy", e.target.value)}
                placeholder="Enter custom pedagogy"
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* CO, PSO, PEO Mapping */}
        <div className="grid grid-cols-1 gap-6">
          {/* CO Mapping */}
          <div>
            <Label>
              CO Mapping{" "}
              {["Lecture CIE", "Course Prerequisites CIE", "Mid-term/Internal Exam"].includes(currentCIE.type)
                ? "*"
                : "(Optional)"}
            </Label>
            <Select
              value=""
              onValueChange={(value) => {
                const current = currentCIE.co_mapping || []
                if (!current.includes(value)) {
                  const updated = [...current, value]
                  handleCIEChange(activeCIE, "co_mapping", updated)
                }
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Course Outcomes" />
              </SelectTrigger>
              <SelectContent>
                {lessonPlan.courseOutcomes?.map((co: any, index: number) => (
                  <SelectItem key={co.id} value={co.id}>
                    CO{index + 1}: {co.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected COs */}
            <div className="mt-2 flex flex-wrap gap-2">
              {(currentCIE.co_mapping || []).map((coId: string) => {
                const co = lessonPlan.courseOutcomes?.find((c: any) => c.id === coId)
                const coIndex = lessonPlan.courseOutcomes?.findIndex((c: any) => c.id === coId)
                return (
                  <Badge key={coId} variant="secondary" className="text-xs">
                    CO{(coIndex || 0) + 1}: {co?.text || "Unknown"}
                    <button
                      onClick={() => {
                        const updated = currentCIE.co_mapping.filter((id: string) => id !== coId)
                        handleCIEChange(activeCIE, "co_mapping", updated)
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                )
              })}
            </div>
            {coMappingError && <p className="text-red-500 text-xs mt-1">{coMappingError}</p>}
          </div>

          {/* PSO Mapping */}
          <div>
            <Label>PSO Mapping </Label>
            {loadingPsoPeo ? (
              <p className="text-sm text-gray-500 mt-2">Loading PSO data...</p>
            ) : departmentPsoPeo.pso_data.length > 0 ? (
              <>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const current = currentCIE.pso_mapping || []
                    if (!current.includes(value)) {
                      const updated = [...current, value]
                      handleCIEChange(activeCIE, "pso_mapping", updated)
                    }
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select PSO" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentPsoPeo.pso_data.map((pso, index) => (
                      <SelectItem key={pso.id} value={pso.id}>
                        {pso.label || `PSO${index + 1}`}: {pso.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected PSOs */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {(currentCIE.pso_mapping || []).map((psoId: string) => {
                    const pso = departmentPsoPeo.pso_data.find((p) => p.id === psoId)
                    const psoIndex = departmentPsoPeo.pso_data.findIndex((p) => p.id === psoId)
                    return (
                      <Badge key={psoId} variant="secondary" className="text-xs">
                        {pso?.label || `PSO${psoIndex + 1}`}: {pso?.description || "Unknown"}
                        <button
                          onClick={() => {
                            const updated = currentCIE.pso_mapping.filter((id: string) => id !== psoId)
                            handleCIEChange(activeCIE, "pso_mapping", updated)
                          }}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No PSO data configured for this department. Please contact your HOD to set up PSO/PEO data.
              </p>
            )}
          </div>

          {/* PEO Mapping */}
          <div>
            <Label>PEO Mapping</Label>
            {loadingPsoPeo ? (
              <p className="text-sm text-gray-500 mt-2">Loading PEO data...</p>
            ) : departmentPsoPeo.peo_data.length > 0 ? (
              <>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const current = currentCIE.peo_mapping || []
                    if (!current.includes(value)) {
                      const updated = [...current, value]
                      handleCIEChange(activeCIE, "peo_mapping", updated)
                    }
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select PEO" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentPsoPeo.peo_data.map((peo, index) => (
                      <SelectItem key={peo.id} value={peo.id}>
                        {peo.label || `PEO${index + 1}`}: {peo.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected PEOs */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {(currentCIE.peo_mapping || []).map((peoId: string) => {
                    const peo = departmentPsoPeo.peo_data.find((p) => p.id === peoId)
                    const peoIndex = departmentPsoPeo.peo_data.findIndex((p) => p.id === peoId)
                    return (
                      <Badge key={peoId} variant="secondary" className="text-xs">
                        {peo?.label || `PEO${peoIndex + 1}`}: {peo?.description || "Unknown"}
                        <button
                          onClick={() => {
                            const updated = currentCIE.peo_mapping.filter((id: string) => id !== peoId)
                            handleCIEChange(activeCIE, "peo_mapping", updated)
                          }}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No PEO data configured for this department. Please contact your HOD to set up PSO/PEO data.
              </p>
            )}
          </div>
        </div>

        {/* Skill Mapping */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Skill Mapping *</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => addSkillMapping(activeCIE)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </div>

          <div className="space-y-4">
            {currentCIE.skill_mapping?.map((skillMap: any, skillIndex: number) => (
              <Card key={skillIndex} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`skill-${skillIndex}`}>Skill</Label>
                    <Select
                      value={skillMap.skill || ""}
                      onValueChange={(value) => handleSkillMappingChange(activeCIE, skillIndex, "skill", value)}
                    >
                      <SelectTrigger id={`skill-${skillIndex}`} className="mt-1">
                        <SelectValue placeholder="Select Skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillMappingOptions.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`skill-details-${skillIndex}`}>Details</Label>
                    <Textarea
                      id={`skill-details-${skillIndex}`}
                      value={skillMap.details || ""}
                      onChange={(e) => handleSkillMappingChange(activeCIE, skillIndex, "details", e.target.value)}
                      placeholder="Skills should be mentioned in measurable terms"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                {currentCIE.skill_mapping.length > 1 && (
                  <div className="flex justify-end mt-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeSkillMapping(activeCIE, skillIndex)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
          {skillMappingError && <p className="text-red-500 text-xs mt-1">{skillMappingError}</p>}
        </div>

        {/* Remarks */}
        <div>
          <Label htmlFor="cie-remarks">Remarks (Optional)</Label>
          <Textarea
            id="cie-remarks"
            value={lessonPlan.cie_remarks || ""}
            onChange={(e) =>
              setLessonPlan((prev: any) => ({
                ...prev,
                cie_remarks: e.target.value,
              }))
            }
            placeholder="Enter any additional remarks for all CIEs"
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-4">
            {lastSaved && <span className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={handleSave} className="bg-[#1A5CA1] hover:bg-[#154A80]" disabled={saving}>
              {saving ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>

      {/* Warning Dialog */}
      <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>{currentWarning}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarningDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
