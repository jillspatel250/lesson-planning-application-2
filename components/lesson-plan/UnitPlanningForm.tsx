

//@ts-nocheck

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, InfoIcon, X, Users } from "lucide-react"
import { toast } from "sonner"
import { type UnitPlanningFormValues, skillMappingOptions } from "@/utils/schema"
import { saveUnitPlanningForm } from "@/app/dashboard/actions/saveUnitPlanningForm"
import { useDashboardContext } from "@/context/DashboardContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { v4 as uuidv4 } from "uuid"
import { saveFormDraft, loadFormDraft } from "@/app/dashboard/actions/saveFormDraft"

interface UnitPlanningFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
}

// Define pedagogy options
const traditionalPedagogyOptions = ["Chalk and Talk", "ICT based learning"]

const alternativePedagogyOptions = [
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

export default function UnitPlanningForm({ lessonPlan, setLessonPlan }: UnitPlanningFormProps) {
  const { userData } = useDashboardContext()
  const [isSaving, setIsSaving] = useState(false)
  const [activeUnit, setActiveUnit] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [allFaculty, setAllFaculty] = useState<any[]>([])
  const [primaryFaculty, setPrimaryFaculty] = useState<any>(null)
  const [secondaryFaculty, setSecondaryFaculty] = useState<any[]>([])
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // State persistence cache
  const [unitDataCache, setUnitDataCache] = useState<{ [key: number]: any }>({})

  // Helper function to get existing units with preserved IDs
  const getInitialUnits = () => {
    // Check multiple possible sources for existing units
    const existingUnits = lessonPlan?.units || lessonPlan?.unitPlanning?.units || []

    if (existingUnits.length > 0) {
      console.log(
        "Loading existing units:",
        existingUnits.map((u) => ({ id: u.id, name: u.unit_name })),
      )
      return existingUnits.map((unit: any) => ({
        ...unit,
        // Preserve existing ID, don't generate new one
        id: unit.id || uuidv4(),
        isNew: false, // Mark as existing unit
      }))
    } else {
      return [
        {
          id: uuidv4(),
          unit_name: "",
          unit_topics: "",
          probable_start_date: "",
          probable_end_date: "",
          no_of_lectures: 1,
          self_study_topics: "",
          self_study_materials: "",
          unit_materials: "",
          teaching_pedagogy: [],
          other_pedagogy: "",
          co_mapping: [],
          skill_mapping: [],
          other_skill: "",
          skill_objectives: "",
          interlink_topics: "",
          topics_beyond_unit: "",
          assigned_faculty_id: userData?.id || "",
          isNew: true,
        },
      ]
    }
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm<UnitPlanningFormValues>({
    defaultValues: {
      faculty_id: userData?.id || "",
      subject_id: lessonPlan?.subject?.id || "",
      units: getInitialUnits(),
      remarks: lessonPlan?.unit_remarks || "",
    },
  })

  // Custom validation that replaces Zod schema validation
  const validateFormData = (data: any) => {
    const errors: any = {}

    // Only validate what we actually need - no 2-pedagogy requirement per unit
    data.units?.forEach((unit: any, index: number) => {
      if (!unit.unit_name?.trim()) {
        if (!errors.units) errors.units = []
        if (!errors.units[index]) errors.units[index] = {}
        errors.units[index].unit_name = { message: "Unit name is required" }
      }

      if (!unit.teaching_pedagogy || unit.teaching_pedagogy.length === 0) {
        if (!errors.units) errors.units = []
        if (!errors.units[index]) errors.units[index] = {}
        errors.units[index].teaching_pedagogy = {
          message: "At least one pedagogy must be selected",
        }
      }

      // Add other required field validations as needed
    })

    return Object.keys(errors).length > 0 ? errors : null
  }

  const {
    fields: unitFields,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: "units",
  })

  // Save current unit data to cache
  const saveCurrentUnitToCache = () => {
    const currentUnitData = getValues(`units.${activeUnit}`)
    if (currentUnitData) {
      setUnitDataCache((prev) => ({
        ...prev,
        [activeUnit]: { ...currentUnitData },
      }))

      // Also update lesson plan state immediately
      setLessonPlan((prev: any) => {
        const updatedUnits = [...(prev.units || [])]
        if (updatedUnits[activeUnit]) {
          updatedUnits[activeUnit] = { ...currentUnitData }
        }
        return {
          ...prev,
          units: updatedUnits,
        }
      })
    }
  }

  // Load unit data from cache
  const loadUnitFromCache = (unitIndex: number) => {
    const cachedData = unitDataCache[unitIndex]
    if (cachedData) {
      // Set all form values for the unit
      Object.keys(cachedData).forEach((key) => {
        //@ts-ignore
        setValue(`units.${unitIndex}.${key}`, cachedData[key])
      })
    }
  }

  // Enhanced unit switching with state persistence
  const switchToUnit = (newUnitIndex: number) => {
    if (newUnitIndex === activeUnit) return

    // Save current unit data before switching
    saveCurrentUnitToCache()

    // Switch to new unit
    setActiveUnit(newUnitIndex)

    // Load cached data for new unit after a brief delay to ensure state update
    setTimeout(() => {
      loadUnitFromCache(newUnitIndex)
    }, 50)
  }

  // Initialize cache with existing unit data on mount
  useEffect(() => {
    const initialUnits = getInitialUnits()
    if (initialUnits && initialUnits.length > 0) {
      const initialCache: { [key: number]: any } = {}
      initialUnits.forEach((unit: any, index: number) => {
        initialCache[index] = { ...unit }
      })
      setUnitDataCache(initialCache)

      console.log("Initialized unit cache:", initialCache)
    }
  }, [lessonPlan?.units, lessonPlan?.unitPlanning?.units])

  // Auto-save current unit data when form values change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith(`units.${activeUnit}`)) {
        // Debounce the save operation
        const timeoutId = setTimeout(() => {
          saveCurrentUnitToCache()
        }, 500)

        return () => clearTimeout(timeoutId)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, activeUnit, getValues, setLessonPlan])

  // Check for faculty sharing when component mounts
  useEffect(() => {
    const loadFacultySharing = async () => {
      if (!lessonPlan?.subject?.id) return

      try {
        console.log("Checking faculty sharing for subject:", lessonPlan.subject.id)

        // Call the API route directly from client
        const response = await fetch(`/api/faculty-sharing?subjectId=${lessonPlan.subject.id}`)
        const result = await response.json()

        console.log("Faculty sharing result:", result)

        if (result.success) {
          setIsSharing(result.isSharing)
          setAllFaculty(result.allFaculty)
          setPrimaryFaculty(result.primaryFaculty)
          setSecondaryFaculty(result.secondaryFaculty)

          // If sharing is detected, update form state
          if (result.isSharing) {
            setValue("is_sharing", true)
            setValue("sharing_faculty", result.allFaculty)
          }
        } else {
          console.error("Failed to check faculty sharing:", result.error)
        }
      } catch (error) {
        console.error("Error loading faculty sharing:", error)
      }
    }

    loadFacultySharing()
  }, [lessonPlan?.subject?.id, setValue])

  // Load existing unit assignments when lesson plan data is available
  useEffect(() => {
    const existingUnits = lessonPlan?.units || lessonPlan?.unitPlanning?.units || []
    if (existingUnits.length > 0) {
      existingUnits.forEach((unit: any, index: number) => {
        if (unit.assigned_faculty_id) {
          setValue(`units.${index}.assigned_faculty_id`, unit.assigned_faculty_id)
        }
      })
    }
  }, [lessonPlan?.units, lessonPlan?.unitPlanning?.units, setValue])

  useEffect(() => {
    const loadDraft = async () => {
      if (!userData?.id || !lessonPlan?.subject?.id) return

      try {
        const result = await loadFormDraft(userData.id, lessonPlan.subject.id, "unit_planning")

        if (result.success && result.data) {
          const data = result.data
          if (data.units && data.units.length > 0) {
            // Preserve existing unit IDs when loading draft
            const unitsWithPreservedIds = data.units.map((unit: any) => ({
              ...unit,
              id: unit.id || uuidv4(), // Keep existing ID or generate new one
            }))

            // Reset form with loaded data
            reset({
              ...data,
              faculty_id: userData.id,
              subject_id: lessonPlan.subject.id,
              units: unitsWithPreservedIds,
            })

            // Update cache with loaded data
            const initialCache: { [key: number]: any } = {}
            unitsWithPreservedIds.forEach((unit: any, index: number) => {
              initialCache[index] = { ...unit }
            })
            setUnitDataCache(initialCache)

            toast.success("Draft loaded successfully")
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }

    loadDraft()
  }, [userData?.id, lessonPlan?.subject?.id, reset])

  const addUnit = () => {
    // Save current unit before adding new one
    saveCurrentUnitToCache()

    const newUnit = {
      id: uuidv4(), // Only generate new ID for truly new units
      unit_name: "",
      unit_topics: "",
      probable_start_date: "",
      probable_end_date: "",
      no_of_lectures: 1,
      self_study_topics: "",
      self_study_materials: "",
      unit_materials: "",
      teaching_pedagogy: [],
      other_pedagogy: "",
      co_mapping: [],
      skill_mapping: [],
      other_skill: "",
      skill_objectives: "",
      interlink_topics: "",
      topics_beyond_unit: "",
      assigned_faculty_id: userData?.id || "",
      isNew: true,
    }

    appendUnit(newUnit)

    // Cache the new unit
    const newIndex = unitFields.length
    setUnitDataCache((prev) => ({
      ...prev,
      [newIndex]: { ...newUnit },
    }))

    setActiveUnit(newIndex)
  }

  const removeUnitHandler = (index: number) => {
    if (unitFields.length === 1) {
      toast.error("You must have at least one unit")
      return
    }

    // Remove from cache
    setUnitDataCache((prev) => {
      const newCache = { ...prev }
      delete newCache[index]

      // Reindex remaining cache entries
      const reindexedCache: { [key: number]: any } = {}
      Object.keys(newCache).forEach((key) => {
        const numKey = Number.parseInt(key)
        if (numKey > index) {
          reindexedCache[numKey - 1] = newCache[numKey]
        } else {
          reindexedCache[numKey] = newCache[numKey]
        }
      })

      return reindexedCache
    })

    removeUnit(index)

    if (activeUnit >= index && activeUnit > 0) {
      setActiveUnit(activeUnit - 1)
    }
  }

  const handlePedagogyChange = (unitIndex: number, pedagogy: string, checked: boolean) => {
    const currentPedagogies = getValues(`units.${unitIndex}.teaching_pedagogy`) || []
    if (checked) {
      setValue(`units.${unitIndex}.teaching_pedagogy`, [...currentPedagogies, pedagogy])
    } else {
      setValue(
        `units.${unitIndex}.teaching_pedagogy`,
        currentPedagogies.filter((p) => p !== pedagogy),
      )
    }
  }

  const addPedagogy = (unitIndex: number, pedagogy: string) => {
    const currentPedagogies = getValues(`units.${unitIndex}.teaching_pedagogy`) || []
    if (!currentPedagogies.includes(pedagogy)) {
      setValue(`units.${unitIndex}.teaching_pedagogy`, [...currentPedagogies, pedagogy])
    }
  }

  const removePedagogy = (unitIndex: number, pedagogy: string) => {
    const currentPedagogies = getValues(`units.${unitIndex}.teaching_pedagogy`) || []
    setValue(
      `units.${unitIndex}.teaching_pedagogy`,
      currentPedagogies.filter((p) => p !== pedagogy),
    )
  }

  const handleCOMapping = (unitIndex: number, co: string, checked: boolean) => {
    const currentCOs = getValues(`units.${unitIndex}.co_mapping`) || []
    if (checked) {
      setValue(`units.${unitIndex}.co_mapping`, [...currentCOs, co])
    } else {
      setValue(
        `units.${unitIndex}.co_mapping`,
        currentCOs.filter((c) => c !== co),
      )
    }
  }

  const handleSkillMapping = (unitIndex: number, skill: string, checked: boolean) => {
    const currentSkills = getValues(`units.${unitIndex}.skill_mapping`) || []
    if (checked) {
      setValue(`units.${unitIndex}.skill_mapping`, [...currentSkills, skill])
    } else {
      setValue(
        `units.${unitIndex}.skill_mapping`,
        currentSkills.filter((s) => s !== skill),
      )
    }
  }

  // Update the handleFacultyAssignment function to store both faculty ID and name
  const handleFacultyAssignment = (unitIndex: number, facultyId: string) => {
    // Get faculty name
    const faculty = allFaculty.find((f) => f.id === facultyId)
    const facultyName = faculty ? faculty.name : "Unknown Faculty"

    // Update the form state directly and trigger validation
    setValue(`units.${unitIndex}.assigned_faculty_id`, facultyId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })

    // Also store faculty name for display purposes
    setValue(`units.${unitIndex}.faculty_name`, facultyName, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    })

    // Force re-render by triggering validation
    trigger(`units.${unitIndex}.assigned_faculty_id`)

    // Update the lesson plan state immediately for UI feedback
    setLessonPlan((prev: any) => {
      const updatedUnits = [...(prev.units || [])]
      if (updatedUnits[unitIndex]) {
        updatedUnits[unitIndex] = {
          ...updatedUnits[unitIndex],
          assigned_faculty_id: facultyId,
          faculty_name: facultyName,
        }
      }
      return {
        ...prev,
        units: updatedUnits,
      }
    })
  }

  // Function to validate a specific field in the current unit
  const validateField = (fieldName: string) => {
    const result = trigger(`units.${activeUnit}.${fieldName}`)
    return result
  }

  // Function to show field-specific error message
  const getFieldError = (fieldName: string) => {
    return errors.units?.[activeUnit]?.[fieldName]?.message
  }

  const showFormDialog = (title: string, message: string) => {
    // Create a custom dialog for form messages
    const dialog = document.createElement("div")
    dialog.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    dialog.innerHTML = `
 <div class="bg-white rounded-lg w-full max-w-2xl shadow-xl">
 <div class="flex items-center justify-between p-6 border-b border-gray-200">
 <h3 class="text-xl font-semibold text-red-600">${title}</h3>
 <button class="text-gray-400 hover:text-gray-600 text-2xl font-bold" onclick="this.closest('.fixed').remove()">
 ×
 </button>
 </div>
 <div class="p-6">
 <div class="text-sm leading-relaxed whitespace-pre-line text-gray-700">${message}</div>
 </div>
 <div class="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
 <button class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium" onclick="this.closest('.fixed').remove()">
 OK
 </button>
 </div>
 </div>
 `
    document.body.appendChild(dialog)

    // Add click outside to close
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.remove()
      }
    })
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)

    try {
      // Save current unit to cache before saving draft
      saveCurrentUnitToCache()

      // Merge cached data with form data
      const currentFormData = getValues()
      const mergedUnits = currentFormData.units.map((unit, index) => ({
        ...unit,
        ...(unitDataCache[index] || {}),
      }))

      const formData = {
        ...currentFormData,
        units: mergedUnits,
      }

      const result = await saveFormDraft(userData?.id || "", lessonPlan?.subject?.id || "", "unit_planning", formData)

      if (result.success) {
        setLastSaved(new Date())
        toast.success("Draft saved successfully")
      } else {
        toast.error("Failed to save draft")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error("Failed to save draft")
    } finally {
      setIsSavingDraft(false)
    }
  }

  const validateDates = (unitIndex: number) => {
    const startDate = watch(`units.${unitIndex}.probable_start_date`)
    const endDate = watch(`units.${unitIndex}.probable_end_date`)

    if (!startDate || !endDate) return true // Skip validation if dates are not provided

    // Check if dates are in valid format
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      toast.error(`Unit ${unitIndex + 1}: Invalid date format`)
      return false
    }

    // Check if start date is before end date
    if (startDateObj > endDateObj) {
      toast.error(`Unit ${unitIndex + 1}: Start date must be before end date`)
      return false
    }

    return true
  }

  // Add this function after the validateDates function
  const validateDateOrder = (unitIndex: number) => {
    const startDate = watch(`units.${unitIndex}.probable_start_date`)
    const endDate = watch(`units.${unitIndex}.probable_end_date`)

    if (!startDate || !endDate) return true // Skip validation if dates are not provided

    // Check if dates are in valid format
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      setValue(`units.${unitIndex}.dateFormatError`, "Invalid date format")
      return false
    }

    // Check if start date is before end date
    if (startDateObj > endDateObj) {
      setValue(`units.${unitIndex}.dateOrderError`, "Start date must be before end date")
      return false
    }

    // Clear any existing errors
    setValue(`units.${unitIndex}.dateFormatError`, undefined)
    setValue(`units.${unitIndex}.dateOrderError`, undefined)
    return true
  }

  // Add this function after validateDateOrder
  const validateTeachingPedagogy = () => {
    const allUnits = getValues("units")
    const errors: string[] = []

    // Check if each unit has at least one pedagogy (any pedagogy - traditional or alternative)
    allUnits.forEach((unit: any, index: number) => {
      if (!unit.teaching_pedagogy || unit.teaching_pedagogy.length === 0) {
        errors.push(`Unit ${index + 1}: At least one teaching pedagogy must be selected`)
      }
    })

    // Check for minimum 2 unique alternative pedagogies across ALL units (only if there are multiple units)
    if (allUnits.length > 1) {
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
      allUnits.forEach((unit: any) => {
        unit.teaching_pedagogy?.forEach((pedagogy: string) => {
          // Check if it's an alternative pedagogy or starts with "Other:"
          if (alternativePedagogies.includes(pedagogy) || pedagogy.startsWith("Other:")) {
            uniqueAlternativePedagogies.add(pedagogy)
          }
        })
      })

      // Check if at least 2 unique alternative pedagogies are used across ALL units
      if (uniqueAlternativePedagogies.size < 2) {
        errors.push(
          "Minimum 2 different alternative pedagogies must be selected across all units (items 3-15 or Other options)",
        )
      }
    }

    return errors
  }

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && (name.includes("probable_start_date") || name.includes("probable_end_date"))) {
        const unitIndex = Number.parseInt(name.split(".")[1])
        if (!isNaN(unitIndex)) {
          validateDateOrder(unitIndex)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  // Add this useEffect for real-time pedagogy validation
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.includes("teaching_pedagogy")) {
        // Debounce validation
        const timeoutId = setTimeout(() => {
          const errors = validateTeachingPedagogy()
          // You can add visual feedback here if needed
          if (errors.length > 0) {
            console.log("Pedagogy validation errors:", errors)
          }
        }, 500)

        return () => clearTimeout(timeoutId)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, getValues])

  const onSubmit = async (data: UnitPlanningFormValues) => {
    setIsSaving(true)

    // Save current unit to cache before submitting
    saveCurrentUnitToCache()

    // Replace the existing validation section in onSubmit function with this:
    // Validate dates for all units
    let hasDateErrors = false
    for (let i = 0; i < data.units.length; i++) {
      if (!validateDates(i)) {
        hasDateErrors = true
        break
      }
    }

    if (hasDateErrors) {
      setIsSaving(false)
      return
    }

    // Validate teaching pedagogy across all units
    const pedagogyErrors = validateTeachingPedagogy()
    if (pedagogyErrors.length > 0) {
      showFormDialog(
        "Teaching Pedagogy Requirements",
        "Please ensure the following pedagogy requirements are met:\n\n" +
          pedagogyErrors.map((error) => `• ${error}`).join("\n") +
          "\n\nNote: \n" +
          "- Each unit needs at least one pedagogy (traditional or alternative)\n" +
          "- If you have multiple units, you need at least 2 different alternative pedagogies across all units\n" +
          "- Alternative pedagogies include items 3-15 in the dropdown and any 'Other' options you specify.",
      )
      setIsSaving(false)
      return
    }

    // Validate all fields in the current unit
    const fieldsToValidate = [
      "unit_name",
      "unit_topics",
      "probable_start_date",
      "probable_end_date",
      "no_of_lectures",
      "unit_materials",
      "teaching_pedagogy",
      "co_mapping",
      "skill_mapping",
      "skill_objectives",
      "topics_beyond_unit",
    ]

    let hasFieldErrors = false
    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) {
        hasFieldErrors = true
        // Scroll to the first error
        if (!hasFieldErrors) {
          const errorElement = document.getElementById(`${field}-${activeUnit}`)
          errorElement?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    })

    if (hasFieldErrors) {
      toast.error("Please fix all validation errors before saving")
      setIsSaving(false)
      return
    }

    // Merge cached data with form data
    const mergedUnits = data.units.map((unit, index) => ({
      ...unit,
      ...(unitDataCache[index] || {}),
    }))

    const finalData = {
      ...data,
      units: mergedUnits,
    }

    // Debug: Log the data being submitted
    console.log(
      "Submitting units with IDs:",
      finalData.units.map((u, i) => ({
        unit: i + 1,
        id: u.id,
        name: u.unit_name,
        assigned_faculty_id: u.assigned_faculty_id,
        faculty_name: u.faculty_name,
      })),
    )

    // Validate faculty assignments for shared subjects
    if (isSharing) {
      const unassignedUnits = finalData.units.filter((unit) => !unit.assigned_faculty_id)
      if (unassignedUnits.length > 0) {
        const unitNumbers = unassignedUnits
          .map((_, idx) => {
            const originalIndex = finalData.units.findIndex((u) => u.id === unassignedUnits[idx].id)
            return originalIndex + 1
          })
          .join(", ")

        showFormDialog("Faculty Assignment Required", `Please assign faculty to Unit ${unitNumbers} before saving.`)
        setIsSaving(false)
        return
      }
    } else {
      // For non-shared subjects, automatically assign current faculty to all units
      finalData.units = finalData.units.map((unit) => ({
        ...unit,
        assigned_faculty_id: unit.assigned_faculty_id || userData?.id || "",
        faculty_name: unit.faculty_name || userData?.name || "Current Faculty",
      }))
    }

    try {
      // Add sharing information to the form data
      const formDataWithSharing = {
        ...finalData,
        is_sharing: isSharing,
        sharing_faculty: allFaculty,
      }

      const result = await saveUnitPlanningForm({
        faculty_id: userData?.id || "",
        subject_id: lessonPlan?.subject?.id || "",
        formData: formDataWithSharing,
      })

      if (result.success) {
        toast.success("Unit planning saved successfully!")
        setLessonPlan((prev: any) => ({
          ...prev,
          units: finalData.units,
          unit_remarks: finalData.remarks,
          is_sharing: isSharing,
          sharing_faculty: allFaculty,
          unit_planning_completed: true,
        }))
      } else {
        // Show validation dialog
        if (result.error?.includes("Dear Professor")) {
          showFormDialog("Validation Required", result.error)
        } else {
          toast.error(result.error || "Failed to save unit planning")
        }
      }
    } catch (error) {
      console.error("Error saving unit planning:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const showValidationDialog = (message: string) => {
    // Create a custom dialog for validation messages
    const dialog = document.createElement("div")
    dialog.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    dialog.innerHTML = `
 <div class="bg-white rounded-lg w-full max-w-2xl shadow-xl">
 <div class="flex items-center justify-between p-6 border-b border-gray-200">
 <h3 class="text-xl font-semibold text-red-600">Validation Required</h3>
 <button class="text-gray-400 hover:text-gray-600 text-2xl font-bold" onclick="this.closest('.fixed').remove()">
 ×
 </button>
 </div>
 <div class="p-6">
 <div class="text-sm leading-relaxed whitespace-pre-line text-gray-700">${message}</div>
 </div>
 <div class="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
 <button class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium" onclick="this.closest('.fixed').remove()">
 OK
 </button>
 </div>
 </div>
 `
    document.body.appendChild(dialog)

    // Add click outside to close
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.remove()
      }
    })
  }

  // Generate CO options based on course outcomes
  const courseOutcomes = lessonPlan?.courseOutcomes || []
  const coOptions = courseOutcomes.map((_: any, index: number) => `CO${index + 1}`)

  // Get faculty name by ID
  const getFacultyName = (facultyId: string) => {
    const faculty = allFaculty.find((f) => f.id === facultyId)
    return faculty ? faculty.name : "Unknown Faculty"
  }

  // Get short faculty name for badges
  const getShortFacultyName = (facultyId: string) => {
    const faculty = allFaculty.find((f) => f.id === facultyId)
    if (!faculty) return "?"

    // Extract initials or short name
    const nameParts = faculty.name.split(" ")
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    }
    return faculty.name.substring(0, 2).toUpperCase()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Unit Planning Guidelines</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowInstructions(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Guidelines for Unit Planning</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Teaching Pedagogy Requirements:</h3>
                  <p>
                    At least two alternative pedagogies (items 3-15) must be selected across different units to ensure
                    diverse teaching methods.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">CO Mapping:</h3>
                  <p>
                    All Course Outcomes (COs) entered in General Details must be covered across all units to ensure
                    complete curriculum coverage.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Lecture Count:</h3>
                  <p>
                    Total number of lectures across all units must equal Credits × 15 to maintain academic standards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Skill Mapping:</h3>
                  <p>
                    Skills should be mentioned in measurable terms (e.g., &quot;Ability to build and deploy a basic web
                    application using Flask framework&quot; instead of just &quot;web development skills&quot;).
                  </p>
                </div>
                {isSharing && (
                  <div>
                    <h3 className="font-semibold">Faculty Assignment:</h3>
                    <p>
                      Since this subject is shared among multiple faculty, please assign each unit to the appropriate
                      faculty member who will be responsible for teaching that unit.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowInstructions(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Sharing Information */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Unit Planning Details</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-600"
            onClick={() => setShowInstructions(true)}
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            View Guidelines
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Faculty Sharing Status */}
          {isSharing && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Sharing Enabled
              </Badge>
              <div className="text-sm text-gray-600">
                {allFaculty.length} Faculty: {allFaculty.map((f) => f.name).join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Faculty Sharing Status - Only show when sharing is detected */}
      {isSharing && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800">Shared Subject Detected</h4>
                <p className="text-sm text-blue-600">
                  This subject is shared among multiple faculty members. Please assign each unit to the appropriate
                  faculty.
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-blue-600 text-white px-3 py-1">
              {allFaculty.length} Faculty Sharing
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="bg-white rounded p-3 border border-blue-200">
              <span className="text-sm font-medium text-gray-700">Primary Faculty:</span>
              <p className="font-semibold text-blue-800">{primaryFaculty?.name || "Not assigned"}</p>
            </div>
            <div className="bg-white rounded p-3 border border-blue-200">
              <span className="text-sm font-medium text-gray-700">Secondary Faculty:</span>
              <p className="font-semibold text-blue-800">{secondaryFaculty?.[0]?.name || "Not assigned"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Unit Tabs */}
      <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {unitFields.map((unit, index) => (
            <Button
              key={unit.id}
              type="button"
              variant={activeUnit === index ? "default" : "outline"}
              className={`${activeUnit === index ? "bg-[#1A5CA1] hover:bg-[#154A80]" : ""} relative whitespace-nowrap`}
              onClick={() => switchToUnit(index)}
              title={
                isSharing && watch(`units.${index}.assigned_faculty_id`)
                  ? `Assigned to: ${getFacultyName(watch(`units.${index}.assigned_faculty_id`))}`
                  : undefined
              }
            >
              <span>Unit {index + 1}</span>
              {isSharing && watch(`units.${index}.assigned_faculty_id`) && (
                <Badge variant="outline" className="ml-2 text-xs bg-white">
                  {getFacultyName(watch(`units.${index}.assigned_faculty_id`))
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Badge>
              )}
            </Button>
          ))}
          <Button type="button" variant="outline" onClick={addUnit} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-1" />
            Add Unit
          </Button>
        </div>
        {unitFields.length > 1 && (
          <Button
            type="button"
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeUnitHandler(activeUnit)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Unit
          </Button>
        )}
      </div>

      {/* Faculty Assignment Summary - Only visible when sharing is enabled */}
      {isSharing && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center text-sm">
            <Users className="h-4 w-4 mr-2" />
            Faculty Assignment Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {unitFields.map((unit, index) => {
              const assignedFacultyId = watch(`units.${index}.assigned_faculty_id`)
              const facultyName = getFacultyName(assignedFacultyId)
              return (
                <div key={unit.id} className="flex items-center justify-between bg-white rounded p-1.5 border text-sm">
                  <span className="font-medium">Unit {index + 1}</span>
                  <Badge variant={assignedFacultyId ? "default" : "secondary"} className="text-xs">
                    {facultyName}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Unit Form */}
      {unitFields[activeUnit] && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span>Unit {activeUnit + 1}</span>
                <div className="text-xs text-gray-500">ID: {watch(`units.${activeUnit}.id`)?.substring(0, 8)}...</div>
              </div>

              {/* Faculty Assignment Dropdown - Only show when sharing is enabled */}
              {isSharing && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Faculty Assignment:</span>
                  <Select
                    value={watch(`units.${activeUnit}.assigned_faculty_id`) || ""}
                    onValueChange={(value) => handleFacultyAssignment(activeUnit, value)}
                  >
                    <SelectTrigger className="w-[200px] bg-white border-blue-300">
                      <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {allFaculty.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Shared Subject
                  </Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Unit Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2" htmlFor={`unit-name-${activeUnit}`}>
                  Unit Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`unit-name-${activeUnit}`}
                  {...register(`units.${activeUnit}.unit_name`)}
                  placeholder="Enter unit name"
                />
                {errors.units?.[activeUnit]?.unit_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.unit_name?.message}</p>
                )}
              </div>

              <div>
                <Label className="mb-2" htmlFor={`no-of-lectures-${activeUnit}`}>
                  No. of Lectures <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`no-of-lectures-${activeUnit}`}
                  type="number"
                  min="1"
                  {...register(`units.${activeUnit}.no_of_lectures`)}
                  placeholder="Enter number of lectures"
                />
                {errors.units?.[activeUnit]?.no_of_lectures && (
                  <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.no_of_lectures?.message}</p>
                )}
              </div>
            </div>

            {/* Unit Topics */}
            <div>
              <Label className="mb-2" htmlFor={`unit-topics-${activeUnit}`}>
                Unit Topics <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id={`unit-topics-${activeUnit}`}
                {...register(`units.${activeUnit}.unit_topics`)}
                placeholder="Enter unit topics"
                rows={4}
              />
              {errors.units?.[activeUnit]?.unit_topics && (
                <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.unit_topics?.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2" htmlFor={`start-date-${activeUnit}`}>
                  Probable Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`start-date-${activeUnit}`}
                  type="date"
                  {...register(`units.${activeUnit}.probable_start_date`)}
                  className={
                    watch(`units.${activeUnit}.dateFormatError`) || watch(`units.${activeUnit}.dateOrderError`)
                      ? "border-red-500"
                      : ""
                  }
                  onChange={(e) => {
                    setValue(`units.${activeUnit}.probable_start_date`, e.target.value)
                    validateDateOrder(activeUnit)
                  }}
                />
                {errors.units?.[activeUnit]?.probable_start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.probable_start_date?.message}</p>
                )}
                {watch(`units.${activeUnit}.dateFormatError`) && (
                  <p className="text-red-500 text-sm mt-1">{watch(`units.${activeUnit}.dateFormatError`)}</p>
                )}
              </div>

              <div>
                <Label className="mb-2" htmlFor={`end-date-${activeUnit}`}>
                  Probable End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`end-date-${activeUnit}`}
                  type="date"
                  {...register(`units.${activeUnit}.probable_end_date`)}
                  className={
                    watch(`units.${activeUnit}.dateFormatError`) || watch(`units.${activeUnit}.dateOrderError`)
                      ? "border-red-500"
                      : ""
                  }
                  onChange={(e) => {
                    setValue(`units.${activeUnit}.probable_end_date`, e.target.value)
                    validateDateOrder(activeUnit)
                  }}
                />
                {errors.units?.[activeUnit]?.probable_end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.probable_end_date?.message}</p>
                )}
                {watch(`units.${activeUnit}.dateOrderError`) && (
                  <p className="text-red-500 text-sm mt-1">{watch(`units.${activeUnit}.dateOrderError`)}</p>
                )}
              </div>
            </div>

            {/* Self-Study Topics and Materials */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="mb-2" htmlFor={`self-study-topics-${activeUnit}`}>
                  Self-Study Topics (Optional)
                </Label>
                <Textarea
                  id={`self-study-topics-${activeUnit}`}
                  {...register(`units.${activeUnit}.self_study_topics`)}
                  placeholder="Enter self-study topics"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`self-study-materials-${activeUnit}`}>
                  Self-Study Materials (Optional)
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 ml-2"
                    onClick={() => setShowInstructions(true)}
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </Label>
                <Textarea
                  id={`self-study-materials-${activeUnit}`}
                  {...register(`units.${activeUnit}.self_study_materials`)}
                  placeholder="Enter self-study materials with specific references"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`unit-materials-${activeUnit}`}>
                  Unit Materials <span className="text-red-500">*</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 ml-2"
                    onClick={() => setShowInstructions(true)}
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </Label>
                <Textarea
                  id={`unit-materials-${activeUnit}`}
                  {...register(`units.${activeUnit}.unit_materials`)}
                  placeholder="Enter unit materials with specific references"
                  rows={3}
                />
                {errors.units?.[activeUnit]?.unit_materials && (
                  <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.unit_materials?.message}</p>
                )}
              </div>
            </div>

            {/* Teaching Pedagogy - Updated with 2 sections only */}
            <div>
              <Label className="mb-4 block text-base font-semibold">
                Teaching Pedagogy <span className="text-red-500">*</span>
              </Label>

              {/* Traditional Pedagogy (1-2) */}
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Traditional Pedagogy</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    addPedagogy(activeUnit, value)
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Traditional Pedagogy" />
                  </SelectTrigger>
                  <SelectContent>
                    {traditionalPedagogyOptions.map((pedagogy) => (
                      <SelectItem key={pedagogy} value={pedagogy}>
                        {pedagogy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alternative Pedagogy (3-15) - Including Other option */}
              <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-gray-50">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Alternative Pedagogy</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value === "Other") {
                      // Don't add "Other" directly, just trigger the input field
                      setValue(`units.${activeUnit}.show_other_input`, true)
                    } else {
                      addPedagogy(activeUnit, value)
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Alternative Pedagogy" />
                  </SelectTrigger>
                  <SelectContent>
                    {alternativePedagogyOptions.map((pedagogy) => (
                      <SelectItem key={pedagogy} value={pedagogy}>
                        {pedagogy}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {/* Other Pedagogy Input - Shows when "Other" is selected */}
                {watch(`units.${activeUnit}.show_other_input`) && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Enter other pedagogy"
                      value={watch(`units.${activeUnit}.other_pedagogy`) || ""}
                      onChange={(e) => setValue(`units.${activeUnit}.other_pedagogy`, e.target.value)}
                      className="bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const otherValue = watch(`units.${activeUnit}.other_pedagogy`)
                        if (otherValue && otherValue.trim()) {
                          addPedagogy(activeUnit, `Other: ${otherValue}`)
                          setValue(`units.${activeUnit}.other_pedagogy`, "")
                          setValue(`units.${activeUnit}.show_other_input`, false)
                        }
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setValue(`units.${activeUnit}.show_other_input`, false)
                        setValue(`units.${activeUnit}.other_pedagogy`, "")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Selected Pedagogies */}
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Selected Pedagogies</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white">
                  {(watch(`units.${activeUnit}.teaching_pedagogy`) || []).length === 0 ? (
                    <span className="text-gray-400 text-sm">No pedagogies selected</span>
                  ) : (
                    (watch(`units.${activeUnit}.teaching_pedagogy`) || []).map((pedagogy: string) => (
                      <Badge key={pedagogy} variant="secondary" className="text-xs">
                        {pedagogy}
                        <button
                          type="button"
                          onClick={() => removePedagogy(activeUnit, pedagogy)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {errors.units?.[activeUnit]?.teaching_pedagogy && (
                <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.teaching_pedagogy?.message}</p>
              )}
            </div>

            {/* CO Mapping */}
            <div>
              <Label className="mb-2">
                CO Mapping <span className="text-red-500">*</span>
              </Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const current = watch(`units.${activeUnit}.co_mapping`) || []
                  if (!current.includes(value)) {
                    handleCOMapping(activeUnit, value, true)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course Outcomes" />
                </SelectTrigger>
                <SelectContent>
                  {courseOutcomes.map((co: any, index: number) => (
                    <SelectItem key={co.id} value={co.id}>
                      CO{index + 1}: {co.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected COs */}
              <div className="mt-2 flex flex-wrap gap-2">
                {(watch(`units.${activeUnit}.co_mapping`) || []).map((coId: string) => {
                  const co = courseOutcomes.find((c: any) => c.id === coId)
                  const coIndex = courseOutcomes.findIndex((c: any) => c.id === coId)
                  return (
                    <Badge key={coId} variant="secondary" className="text-xs">
                      CO{coIndex + 1}: {co?.text || "Unknown"}
                      <button
                        type="button"
                        onClick={() => handleCOMapping(activeUnit, coId, false)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  )
                })}
              </div>

              {errors.units?.[activeUnit]?.co_mapping && (
                <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.co_mapping?.message}</p>
              )}
            </div>

            {/* Skill Mapping */}
            <div>
              <Label className="mb-2">
                Skill Mapping <span className="text-red-500">*</span>
              </Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (value === "Other") {
                    // Show the input field for "Other" skill
                    setValue(`units.${activeUnit}.show_other_skill_input`, true)
                  } else {
                    const current = watch(`units.${activeUnit}.skill_mapping`) || []
                    if (!current.includes(value)) {
                      handleSkillMapping(activeUnit, value, true)
                    }
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Skills" />
                </SelectTrigger>
                <SelectContent>
                  {skillMappingOptions
                    .filter((skill) => skill !== "Other")
                    .map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Other Skill Input - Shows when "Other" is selected */}
              {watch(`units.${activeUnit}.show_other_skill_input`) && (
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Enter other skill"
                    value={watch(`units.${activeUnit}.other_skill`) || ""}
                    onChange={(e) => setValue(`units.${activeUnit}.other_skill`, e.target.value)}
                    className="bg-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const otherValue = watch(`units.${activeUnit}.other_skill`)
                      if (otherValue && otherValue.trim()) {
                        handleSkillMapping(activeUnit, `Other: ${otherValue}`, true)
                        setValue(`units.${activeUnit}.other_skill`, "")
                        setValue(`units.${activeUnit}.show_other_skill_input`, false)
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setValue(`units.${activeUnit}.show_other_skill_input`, false)
                      setValue(`units.${activeUnit}.other_skill`, "")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Selected Skills */}
              <div className="mt-2 flex flex-wrap gap-2">
                {(watch(`units.${activeUnit}.skill_mapping`) || []).map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillMapping(activeUnit, skill, false)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              {errors.units?.[activeUnit]?.skill_mapping && (
                <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.skill_mapping?.message}</p>
              )}
            </div>

            {/* Skill Objectives */}
            <div>
              <Label className="mb-2" htmlFor={`skill-objectives-${activeUnit}`}>
                Objective for Selected Skills <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id={`skill-objectives-${activeUnit}`}
                {...register(`units.${activeUnit}.skill_objectives`)}
                placeholder="Skills should be mentioned in measurable terms (e.g., 'Ability to build and deploy a basic web application using Flask framework.' instead of just 'web development skills')."
                rows={3}
              />
              {errors.units?.[activeUnit]?.skill_objectives && (
                <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.skill_objectives?.message}</p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="mb-2" htmlFor={`interlink-topics-${activeUnit}`}>
                  Interlink of this unit topic(s) with other subject&apos;s topic (Optional)
                </Label>
                <Textarea
                  id={`interlink-topics-${activeUnit}`}
                  {...register(`units.${activeUnit}.interlink_topics`)}
                  placeholder="Describe connections with other subjects"
                  rows={3}
                />
              </div>

              <div>
                <Label className="mb-2" htmlFor={`topics-beyond-unit-${activeUnit}`}>
                  Topic beyond Unit Topics <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`topics-beyond-unit-${activeUnit}`}
                  {...register(`units.${activeUnit}.topics_beyond_unit`)}
                  placeholder="Enter topics beyond the unit syllabus"
                  rows={3}
                />
                {errors.units?.[activeUnit]?.topics_beyond_unit && (
                  <p className="text-red-500 text-sm mt-1">{errors.units[activeUnit]?.topics_beyond_unit?.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remarks */}
      <div>
        <Label className="mb-2" htmlFor="remarks">
          Remarks (Optional)
        </Label>
        <Textarea id="remarks" {...register("remarks")} placeholder="Any additional remarks for all units" rows={3} />
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          {lastSaved && <span className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="submit" disabled={isSaving} className="bg-[#1A5CA1] hover:bg-[#154A80]">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  )
}
