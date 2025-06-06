// @ts-nocheck
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, InfoIcon, X, Users } from "lucide-react"
import { toast } from "sonner"
import {
  practicalPlanningSchema,
  type PracticalPlanningFormValues,
  practicalPedagogyOptions,
  evaluationMethodOptions,
  bloomsTaxonomyOptions,
  skillMappingOptions,
  psoOptions,
  peoOptions,
} from "@/utils/schema"
import { generateWeekOptions } from "@/utils/dateUtils"
import { savePracticalPlanningForm } from "@/app/dashboard/actions/savePracticalPlanningForm"
import { useDashboardContext } from "@/context/DashboardContext"
import { Badge } from "@/components/ui/badge"
import { v4 as uuidv4 } from 'uuid';

interface PracticalPlanningFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
}

export default function PracticalPlanningForm({ lessonPlan, setLessonPlan }: PracticalPlanningFormProps) {
  const { userData } = useDashboardContext()
  const [isSaving, setIsSaving] = useState(false)
  const [activePractical, setActivePractical] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [allFaculty, setAllFaculty] = useState<any[]>([])

  // State persistence cache for practicals
  const [practicalDataCache, setPracticalDataCache] = useState<{ [key: number]: any }>({})

  // Generate week options from term dates
  const weekOptions = generateWeekOptions(lessonPlan?.term_start_date || "", lessonPlan?.term_end_date || "")

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PracticalPlanningFormValues>({
    resolver: zodResolver(practicalPlanningSchema),
    defaultValues: {
      faculty_id: userData?.id || "",
      subject_id: lessonPlan?.subject?.id || "",
      practicals: lessonPlan?.practicals || [
        {
          id: uuidv4(),
          practical_aim: "",
          associated_units: [],
          probable_week: "",
          lab_hours: 2,
          software_hardware_requirements: "",
          practical_tasks: "",
          evaluation_methods: [],
          other_evaluation_method: "",
          practical_pedagogy: "",
          other_pedagogy: "",
          reference_material: "",
          co_mapping: [],
          pso_mapping: [],
          peo_mapping: [],
          blooms_taxonomy: [],
          skill_mapping: [],
          skill_objectives: "",
          assigned_faculty_id: userData?.id || "",
          isNew: true,
        },
      ],
      remarks: lessonPlan?.practical_remarks || "",
    },
  })

  const {
    fields: practicalFields,
    append: appendPractical,
    remove: removePractical,
  } = useFieldArray({
    control,
    name: "practicals",
  })

  // Save current practical data to cache
  const saveCurrentPracticalToCache = () => {
    const currentPracticalData = getValues(`practicals.${activePractical}`)
    if (currentPracticalData) {
      setPracticalDataCache((prev) => ({
        ...prev,
        [activePractical]: { ...currentPracticalData },
      }))

      // Also update lesson plan state immediately
      setLessonPlan((prev: any) => {
        const updatedPracticals = [...(prev.practicals || [])]
        if (updatedPracticals[activePractical]) {
          updatedPracticals[activePractical] = { ...currentPracticalData }
        }
        return {
          ...prev,
          practicals: updatedPracticals,
        }
      })
    }
  }

  // Load practical data from cache
  const loadPracticalFromCache = (practicalIndex: number) => {
    const cachedData = practicalDataCache[practicalIndex]
    if (cachedData) {
      // Set all form values for the practical
      Object.keys(cachedData).forEach((key) => {
        setValue(`practicals.${practicalIndex}.${key}`, cachedData[key])
      })
    }
  }

  // Enhanced practical switching with state persistence
  const switchToPractical = (newPracticalIndex: number) => {
    if (newPracticalIndex === activePractical) return

    // Save current practical data before switching
    saveCurrentPracticalToCache()

    // Switch to new practical
    setActivePractical(newPracticalIndex)

    // Load cached data for new practical after a brief delay to ensure state update
    setTimeout(() => {
      loadPracticalFromCache(newPracticalIndex)
    }, 50)
  }

  // Initialize cache with existing practical data on mount
  useEffect(() => {
    if (lessonPlan?.practicals && lessonPlan.practicals.length > 0) {
      const initialCache: { [key: number]: any } = {}
      lessonPlan.practicals.forEach((practical: any, index: number) => {
        initialCache[index] = { ...practical }
      })
      setPracticalDataCache(initialCache)
    }
  }, [lessonPlan?.practicals])

  // Auto-save current practical data when form values change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith(`practicals.${activePractical}`)) {
        // Debounce the save operation
        const timeoutId = setTimeout(() => {
          saveCurrentPracticalToCache()
        }, 500)

        return () => clearTimeout(timeoutId)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, activePractical, getValues, setLessonPlan])

  // Check for faculty sharing when component mounts
  useEffect(() => {
    const loadFacultySharing = async () => {
      if (!lessonPlan?.subject?.id) return

      try {
        console.log("Checking faculty sharing for subject:", lessonPlan.subject.id)

        // Call the API route directly from client
        const response = await fetch(`/api/faculty-sharing?subjectId=${lessonPlan.subject.id}`)
        const result = await response.json()

        console.log("Practical Faculty sharing result:", result)

        if (result.success) {
          setIsSharing(result.isSharing)
          setAllFaculty(result.allFaculty)
        } else {
          console.error("Failed to check faculty sharing:", result.error)
        }
      } catch (error) {
        console.error("Error loading faculty sharing:", error)
      }
    }

    loadFacultySharing()
  }, [lessonPlan?.subject?.id])

  const addPractical = () => {
    // Save current practical before adding new one
    saveCurrentPracticalToCache()

    const newPractical = {
      id: uuidv4(),
      practical_aim: "",
      associated_units: [],
      probable_week: "",
      lab_hours: 2,
      software_hardware_requirements: "",
      practical_tasks: "",
      evaluation_methods: [],
      other_evaluation_method: "",
      practical_pedagogy: "",
      other_pedagogy: "",
      reference_material: "",
      co_mapping: [],
      pso_mapping: [],
      peo_mapping: [],
      blooms_taxonomy: [],
      skill_mapping: [],
      skill_objectives: "",
      assigned_faculty_id: userData?.id || "",
      isNew: true,
    }

    appendPractical(newPractical)

    // Cache the new practical
    const newIndex = practicalFields.length
    setPracticalDataCache((prev) => ({
      ...prev,
      [newIndex]: { ...newPractical },
    }))

    setActivePractical(newIndex)
  }

  const removePracticalHandler = (index: number) => {
    if (practicalFields.length === 1) {
      toast.error("You must have at least one practical")
      return
    }

    // Remove from cache
    setPracticalDataCache((prev) => {
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

    removePractical(index)

    if (activePractical >= index && activePractical > 0) {
      setActivePractical(activePractical - 1)
    }
  }

  const handleAssociatedUnitsChange = (practicalIndex: number, unitId: string, checked: boolean) => {
    const currentUnits = getValues(`practicals.${practicalIndex}.associated_units`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.associated_units`, [...currentUnits, unitId])
    } else {
      setValue(
        `practicals.${practicalIndex}.associated_units`,
        currentUnits.filter((u) => u !== unitId),
      )
    }
  }

  const handleEvaluationMethodChange = (practicalIndex: number, method: string, checked: boolean) => {
    const currentMethods = getValues(`practicals.${practicalIndex}.evaluation_methods`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.evaluation_methods`, [...currentMethods, method])
    } else {
      setValue(
        `practicals.${practicalIndex}.evaluation_methods`,
        currentMethods.filter((m) => m !== method),
      )
    }
  }

  const handleCOMapping = (practicalIndex: number, co: string, checked: boolean) => {
    const currentCOs = getValues(`practicals.${practicalIndex}.co_mapping`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.co_mapping`, [...currentCOs, co])
    } else {
      setValue(
        `practicals.${practicalIndex}.co_mapping`,
        currentCOs.filter((c) => c !== co),
      )
    }
  }

  const handlePSOMapping = (practicalIndex: number, pso: string, checked: boolean) => {
    const currentPSOs = getValues(`practicals.${practicalIndex}.pso_mapping`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.pso_mapping`, [...currentPSOs, pso])
    } else {
      setValue(
        `practicals.${practicalIndex}.pso_mapping`,
        currentPSOs.filter((p) => p !== pso),
      )
    }
  }

  const handlePEOMapping = (practicalIndex: number, peo: string, checked: boolean) => {
    const currentPEOs = getValues(`practicals.${practicalIndex}.peo_mapping`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.peo_mapping`, [...currentPEOs, peo])
    } else {
      setValue(
        `practicals.${practicalIndex}.peo_mapping`,
        currentPEOs.filter((p) => p !== peo),
      )
    }
  }

  const handleBloomsTaxonomyChange = (practicalIndex: number, taxonomy: string, checked: boolean) => {
    const currentTaxonomy = getValues(`practicals.${practicalIndex}.blooms_taxonomy`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.blooms_taxonomy`, [...currentTaxonomy, taxonomy])
    } else {
      setValue(
        `practicals.${practicalIndex}.blooms_taxonomy`,
        currentTaxonomy.filter((t) => t !== taxonomy),
      )
    }
  }

  const handleSkillMapping = (practicalIndex: number, skill: string, checked: boolean) => {
    const currentSkills = getValues(`practicals.${practicalIndex}.skill_mapping`) || []
    if (checked) {
      setValue(`practicals.${practicalIndex}.skill_mapping`, [...currentSkills, skill])
    } else {
      setValue(
        `practicals.${practicalIndex}.skill_mapping`,
        currentSkills.filter((s) => s !== skill),
      )
    }
  }

  // Update the handleFacultyAssignment function to store both faculty ID and name
  const handleFacultyAssignment = (practicalIndex: number, facultyId: string) => {
    // Get faculty name
    const faculty = allFaculty.find((f) => f.id === facultyId)
    const facultyName = faculty ? faculty.name : "Unknown Faculty"

    // Update the form state
    setValue(`practicals.${practicalIndex}.assigned_faculty_id`, facultyId)
    setValue(`practicals.${practicalIndex}.faculty_name`, facultyName)
  }

  const onSubmit = async (data: PracticalPlanningFormValues) => {
    setIsSaving(true)

    // Save current practical to cache before submitting
    saveCurrentPracticalToCache()

    // Merge cached data with form data
    const mergedPracticals = data.practicals.map((practical, index) => ({
      ...practical,
      ...(practicalDataCache[index] || {}),
    }))

    const finalData = {
      ...data,
      practicals: mergedPracticals,
    }

    // Validate faculty assignments for shared subjects
    if (isSharing) {
      const unassignedPracticals = finalData.practicals.filter((practical) => !practical.assigned_faculty_id)
      if (unassignedPracticals.length > 0) {
        const practicalNumbers = unassignedPracticals
          .map((_, idx) => {
            const originalIndex = finalData.practicals.findIndex((p) => p.id === unassignedPracticals[idx].id)
            return originalIndex + 1
          })
          .join(", ")

        showFormDialog(
          "Faculty Assignment Required",
          `Please assign faculty to Practical ${practicalNumbers} before saving.`,
        )
        setIsSaving(false)
        return
      }
    } else {
      // For non-shared subjects, automatically assign current faculty to all practicals
      finalData.practicals = finalData.practicals.map((practical) => ({
        ...practical,
        assigned_faculty_id: practical.assigned_faculty_id || userData?.id || "",
        faculty_name: practical.faculty_name || userData?.name || "Current Faculty",
      }))
    }

    try {
      const result = await savePracticalPlanningForm({
        faculty_id: userData?.id || "",
        subject_id: lessonPlan?.subject?.id || "",
        formData: finalData,
      })

      if (result.success) {
        toast.success("Practical planning saved successfully!")
        setLessonPlan((prev: any) => ({
          ...prev,
          practicals: finalData.practicals,
          practical_remarks: finalData.remarks,
          practical_planning_completed: true,
        }))
      } else {
        if (result.error?.includes("Dear Professor")) {
          showFormDialog("Validation Required", result.error)
        } else {
          toast.error(result.error || "Failed to save practical planning")
        }
      }
    } catch (error) {
      console.error("Error saving practical planning:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const showValidationDialog = (message: string) => {
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

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.remove()
      }
    })
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

  // Generate CO options based on course outcomes
  const courseOutcomes = lessonPlan?.courseOutcomes || []
  const coOptions = courseOutcomes.map((_: any, index: number) => `CO${index + 1}`)

  // Get units for associated units dropdown
  const units = lessonPlan?.units || []

  // Get faculty name by ID
  const getFacultyName = (facultyId: string) => {
    const faculty = allFaculty.find((f) => f.id === facultyId)
    return faculty ? faculty.name : "Unknown Faculty"
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Practical Planning Guidelines</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowInstructions(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Guidelines for Practical Planning</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Practical Aim:</h3>
                  <p>
                    Provide a clear and concise description of what students will achieve in this practical session.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Associated Units:</h3>
                  <p>
                    Select one or more units that this practical session relates to. Multiple units can be selected for
                    comprehensive practicals.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Software/Hardware Requirements:</h3>
                  <p>List required software/tools, e.g., Visual Studio, Code::Blocks, Python, Blockchain Simulation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Sharing Information */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Practical Planning Details</h3>
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
            </div>
          )}

          <Button type="submit" disabled={isSaving} className="bg-[#1A5CA1] hover:bg-[#154A80]">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Practical Details"}
          </Button>
        </div>
      </div>

      {/* Practical Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 flex-wrap">
          {practicalFields.map((practical, index) => (
            <Button
              key={practical.id}
              type="button"
              variant={activePractical === index ? "default" : "outline"}
              className={`${activePractical === index ? "bg-[#1A5CA1] hover:bg-[#154A80]" : ""} relative`}
              onClick={() => switchToPractical(index)}
              title={
                isSharing && watch(`practicals.${index}.assigned_faculty_id`)
                  ? `Assigned to: ${getFacultyName(watch(`practicals.${index}.assigned_faculty_id`))}`
                  : undefined
              }
            >
              <span>Practical {index + 1}</span>
              {isSharing && watch(`practicals.${index}.assigned_faculty_id`) && (
                <Badge variant="outline" className="ml-2 text-xs bg-white">
                  {getFacultyName(watch(`practicals.${index}.assigned_faculty_id`))
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Badge>
              )}
            </Button>
          ))}
          <Button type="button" variant="outline" onClick={addPractical}>
            <Plus className="h-4 w-4 mr-1" />
            Add Practical
          </Button>
        </div>
        {practicalFields.length > 1 && (
          <Button
            type="button"
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removePracticalHandler(activePractical)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Practical
          </Button>
        )}
      </div>

      {/* Faculty Assignment Summary - Only visible when sharing is enabled */}
      {isSharing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Faculty Assignment Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {practicalFields.map((practical, index) => {
              const assignedFacultyId = watch(`practicals.${index}.assigned_faculty_id`)
              const facultyName = getFacultyName(assignedFacultyId)
              return (
                <div key={practical.id} className="flex items-center justify-between bg-white rounded p-2 border">
                  <span className="text-sm font-medium">Practical {index + 1}</span>
                  <Badge variant={assignedFacultyId ? "default" : "secondary"} className="text-xs">
                    {facultyName}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {practicalFields[activePractical] && (
        <>
          {/* Faculty Sharing Status for Practicals - Only show when sharing is enabled */}
          {isSharing && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800">Shared Subject - Practical Assignment</h4>
                    <p className="text-sm text-purple-600">
                      Assign each practical to the appropriate faculty member for this shared subject.
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-purple-600 text-white px-3 py-1">
                  {allFaculty.length} Faculty Sharing
                </Badge>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span>Practical {activePractical + 1}</span>
                </div>

                {/* Faculty Assignment Dropdown - Only show when sharing is enabled */}
                {isSharing && (
                  <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">Faculty Assignment:</span>
                    <Select
                      value={watch(`practicals.${activePractical}.assigned_faculty_id`) || ""}
                      onValueChange={(value) => handleFacultyAssignment(activePractical, value)}
                    >
                      <SelectTrigger className="w-[200px] bg-white border-purple-300">
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
              {/* Rest of the practical form content remains the same */}
              {/* Practical Aim */}
              <div>
                <Label htmlFor={`practical-aim-${activePractical}`}>
                  Practical Aim <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`practical-aim-${activePractical}`}
                  {...register(`practicals.${activePractical}.practical_aim`)}
                  placeholder="Enter the aim of this practical session"
                  rows={3}
                />
                {errors.practicals?.[activePractical]?.practical_aim && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.practical_aim?.message}
                  </p>
                )}
              </div>

              {/* Associated Units */}
              <div>
                <Label>
                  Associated Unit(s) <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {units.map((unit: any, index: number) => (
                    <div key={unit.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`unit-${activePractical}-${unit.id}`}
                        checked={watch(`practicals.${activePractical}.associated_units`)?.includes(unit.id) || false}
                        onCheckedChange={(checked) =>
                          handleAssociatedUnitsChange(activePractical, unit.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`unit-${activePractical}-${unit.id}`} className="text-sm">
                        Unit {index + 1} - {unit.unit_name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.practicals?.[activePractical]?.associated_units && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.associated_units?.message}
                  </p>
                )}
              </div>

              {/* Probable Week and Lab Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`probable-week-${activePractical}`}>
                    Probable Week <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch(`practicals.${activePractical}.probable_week`) || ""}
                    onValueChange={(value) => setValue(`practicals.${activePractical}.probable_week`, value)}
                  >
                    <SelectTrigger id={`probable-week-${activePractical}`}>
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekOptions.map((week) => (
                        <SelectItem key={week.value} value={week.value}>
                          {week.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.practicals?.[activePractical]?.probable_week && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.practicals[activePractical]?.probable_week?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`lab-hours-${activePractical}`}>
                    Lab Hours <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`lab-hours-${activePractical}`}
                    type="number"
                    min="1"
                    {...register(`practicals.${activePractical}.lab_hours`)}
                    placeholder="Enter lab hours"
                  />
                  {errors.practicals?.[activePractical]?.lab_hours && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.practicals[activePractical]?.lab_hours?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Software/Hardware Requirements */}
              <div>
                <Label htmlFor={`software-hardware-${activePractical}`}>
                  Software/Hardware Requirements <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`software-hardware-${activePractical}`}
                  {...register(`practicals.${activePractical}.software_hardware_requirements`)}
                  placeholder="List required software/tools, e.g., Visual Studio, Code::Blocks, Python, Blockchain Simulation Tools, ML Libraries, etc."
                  rows={3}
                />
                {errors.practicals?.[activePractical]?.software_hardware_requirements && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.software_hardware_requirements?.message}
                  </p>
                )}
              </div>

              {/* Practical Tasks/Problem Statement */}
              <div>
                <Label htmlFor={`practical-tasks-${activePractical}`}>
                  Practical Tasks/Problem Statement <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`practical-tasks-${activePractical}`}
                  {...register(`practicals.${activePractical}.practical_tasks`)}
                  placeholder="Provide a clear and concise problem/task description that students will solve or implement during the lab."
                  rows={4}
                />
                {errors.practicals?.[activePractical]?.practical_tasks && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.practical_tasks?.message}
                  </p>
                )}
              </div>

              {/* Evaluation Methods */}
              <div>
                <Label>
                  Evaluation Method <span className="text-red-500">*</span> (Select one or more)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {evaluationMethodOptions.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`evaluation-${activePractical}-${method}`}
                        checked={watch(`practicals.${activePractical}.evaluation_methods`)?.includes(method) || false}
                        onCheckedChange={(checked) =>
                          handleEvaluationMethodChange(activePractical, method, checked as boolean)
                        }
                      />
                      <Label htmlFor={`evaluation-${activePractical}-${method}`} className="text-sm">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
                {watch(`practicals.${activePractical}.evaluation_methods`)?.includes("Other") && (
                  <div className="mt-3">
                    <Label htmlFor={`other-evaluation-${activePractical}`}>Other Evaluation Method</Label>
                    <Input
                      id={`other-evaluation-${activePractical}`}
                      {...register(`practicals.${activePractical}.other_evaluation_method`)}
                      placeholder="Specify other evaluation method"
                    />
                  </div>
                )}
                {errors.practicals?.[activePractical]?.evaluation_methods && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.evaluation_methods?.message}
                  </p>
                )}
              </div>

              {/* Practical Pedagogy */}
              <div>
                <Label htmlFor={`practical-pedagogy-${activePractical}`}>
                  Practical Pedagogy <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch(`practicals.${activePractical}.practical_pedagogy`) || ""}
                  onValueChange={(value) => setValue(`practicals.${activePractical}.practical_pedagogy`, value)}
                >
                  <SelectTrigger id={`practical-pedagogy-${activePractical}`}>
                    <SelectValue placeholder="Select pedagogy" />
                  </SelectTrigger>
                  <SelectContent>
                    {practicalPedagogyOptions.map((pedagogy) => (
                      <SelectItem key={pedagogy} value={pedagogy}>
                        {pedagogy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {watch(`practicals.${activePractical}.practical_pedagogy`) === "Other" && (
                  <div className="mt-3">
                    <Label htmlFor={`other-pedagogy-${activePractical}`}>Other Pedagogy</Label>
                    <Input
                      id={`other-pedagogy-${activePractical}`}
                      {...register(`practicals.${activePractical}.other_pedagogy`)}
                      placeholder="Specify other pedagogy"
                    />
                  </div>
                )}
                {errors.practicals?.[activePractical]?.practical_pedagogy && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.practical_pedagogy?.message}
                  </p>
                )}
              </div>

              {/* Reference Material */}
              <div>
                <Label htmlFor={`reference-material-${activePractical}`}>
                  Reference Material for Practical <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`reference-material-${activePractical}`}
                  {...register(`practicals.${activePractical}.reference_material`)}
                  placeholder="Dataset, Lab manual links, sample codes, documentation links, etc."
                  rows={3}
                />
                {errors.practicals?.[activePractical]?.reference_material && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.reference_material?.message}
                  </p>
                )}
              </div>

              {/* CO/PSO/PEO Mapping */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>
                    CO Mapping <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {coOptions.map((co) => (
                      <div key={co} className="flex items-center space-x-2">
                        <Checkbox
                          id={`co-${activePractical}-${co}`}
                          checked={watch(`practicals.${activePractical}.co_mapping`)?.includes(co) || false}
                          onCheckedChange={(checked) => handleCOMapping(activePractical, co, checked as boolean)}
                        />
                        <Label htmlFor={`co-${activePractical}-${co}`} className="text-sm">
                          {co}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.practicals?.[activePractical]?.co_mapping && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.practicals[activePractical]?.co_mapping?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>PSO Mapping (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {psoOptions.map((pso) => (
                      <div key={pso} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pso-${activePractical}-${pso}`}
                          checked={watch(`practicals.${activePractical}.pso_mapping`)?.includes(pso) || false}
                          onCheckedChange={(checked) => handlePSOMapping(activePractical, pso, checked as boolean)}
                        />
                        <Label htmlFor={`pso-${activePractical}-${pso}`} className="text-sm">
                          {pso}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>PEO Mapping (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {peoOptions.map((peo) => (
                      <div key={peo} className="flex items-center space-x-2">
                        <Checkbox
                          id={`peo-${activePractical}-${peo}`}
                          checked={watch(`practicals.${activePractical}.peo_mapping`)?.includes(peo) || false}
                          onCheckedChange={(checked) => handlePEOMapping(activePractical, peo, checked as boolean)}
                        />
                        <Label htmlFor={`peo-${activePractical}-${peo}`} className="text-sm">
                          {peo}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bloom's Taxonomy */}
              <div>
                <Label>
                  Bloom's Taxonomy <span className="text-red-500">*</span> (Multiple selection)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {bloomsTaxonomyOptions.map((taxonomy) => (
                    <div key={taxonomy} className="flex items-center space-x-2">
                      <Checkbox
                        id={`blooms-${activePractical}-${taxonomy}`}
                        checked={watch(`practicals.${activePractical}.blooms_taxonomy`)?.includes(taxonomy) || false}
                        onCheckedChange={(checked) =>
                          handleBloomsTaxonomyChange(activePractical, taxonomy, checked as boolean)
                        }
                      />
                      <Label htmlFor={`blooms-${activePractical}-${taxonomy}`} className="text-sm">
                        {taxonomy}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.practicals?.[activePractical]?.blooms_taxonomy && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.blooms_taxonomy?.message}
                  </p>
                )}
              </div>

              {/* Skill Mapping */}
              <div>
                <Label>
                  Skill Mapping <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {skillMappingOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${activePractical}-${skill}`}
                        checked={watch(`practicals.${activePractical}.skill_mapping`)?.includes(skill) || false}
                        onCheckedChange={(checked) => handleSkillMapping(activePractical, skill, checked as boolean)}
                      />
                      <Label htmlFor={`skill-${activePractical}-${skill}`} className="text-sm">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.practicals?.[activePractical]?.skill_mapping && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.skill_mapping?.message}
                  </p>
                )}
              </div>

              {/* Skill Objectives */}
              <div>
                <Label htmlFor={`skill-objectives-${activePractical}`}>
                  Objective for Selected Skills <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`skill-objectives-${activePractical}`}
                  {...register(`practicals.${activePractical}.skill_objectives`)}
                  placeholder="Skills should be mentioned in measurable terms (e.g., 'Ability to implement and test sorting algorithms with time complexity analysis.' instead of just 'programming skills')."
                  rows={3}
                />
                {errors.practicals?.[activePractical]?.skill_objectives && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.practicals[activePractical]?.skill_objectives?.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Remarks */}
      <div>
        <Label htmlFor="remarks">Remarks (Optional)</Label>
        <Textarea
          id="remarks"
          {...register("remarks")}
          placeholder="Any additional remarks for all practicals"
          rows={3}
        />
      </div>
    </form>
  )
}