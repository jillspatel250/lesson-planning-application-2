//@ts-nocheck
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, CheckCircle, Upload, FileText, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { additionalInfoSchema, type AdditionalInfoFormValues } from "@/utils/schema"
import { saveAdditionalInfoForm } from "@/app/dashboard/actions/saveAdditionalInfoForm"
import { useDashboardContext } from "@/context/DashboardContext"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { saveFormDraft, loadFormDraft } from "@/app/dashboard/actions/saveFormDraft"

interface AdditionalInfoFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
}

interface FileData {
  name: string
  type: string
  size: number
  arrayBuffer: ArrayBuffer
}

const eventTypes = [
  "Expert Talk",
  "Workshop",
  "Seminar",
  "Webinar",
  "Competition",
  "Panel Discussion",
  "Round Table Discussion",
  "poster presentations",
  "project exhibitions",
  "Knowledge Sharing Session",
  "Debate",
  "Idea/Innovation Contest",
  "Other",
]

const targetAudienceOptions = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "Staff",
]

const skillMappingOptions = [
  "Problem Solving",
  "Critical Thinking",
  "Creativity",
  "Communication",
  "Collaboration",
  "Technical Skills",
  "Research Skills",
  "Analytical Skills",
  "Leadership",
  "Time Management",
  "Adaptability",
  "Self-Learning",
]

