// @ts-nocheck
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { InfoIcon, PlusCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { saveGeneralDetailsForm } from "@/app/dashboard/actions/saveGeneralDetailsForm"
import { useDashboardContext } from "@/context/DashboardContext"
import { saveFormDraft, loadFormDraft } from "@/app/dashboard/actions/saveFormDraft"

// DIRECT SUPABASE IMPORT - NO UTILITY FUNCTION
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

interface GeneralDetailsFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
  openPdfViewer: (file: string) => void
}

// Create Supabase client directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

export default function GeneralDetailsForm({ lessonPlan, setLessonPlan, openPdfViewer }: GeneralDetailsFormProps) {
  const { userData } = useDashboardContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [facultyTermDates, setFacultyTermDates] = useState<{
    termStartDate: string
    termEndDate: string
  }>({
    termStartDate: "",
    termEndDate: "",
  })

  // Debug state
  const [debugInfo, setDebugInfo] = useState("")

  // Form state
  const [division, setDivision] = useState(lessonPlan?.division || "Div 1 & 2")
  const [lectureHours, setLectureHours] = useState(lessonPlan?.lecture_hours || 0)
  const [labHours, setLabHours] = useState(lessonPlan?.lab_hours || 0)
  const [credits, setCredits] = useState(lessonPlan?.credits || 0)
  const [coursePrerequisites, setCoursePrerequisites] = useState(lessonPlan?.course_prerequisites || "")
  const [coursePrerequisitesMaterials, setCoursePrerequisitesMaterials] = useState(
    lessonPlan?.course_prerequisites_materials || "",
  )
  const [courseOutcomes, setCourseOutcomes] = useState(lessonPlan?.courseOutcomes || [{ id: uuidv4(), text: "" }])
  const [remarks, setRemarks] = useState(lessonPlan?.remarks || "")
  const [detailsSubmmitted, setDetailsSubmitted] = useState(lessonPlan?.general_details_completed || false)

  const [divisionError, setDivisionError] = useState("")
  const [lectureHoursError, setLectureHoursError] = useState("")
  const [labHoursError, setLabHoursError] = useState("")
  const [creditsError, setCreditsError] = useState("")
  const [coursePrerequisitesError, setCoursePrerequisitesError] = useState("")
  const [coursePrerequisitesMaterialsError, setCoursePrerequisitesMaterialsError] = useState("")
  const [courseOutcomesError, setCourseOutcomesError] = useState("")

  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // FIXED: Check if subject is practical-only
  const isPracticalOnly = lessonPlan?.subject?.is_practical === true && lessonPlan?.subject?.is_theory === false

  // FIXED DATABASE QUERY FUNCTION
  // const testDatabaseQuery = async () => {
  //   try {
  //     setDebugInfo("🔍 Testing database query...")

  //     if (!lessonPlan?.subject?.code) {
  //       setDebugInfo("❌ No subject code available")
  //       return
  //     }

  //     const subjectCode = lessonPlan.subject.code
  //     setDebugInfo(`🔍 Querying for subject code: ${subjectCode}`)

  //     // SIMPLER QUERY - Just get the metadata
  //     const { data, error } = await supabase.from("subjects").select("metadata").eq("code", subjectCode).single()

  //     if (error) {
  //       setDebugInfo(`❌ Database error: ${JSON.stringify(error)}`)
  //       return
  //     }

  //     if (!data) {
  //       setDebugInfo(`❌ No subject found with code: ${subjectCode}`)
  //       return
  //     }

  //     setDebugInfo(`✅ Found subject metadata: ${JSON.stringify(data.metadata, null, 2)}`)

  //     // Extract dates from metadata
  //     let metadata = data.metadata
  //     if (typeof metadata === "string") {
  //       try {
  //         metadata = JSON.parse(metadata)
  //       } catch (e) {
  //         setDebugInfo(`❌ Error parsing metadata: ${e.message}`)
  //         return
  //       }
  //     }

  //     const startDate = metadata?.term_start_date
  //     const endDate = metadata?.term_end_date

  //     setDebugInfo(`📅 Extracted dates: start=${startDate}, end=${endDate}`)

  //     // If dates are found, set them
  //     if (startDate) {
  //       setFacultyTermDates((prev) => ({
  //         ...prev,
  //         termStartDate: startDate,
  //       }))
  //       setDebugInfo((prev) => prev + "\n✅ Start date set!")
  //     }

  //     if (endDate) {
  //       setFacultyTermDates((prev) => ({
  //         ...prev,
  //         termEndDate: endDate,
  //       }))
  //       setDebugInfo((prev) => prev + "\n✅ End date set!")
  //     }

  //     if (startDate || endDate) {
  //       toast.success("Term dates loaded successfully!")
  //     } else {
  //       setDebugInfo((prev) => prev + "\n⚠️ No dates found in metadata")
  //     }
  //   } catch (error) {
  //     setDebugInfo(`💥 Error: ${error.message}\n${error.stack}`)
  //   }
  // }

  // FIXED ADD SAMPLE DATES FUNCTION
  const addSampleTermDates = async () => {
    try {
      setDebugInfo("📝 Adding sample term dates...")

      if (!lessonPlan?.subject?.code) {
        setDebugInfo("❌ No subject code available")
        return
      }

      const subjectCode = lessonPlan.subject.code

      // First get the current metadata
      const { data: currentData, error: fetchError } = await supabase
        .from("subjects")
        .select("metadata")
        .eq("code", subjectCode)
        .single()

      if (fetchError) {
        setDebugInfo(`❌ Fetch error: ${JSON.stringify(fetchError)}`)
        return
      }

      // Parse existing metadata or create new object
      let metadata = currentData?.metadata || {}
      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata)
        } catch (e) {
          metadata = {}
        }
      }

      // Add term dates to metadata
      metadata.term_start_date = "01-05-2025"
      metadata.term_end_date = "01-10-2025"

      setDebugInfo(`📝 Updating with metadata: ${JSON.stringify(metadata, null, 2)}`)

      // Update the subject with sample term dates
      const { data: updateData, error: updateError } = await supabase
        .from("subjects")
        .update({ metadata })
        .eq("code", subjectCode)
        .select()

      if (updateError) {
        setDebugInfo(`❌ Update error: ${JSON.stringify(updateError)}`)
        return
      }

      setDebugInfo(`✅ Sample dates added: ${JSON.stringify(updateData, null, 2)}`)

      // Set the dates in state
      setFacultyTermDates({
        termStartDate: "01-05-2025",
        termEndDate: "01-10-2025",
      })

      toast.success("Sample term dates added!")
    } catch (error) {
      setDebugInfo(`💥 Error: ${error.message}\n${error.stack}`)
    }
  }

    // Add page refresh effect for faculty members
    useEffect(() => {
      // Check if the user is a faculty member
      if (userData?.role === "faculty") {
        // Using sessionStorage to ensure refresh happens only once per session
        const hasRefreshed = sessionStorage.getItem("hasRefreshedGeneralDetails")
  
        if (!hasRefreshed) {
          // Set the flag before refreshing to prevent infinite refresh loop
          sessionStorage.setItem("hasRefreshedGeneralDetails", "true")
  
          // Use setTimeout to ensure the component is fully mounted before refreshing
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
      }
    }, [userData?.role]) // Only re-run if the user role changes


  // // DIRECT FETCH ON LOAD
  // useEffect(() => {
  //   const fetchDates = async () => {
  //     try {
  //       if (!lessonPlan?.subject?.code) return

  //       const { data, error } = await supabase
  //         .from("subjects")
  //         .select("metadata")
  //         .eq("code", lessonPlan.subject.code)
  //         .single()

  //       if (error || !data) return

  //       let metadata = data.metadata
  //       if (typeof metadata === "string") {
  //         try {
  //           metadata = JSON.parse(metadata)
  //         } catch (e) {
  //           return
  //         }
  //       }

  //       if (metadata?.term_start_date) {
  //         setFacultyTermDates((prev) => ({
  //           ...prev,
  //           termStartDate: metadata.term_start_date,
  //         }))
  //       }

  //       if (metadata?.term_end_date) {
  //         setFacultyTermDates((prev) => ({
  //           ...prev,
  //           termEndDate: metadata.term_end_date,
  //         }))
  //       }
  //     } catch (error) {
  //       console.error("Error fetching dates:", error)
  //     }
  //   }

  //   fetchDates()
  // }, [lessonPlan?.subject?.code])


  useEffect(() => {
    const fetchDates = async () => {
      try {
        if (!lessonPlan?.subject?.code) {
          console.log("❌ No subject code available")
          return
        }
  
        console.log("🔍 Fetching dates for subject:", lessonPlan.subject.code)
  
        const { data, error } = await supabase
          .from("subjects")
          .select("metadata")
          .eq("code", lessonPlan.subject.code)
          .single()
  
        if (error) {
          console.error("❌ Database error:", error)
          return
        }
  
        if (!data) {
          console.log("❌ No subject found")
          return
        }
  
        console.log("📊 Raw metadata:", data.metadata)
  
        let metadata = data.metadata
  
        // Handle different metadata formats
        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata)
            console.log("📊 Parsed metadata:", metadata)
          } catch (e) {
            console.error("❌ Error parsing metadata:", e)
            return
          }
        }
  
        // Extract dates with multiple possible formats
        const startDate = metadata?.term_start_date || metadata?.termStartDate
        const endDate = metadata?.term_end_date || metadata?.termEndDate
  
        console.log("📅 Extracted dates:", { startDate, endDate })
  
        if (startDate) {
          setFacultyTermDates((prev) => ({
            ...prev,
            termStartDate: startDate,
          }))
          console.log("✅ Start date set:", startDate)
        }
  
        if (endDate) {
          setFacultyTermDates((prev) => ({
            ...prev,
            termEndDate: endDate,
          }))
          console.log("✅ End date set:", endDate)
        }
  
        if (startDate || endDate) {
          // toast.success("Term dates loaded from database!")
        } else {
          console.log("⚠️ No dates found in metadata")
        }
      } catch (error) {
        console.error("💥 Error fetching dates:", error)
      }
    }
  
    // Add a small delay to ensure component is mounted
    const timer = setTimeout(fetchDates, 100)
    return () => clearTimeout(timer)
  }, [lessonPlan?.subject?.code])








  const handleAddCourseOutcome = () => {
    setCourseOutcomes([...courseOutcomes, { id: uuidv4(), text: "" }])
  }

  const handleRemoveCourseOutcome = (index: number) => {
    if (courseOutcomes.length > 1) {
      setCourseOutcomes(courseOutcomes.filter((_, i) => i !== index))
    }
  }

  const handleCourseOutcomeChange = (index: number, value: string) => {
    const updatedOutcomes = [...courseOutcomes]
    updatedOutcomes[index].text = value
    setCourseOutcomes(updatedOutcomes)
  }

  const resetErrors = () => {
    setDivisionError("")
    setLectureHoursError("")
    setLabHoursError("")
    setCreditsError("")
    setCoursePrerequisitesError("")
    setCoursePrerequisitesMaterialsError("")
    setCourseOutcomesError("")
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)

    try {
      const formData = {
        division,
        lectureHours,
        labHours,
        credits,
        coursePrerequisites,
        coursePrerequisitesMaterials,
        courseOutcomes,
        remarks,
        facultyTermDates,
      }

      const result = await saveFormDraft(userData?.id || "", lessonPlan?.subject?.id || "", "general_details", formData)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      resetErrors()
      let hasErrors = false

      if (!division) {
        setDivisionError("Division is required")
        hasErrors = true
      }

      // FIXED: Only validate lecture hours for non-practical-only subjects
      if (!isPracticalOnly && lectureHours < 1) {
        setLectureHoursError("Lecture hours must be at least 1")
        hasErrors = true
      }

      if (labHours < 0) {
        setLabHoursError("Lab hours cannot be negative")
        hasErrors = true
      }

      if (credits < 1) {
        setCreditsError("Credits must be at least 1")
        hasErrors = true
      }

      if (!coursePrerequisites) {
        setCoursePrerequisitesError("Course prerequisites are required")
        hasErrors = true
      }

      if (!coursePrerequisitesMaterials) {
        setCoursePrerequisitesMaterialsError("Course prerequisites materials are required")
        hasErrors = true
      }

      if (courseOutcomes.length === 0 || courseOutcomes.some((co) => !co.text)) {
        setCourseOutcomesError("Please enter all CO's details")
        hasErrors = true
      }

      if (hasErrors) {
        setIsSubmitting(false)
        toast.error("Please resolve validation errors before submitting")
        return
      }

      const formData = {
        subject_id: lessonPlan?.subject?.id,
        division: lessonPlan?.division,
        lecture_hours: isPracticalOnly ? 0 : Number(lectureHours), // FIXED: Set to 0 for practical-only subjects
        lab_hours: Number(labHours),
        credits: Number(credits),
        term_start_date: facultyTermDates.termStartDate,
        term_end_date: facultyTermDates.termEndDate,
        course_prerequisites: coursePrerequisites,
        course_prerequisites_materials: coursePrerequisitesMaterials,
        courseOutcomes,
        remarks,
      }

      const result = await saveGeneralDetailsForm(formData)

      if (result.success) {
        setLessonPlan((prev: any) => ({
          ...prev,
          division,
          lecture_hours: isPracticalOnly ? 0 : Number(lectureHours), // FIXED: Set to 0 for practical-only subjects
          lab_hours: Number(labHours),
          credits: Number(credits),
          term_start_date: facultyTermDates.termStartDate,
          term_end_date: facultyTermDates.termEndDate,
          course_prerequisites: coursePrerequisites,
          course_prerequisites_materials: coursePrerequisitesMaterials,
          courseOutcomes,
          remarks,
          general_details_completed: true,
          status: "in_progress",
        }))

        toast.success("General details saved successfully! Status: In Progress")

        setTimeout(() => {
          const nextTab = lessonPlan?.subject?.is_theory
            ? document.querySelector('[value="unit-planning"]')
            : document.querySelector('[value="practical-planning"]')
          if (nextTab) {
            ;(nextTab as HTMLElement).click()
          }
        }, 500)
      } else {
        toast.error(result.error || "Failed to save general details")
        console.error("Save error:", result)
      }
    } catch (error) {
      console.error("Error saving general details:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const loadDraft = async () => {
      if (!userData?.id || !lessonPlan?.subject?.id) return

      try {
        const result = await loadFormDraft(userData.id, lessonPlan.subject.id, "general_details")

        if (result.success && result.data) {
          const data = result.data
          if (data.division) setDivision(data.division)
          if (data.lectureHours) setLectureHours(data.lectureHours)
          if (data.labHours) setLabHours(data.labHours)
          if (data.credits) setCredits(data.credits)
          if (data.coursePrerequisites) setCoursePrerequisites(data.coursePrerequisites)
          if (data.coursePrerequisitesMaterials) setCoursePrerequisitesMaterials(data.coursePrerequisitesMaterials)
          if (data.courseOutcomes) setCourseOutcomes(data.courseOutcomes)
          if (data.remarks) setRemarks(data.remarks)
          if (data.facultyTermDates) setFacultyTermDates(data.facultyTermDates)

          toast.success("Draft loaded successfully")
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }

    loadDraft()
  }, [userData?.id, lessonPlan?.subject?.id])

  console.log(lessonPlan)

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowInstructions(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Guidelines for learning materials</h2>
              <p className="mb-4">
                It is mandatory to provide specific learning materials by ensuring the quality of content. Avoid
                providing vague references such as just the name of a textbook, a chapter title, or a general media/web
                link. Instead, ensure that the materials are clearly and precisely mentioned as follows:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">I. Book:</h3>
                  <p>
                    Include the book title, edition, author, chapter number and name, and the specific page numbers to
                    be referred.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Example: "Machine Learning" (2nd Edition) by Tom M. Mitchell, Chapter 5: Neural Networks, Pages
                    123–140
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">II. Video:</h3>
                  <p>
                    Provide the exact video link, and if only a portion is relevant, specify the start and end
                    timestamps.
                  </p>
                  <p className="text-sm text-gray-600 italic">Example: [YouTube link], watch from 02:15 to 10:30</p>
                </div>

                <div>
                  <h3 className="font-semibold">III. Web Material:</h3>
                  <p>Provide the full and direct URL to the web page/article that should be studied.</p>
                  <p className="text-sm text-gray-600 italic">
                    Example: [https://www.analyticsvidhya.com/neural-network-basics]
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">IV. Research Papers / Journal Articles:</h3>
                  <p>
                    Provide the full title, author(s), publication year, journal/conference name, and either the PDF or
                    DOI/link.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Example: "A Survey on Deep Learning for Image Captioning" by Y. Zhang et al., IEEE Access, 2020,
                    DOI: 10.1109/ACCESS.2020.299234
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">V. Lecture Notes (Prepared by Faculty):</h3>
                  <p>
                    If you create custom lecture notes, share the direct file or link, and mention specific slide/page
                    numbers to be studied (If required to maintain continuity).
                  </p>
                  <p className="text-sm text-gray-600 italic">Example: Note 1: "Introduction to Classification"</p>
                </div>
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

      <div className="grid grid-cols-3 gap-6">
        <div>
          <Label htmlFor="subject-teacher-name">Subject Teacher Name</Label>
          <Input id="subject-teacher-name" value={lessonPlan?.faculty?.name || ""} disabled className="mt-1" />
        </div>
        <div>
          <Label htmlFor="subject-code">Subject Code</Label>
          <Input id="subject-code" value={lessonPlan?.subject?.code || ""} disabled className="mt-1" />
        </div>
        <div>
          <Label htmlFor="subject-name">Subject Name</Label>
          <Input id="subject-name" value={lessonPlan?.subject?.name || ""} disabled className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" value={lessonPlan?.subject?.department?.name || ""} disabled className="mt-1" />
        </div>
        <div>
          <Label htmlFor="semester">Semester</Label>
          <Input id="semester" value={lessonPlan?.subject?.semester || ""} disabled className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="division">Division</Label>
            <Input id="semester" value={lessonPlan?.division || ""} disabled className="mt-1" />
          </div>
          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="mt-1"
            />
            {creditsError && <p className="text-red-500 text-xs mt-1">{creditsError}</p>}
          </div>
        </div>
      </div>

      {/* FIXED: Conditional rendering based on subject type */}
      <div className={`grid ${isPracticalOnly ? "grid-cols-3" : "grid-cols-4"} gap-6`}>
        {/* FIXED: Only show lecture hours for non-practical-only subjects */}
        {!isPracticalOnly && (
          <div>
            <Label htmlFor="lecture-hour">Lecture Hour</Label>
            <Input
              id="lecture-hour"
              type="number"
              value={lectureHours}
              onChange={(e) => setLectureHours(Number(e.target.value))}
              className="mt-1"
            />
            {lectureHoursError && <p className="text-red-500 text-xs mt-1">{lectureHoursError}</p>}
          </div>
        )}
        <div>
          <Label htmlFor="lab-hour">Lab Hour</Label>
          <Input
            id="lab-hour"
            type="number"
            value={labHours}
            onChange={(e) => setLabHours(Number(e.target.value))}
            className="mt-1"
          />
          {labHoursError && <p className="text-red-500 text-xs mt-1">{labHoursError}</p>}
        </div>
        <div>
          <Label htmlFor="term-start-date">Term Start Date</Label>
          <Input
            id="term-start-date"
            type="text"
            value={facultyTermDates.termStartDate || "Not set by HOD"}
            disabled
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="term-end-date">Term End Date</Label>
          <Input
            id="term-end-date"
            type="text"
            value={facultyTermDates.termEndDate || "Not set by HOD"}
            disabled
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="course-prerequisites">
            Course Prerequisites<span className="text-red-500">*</span>
          </Label>
        </div>
        <Textarea
          id="course-prerequisites"
          placeholder="List the topics or concepts students are expected to be familiar with before studying this course."
          value={coursePrerequisites}
          onChange={(e) => setCoursePrerequisites(e.target.value)}
          className="mt-2"
          rows={4}
        />
        {coursePrerequisitesError && <p className="text-red-500 text-xs mt-1">{coursePrerequisitesError}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="course-prerequisites-materials">
            Course Prerequisites materials <span className="text-red-500">*</span>
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-600"
            onClick={() => setShowInstructions(true)}
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            View Instructions
          </Button>
        </div>
        <Textarea
          id="course-prerequisites-materials"
          placeholder="List any materials students should review before starting this course."
          value={coursePrerequisitesMaterials}
          onChange={(e) => setCoursePrerequisitesMaterials(e.target.value)}
          className="mt-1"
          rows={4}
        />
        {coursePrerequisitesMaterialsError && (
          <p className="text-red-500 text-xs mt-1">{coursePrerequisitesMaterialsError}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Course Outcomes (CO)</Label>

        {courseOutcomes.map((outcome, index) => (
          <div key={outcome.id} className="flex items-center gap-4">
            <div className="w-24">
              <Label>CO {index + 1}</Label>
            </div>
            <div className="flex-1">
              <Input
                placeholder={`Enter Course Outcome ${index + 1}`}
                value={outcome.text}
                onChange={(e) => handleCourseOutcomeChange(index, e.target.value)}
              />
            </div>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCourseOutcome(index)}
                className="text-red-500"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
        {courseOutcomesError && <p className="text-red-500 text-xs mt-1">{courseOutcomesError}</p>}

        <Button type="button" onClick={handleAddCourseOutcome} className="bg-[#1A5CA1] hover:bg-[#154A80]">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Course Outcome
        </Button>
      </div>

      <div>
        <Label htmlFor="remarks">Remarks (Optional)</Label>
        <Textarea
          id="remarks"
          placeholder="Any additional remarks or notes"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {lastSaved && <span className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="submit" className="bg-[#1A5CA1] hover:bg-[#154A80]" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  )
}