export default function AdditionalInfoForm({ lessonPlan, setLessonPlan }: AdditionalInfoFormProps) {
  const { userData } = useDashboardContext()
  const [isSaving, setIsSaving] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<{
    fast_learner?: FileData
    medium_learner?: FileData
    slow_learner?: FileData
  }>({})
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [existingFiles, setExistingFiles] = useState<{
    fast_learner_file_url?: string
    medium_learner_file_url?: string
    slow_learner_file_url?: string
  }>({
    fast_learner_file_url: lessonPlan?.additional_info?.fast_learner_file_url,
    medium_learner_file_url: lessonPlan?.additional_info?.medium_learner_file_url,
    slow_learner_file_url: lessonPlan?.additional_info?.slow_learner_file_url,
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      faculty_id: userData?.id || "",
      subject_id: lessonPlan?.subject?.id || "",
      classroom_conduct: lessonPlan?.additional_info?.classroom_conduct || "",
      attendance_policy: lessonPlan?.additional_info?.attendance_policy || "",
      lesson_planning_guidelines: lessonPlan?.additional_info?.lesson_planning_guidelines || "",
      cie_guidelines: lessonPlan?.additional_info?.cie_guidelines || "",
      self_study_guidelines: lessonPlan?.additional_info?.self_study_guidelines || "",
      topics_beyond_syllabus: lessonPlan?.additional_info?.topics_beyond_syllabus || "",
      reference_materials: lessonPlan?.additional_info?.reference_materials || "",
      academic_integrity: lessonPlan?.additional_info?.academic_integrity || "",
      communication_channels: lessonPlan?.additional_info?.communication_channels || "",
      interdisciplinary_integration: lessonPlan?.additional_info?.interdisciplinary_integration || "",
      fast_learner_planning: lessonPlan?.additional_info?.fast_learner_planning || "",
      medium_learner_planning: lessonPlan?.additional_info?.medium_learner_planning || "",
      slow_learner_planning: lessonPlan?.additional_info?.slow_learner_planning || "",
      events: lessonPlan?.additional_info?.events || [],
    },
  })

  const {
    fields: eventFields,
    append: appendEvent,
    remove: removeEvent,
  } = useFieldArray({
    control,
    name: "events",
  })

  const addEvent = () => {
    appendEvent({
      id: `event-${Date.now()}`,
      event_type: "Expert Talk",
      tentative_title: "",
      proposed_week: "",
      duration: 1,
      target_audience: [],
      mode_of_conduct: "Offline",
      expected_outcomes: "",
      proposed_speaker: "",
      skill_mapping: [],
    })
  }

  const handleFileUpload = async (learnerType: "fast_learner" | "medium_learner" | "slow_learner", file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload only PDF files")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB")
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()

      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        arrayBuffer: arrayBuffer,
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [learnerType]: fileData,
      }))

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.success(`${learnerType.replace("_", " ")} file selected for upload (${fileSizeMB}MB)`)
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error("Error processing file")
    }
  }

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const removeExistingFile = (learnerType: "fast_learner" | "medium_learner" | "slow_learner") => {
    setExistingFiles((prev) => ({
      ...prev,
      [`${learnerType}_file_url`]: undefined,
    }))
    toast.success("File marked for removal")
  }

  const removeFile = (learnerType: "fast_learner" | "medium_learner" | "slow_learner") => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[learnerType]
      return newFiles
    })
    toast.success("File removed")
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)

    try {
      const currentFormData = getValues()
      const formData = {
        ...currentFormData,
        uploaded_files: uploadedFiles,
      }

      const result = await saveFormDraft(userData?.id || "", lessonPlan?.subject?.id || "", "additional_info", formData)

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

  const onSubmit = async (data: AdditionalInfoFormValues) => {
    setIsSaving(true)
    setValidationError(null)

    try {
      // Include uploaded files in the form data
      const formDataWithFiles = {
        ...data,
        uploaded_files: uploadedFiles,
      }

      console.log("🚀 Submitting additional info form...")
      const result = await saveAdditionalInfoForm({
        faculty_id: userData?.id || "",
        subject_id: lessonPlan?.subject?.id || "",
        formData: formDataWithFiles,
      })

      if (result.success) {
        // Show success message
        toast.success("🎉 Lesson Plan Completed! Status: Submitted", {
          duration: 5000,
        })

        // Update the lesson plan state to reflect the new status
        setLessonPlan((prev: any) => ({
          ...prev,
          additional_info: result.data,
          status: "submitted",
        }))

        // Clear uploaded files after successful save
        setUploadedFiles({})

        // Set localStorage flag for immediate UI update based on subject code
        const subjectCode = lessonPlan?.subject?.code
        if (subjectCode) {
          localStorage.setItem(`${subjectCode}_submitted`, "true")
          // Trigger storage event for other tabs
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: `${subjectCode}_submitted`,
              newValue: "true",
            }),
          )
        }

        // Redirect to lesson plans page after a short delay
        setTimeout(() => {
          router.push("/dashboard/lesson-plans")
          router.refresh()
        }, 2000)
      } else {
        setValidationError(result.error || "Failed to save additional information")
        toast.error(result.error || "Failed to save additional information")
      }
    } catch (error) {
      console.error("Error saving additional info:", error)
      toast.error("An unexpected error occurred")
      setValidationError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const loadDraft = async () => {
      if (!userData?.id || !lessonPlan?.subject?.id) return

      try {
        const result = await loadFormDraft(userData.id, lessonPlan.subject.id, "additional_info")

        if (result.success && result.data) {
          const data = result.data

          // Reset form with loaded data
          reset({
            ...data,
            faculty_id: userData.id,
            subject_id: lessonPlan.subject.id,
          })

          // Restore uploaded files if any
          if (data.uploaded_files) {
            setUploadedFiles(data.uploaded_files)
          }

          toast.success("Draft loaded successfully")
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }

    loadDraft()
  }, [userData?.id, lessonPlan?.subject?.id, reset])

  // Check if all required fields are filled
  const watchedFields = watch([
    "classroom_conduct",
    "attendance_policy",
    "cie_guidelines",
    "self_study_guidelines",
    "topics_beyond_syllabus",
    "reference_materials",
    "academic_integrity",
    "communication_channels",
    "fast_learner_planning",
    "medium_learner_planning",
    "slow_learner_planning",
  ])

  // Check if all required text fields are filled
  const areTextFieldsValid = watchedFields.every((field) => field && field.trim().length > 0)

  // Check if all required files are uploaded (either existing or new)
  const areFilesValid =
    (existingFiles.fast_learner_file_url || uploadedFiles.fast_learner) &&
    (existingFiles.medium_learner_file_url || uploadedFiles.medium_learner) &&
    (existingFiles.slow_learner_file_url || uploadedFiles.slow_learner)

  // Form is valid only if both text fields and files are ready
  const isFormValid = areTextFieldsValid && areFilesValid

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Additional Planning Information</h3>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

  

      {/* Required Fields */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="classroom_conduct">
            Classroom Conduct and Instructions <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="classroom_conduct"
            placeholder="e.g. General expectations regarding student behavior, punctuality, discipline, and active participation."
            {...register("classroom_conduct")}
            className={`mt-2 ${errors.classroom_conduct ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.classroom_conduct && <p className="text-red-500 text-sm mt-1">{errors.classroom_conduct.message}</p>}
        </div>

        <div>
          <Label htmlFor="attendance_policy">
            Attendance Policy and Criteria <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="attendance_policy"
            placeholder="e.g. Minimum attendance requirement, how attendance will be recorded, and consequences of short attendance."
            {...register("attendance_policy")}
            className={`mt-2 ${errors.attendance_policy ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.attendance_policy && <p className="text-red-500 text-sm mt-1">{errors.attendance_policy.message}</p>}
        </div>

        <div>
          <Label htmlFor="lesson_planning_guidelines">Lesson Planning Guidelines (Optional)</Label>
          <Textarea
            id="lesson_planning_guidelines"
            placeholder="e.g. Overview of how lessons will be delivered etc."
            {...register("lesson_planning_guidelines")}
            className="mt-2"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="cie_guidelines">
            CIE Guidelines <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="cie_guidelines"
            placeholder='e.g. "Out of 5 CIEs conducted, the best 4 scores will be considered for final CIE calculation."'
            {...register("cie_guidelines")}
            className={`mt-2 ${errors.cie_guidelines ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.cie_guidelines && <p className="text-red-500 text-sm mt-1">{errors.cie_guidelines.message}</p>}
        </div>

        <div>
          <Label htmlFor="self_study_guidelines">
            Self-Study/Homework Guidelines <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="self_study_guidelines"
            placeholder="e.g. Expectations for self-study topics, how they will be assessed, and their contribution to internal evaluation."
            {...register("self_study_guidelines")}
            className={`mt-2 ${errors.self_study_guidelines ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.self_study_guidelines && (
            <p className="text-red-500 text-sm mt-1">{errors.self_study_guidelines.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="topics_beyond_syllabus">
            Topics Beyond Syllabus <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="topics_beyond_syllabus"
            placeholder="e.g. Identify the topics that go beyond the prescribed syllabus to enrich student learning."
            {...register("topics_beyond_syllabus")}
            className={`mt-2 ${errors.topics_beyond_syllabus ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.topics_beyond_syllabus && (
            <p className="text-red-500 text-sm mt-1">{errors.topics_beyond_syllabus.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reference_materials">
            Reference Materials and Tools <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reference_materials"
            placeholder="e.g. Mention textbooks, reference books, software tools, platforms used throughout the course."
            {...register("reference_materials")}
            className={`mt-2 ${errors.reference_materials ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.reference_materials && (
            <p className="text-red-500 text-sm mt-1">{errors.reference_materials.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="academic_integrity">
            Academic Integrity Policy <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="academic_integrity"
            placeholder="e.g. Guidelines regarding plagiarism, cheating in evaluations, and expectations for original work."
            {...register("academic_integrity")}
            className={`mt-2 ${errors.academic_integrity ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.academic_integrity && (
            <p className="text-red-500 text-sm mt-1">{errors.academic_integrity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="communication_channels">
            Communication Channels <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="communication_channels"
            placeholder="e.g. LMS will be the only official mode of communication for course announcements."
            {...register("communication_channels")}
            className={`mt-2 ${errors.communication_channels ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.communication_channels && (
            <p className="text-red-500 text-sm mt-1">{errors.communication_channels.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="interdisciplinary_integration">
            Interdisciplinary/Industry/Research Integration (Optional)
          </Label>
          <Textarea
            id="interdisciplinary_integration"
            placeholder="e.g. Mention of any real-world case studies, industry problems, or mini-research elements."
            {...register("interdisciplinary_integration")}
            className="mt-2"
            rows={4}
          />
        </div>
      </div>

      {/* Planning for Different Types of Learners - NOW REQUIRED */}
      <Card>
        <CardHeader>
          <CardTitle>Planning for Different Types of Learners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fast Learner Planning - REQUIRED */}
          <div>
            <Label htmlFor="fast_learner_planning">
              Planning for Fast Learners <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="fast_learner_planning"
              placeholder="Describe strategies, additional challenges, and advanced topics for fast learners"
              {...register("fast_learner_planning")}
              className={`mt-2 ${errors.fast_learner_planning ? "border-red-500" : ""}`}
              rows={4}
            />
            {errors.fast_learner_planning && (
              <p className="text-red-500 text-sm mt-1">{errors.fast_learner_planning.message}</p>
            )}

            {/* File Upload for Fast Learners */}
            <div className="mt-3">
              <Label className="text-sm font-medium">
                Tasks for Fast Learners (PDF Upload) <span className="text-red-500">*</span>
              </Label>

              {/* Show existing file if available */}
              {existingFiles.fast_learner_file_url && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Existing file uploaded ✓</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(existingFiles.fast_learner_file_url!, "fast_learner_tasks.pdf")}
                      >
                        Download
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingFile("fast_learner")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload new file */}
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload("fast_learner", file)
                  }}
                  className="hidden"
                  id="fast-learner-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("fast-learner-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {existingFiles.fast_learner_file_url ? "Replace PDF" : "Upload PDF"}
                </Button>
                {uploadedFiles.fast_learner && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{uploadedFiles.fast_learner.name} (Ready to upload) ✓</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile("fast_learner")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {!existingFiles.fast_learner_file_url && !uploadedFiles.fast_learner && (
                <p className="text-red-500 text-sm mt-1">PDF file is required for fast learners</p>
              )}
            </div>
          </div>

          {/* Medium Learner Planning - REQUIRED */}
          <div>
            <Label htmlFor="medium_learner_planning">
              Planning for Medium Learners <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="medium_learner_planning"
              placeholder="Describe strategies, regular pace activities, and standard learning approaches for medium learners"
              {...register("medium_learner_planning")}
              className={`mt-2 ${errors.medium_learner_planning ? "border-red-500" : ""}`}
              rows={4}
            />
            {errors.medium_learner_planning && (
              <p className="text-red-500 text-sm mt-1">{errors.medium_learner_planning.message}</p>
            )}

            {/* File Upload for Medium Learners */}
            <div className="mt-3">
              <Label className="text-sm font-medium">
                Tasks for Medium Learners (PDF Upload) <span className="text-red-500">*</span>
              </Label>

              {/* Show existing file if available */}
              {existingFiles.medium_learner_file_url && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Existing file uploaded ✓</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(existingFiles.medium_learner_file_url!, "medium_learner_tasks.pdf")}
                      >
                        Download
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingFile("medium_learner")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload new file */}
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload("medium_learner", file)
                  }}
                  className="hidden"
                  id="medium-learner-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("medium-learner-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {existingFiles.medium_learner_file_url ? "Replace PDF" : "Upload PDF"}
                </Button>
                {uploadedFiles.medium_learner && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      {uploadedFiles.medium_learner.name} (Ready to upload) ✓
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile("medium_learner")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {!existingFiles.medium_learner_file_url && !uploadedFiles.medium_learner && (
                <p className="text-red-500 text-sm mt-1">PDF file is required for medium learners</p>
              )}
            </div>
          </div>

          {/* Slow Learner Planning - REQUIRED */}
          <div>
            <Label htmlFor="slow_learner_planning">
              Planning for Slow Learners <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="slow_learner_planning"
              placeholder="Describe strategies, additional support, remedial activities, and step-by-step approaches for slow learners"
              {...register("slow_learner_planning")}
              className={`mt-2 ${errors.slow_learner_planning ? "border-red-500" : ""}`}
              rows={4}
            />
            {errors.slow_learner_planning && (
              <p className="text-red-500 text-sm mt-1">{errors.slow_learner_planning.message}</p>
            )}

            {/* File Upload for Slow Learners */}
            <div className="mt-3">
              <Label className="text-sm font-medium">
                Tasks for Slow Learners (PDF Upload) <span className="text-red-500">*</span>
              </Label>

              {/* Show existing file if available */}
              {existingFiles.slow_learner_file_url && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Existing file uploaded ✓</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(existingFiles.slow_learner_file_url!, "slow_learner_tasks.pdf")}
                      >
                        Download
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingFile("slow_learner")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload new file */}
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload("slow_learner", file)
                  }}
                  className="hidden"
                  id="slow-learner-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("slow-learner-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {existingFiles.slow_learner_file_url ? "Replace PDF" : "Upload PDF"}
                </Button>
                {uploadedFiles.slow_learner && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{uploadedFiles.slow_learner.name} (Ready to upload) ✓</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile("slow_learner")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {!existingFiles.slow_learner_file_url && !uploadedFiles.slow_learner && (
                <p className="text-red-500 text-sm mt-1">PDF file is required for slow learners</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Planning Section (Optional) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Event Planning Details (Optional)</CardTitle>
            <Button type="button" onClick={addEvent} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {eventFields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Event {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeEvent(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Event Type</Label>
                  <Select
                    value={watch(`events.${index}.event_type`)}
                    onValueChange={(value) => setValue(`events.${index}.event_type`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Tentative Event Title</Label>
                  <Input {...register(`events.${index}.tentative_title`)} placeholder="Enter event title" />
                </div>

                <div>
                  <Label className="mb-2">Proposed Week</Label>
                  <Input {...register(`events.${index}.proposed_week`)} placeholder="e.g. Week 5" />
                </div>

                <div>
                  <Label className="mb-2">Duration (hours)</Label>
                  <Input type="number" min="1" {...register(`events.${index}.duration`)} placeholder="1" />
                </div>

                <div>
                  <Label className="mb-2">Mode of Conduct</Label>
                  <Select
                    value={watch(`events.${index}.mode_of_conduct`)}
                    onValueChange={(value) => setValue(`events.${index}.mode_of_conduct`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Proposed Speaker (Optional)</Label>
                  <Input {...register(`events.${index}.proposed_speaker`)} placeholder="Enter speaker name" />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2">Target Audience</Label>
                  <div className="flex flex-wrap gap-2">
                    {targetAudienceOptions.map((option) => (
                      <div key={option} className="space-x-2">
                        <Checkbox
                          id={`target_audience_${index}_${option.replace(" ", "_").toLowerCase()}`}
                          checked={watch(`events.${index}.target_audience`)?.includes(option)}
                          onCheckedChange={(checked) => {
                            const currentValues = watch(`events.${index}.target_audience`) || []
                            if (checked) {
                              setValue(`events.${index}.target_audience`, [...currentValues, option])
                            } else {
                              setValue(
                                `events.${index}.target_audience`,
                                currentValues.filter((v: string) => v !== option),
                              )
                            }
                          }}
                        />
                        <Label
                          htmlFor={`target_audience_${index}_${option.replace(" ", "_").toLowerCase()}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2">Expected Outcomes</Label>
                  <Textarea
                    {...register(`events.${index}.expected_outcomes`)}
                    placeholder="Write in brief, how this event will benefit students."
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2">Skill Mapping</Label>
                  <div className="flex flex-wrap gap-2">
                    {skillMappingOptions.map((skill) => (
                      <div key={skill} className="space-x-2">
                        <Checkbox
                          id={`skill_mapping_${index}_${skill.replace(" ", "_").toLowerCase()}`}
                          checked={watch(`events.${index}.skill_mapping`)?.includes(skill)}
                          onCheckedChange={(checked) => {
                            const currentValues = watch(`events.${index}.skill_mapping`) || []
                            if (checked) {
                              setValue(`events.${index}.skill_mapping`, [...currentValues, skill])
                            } else {
                              setValue(
                                `events.${index}.skill_mapping`,
                                currentValues.filter((v: string) => v !== skill),
                              )
                            }
                          }}
                        />
                        <Label
                          htmlFor={`skill_mapping_${index}_${skill.replace(" ", "_").toLowerCase()}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {eventFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No events added yet. Click "Add Event" to create an event.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          {lastSaved && <span className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !isFormValid}
            className={`${
              isFormValid ? "bg-[#1A5CA1] hover:bg-[#154A80]" : "bg-gray-400 cursor-not-allowed"
            } transition-colors duration-200`}
          >
            {isSaving ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}