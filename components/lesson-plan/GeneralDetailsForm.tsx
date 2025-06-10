// //@ts-nocheck
// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { InfoIcon, PlusCircle, XCircle, Calendar } from "lucide-react"
// import { toast } from "sonner"
// import { v4 as uuidv4 } from "uuid"
// import { saveGeneralDetailsForm } from "@/app/dashboard/actions/saveGeneralDetailsForm"
// import { formatDateForDisplay } from "@/utils/schema"

// interface GeneralDetailsFormProps {
//   lessonPlan: any
//   setLessonPlan: React.Dispatch<React.SetStateAction<any>>
//   openPdfViewer: (file: string) => void
// }

// export default function GeneralDetailsForm({ lessonPlan, setLessonPlan, openPdfViewer }: GeneralDetailsFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [showInstructions, setShowInstructions] = useState(false)

//   // Form state
//   const [division, setDivision] = useState(lessonPlan?.division || "Div 1 & 2")
//   const [lectureHours, setLectureHours] = useState(lessonPlan?.subject?.lecture_hours || 0)
//   const [labHours, setLabHours] = useState(lessonPlan?.subject?.lab_hours || 0)
//   const [credits, setCredits] = useState(lessonPlan?.subject?.credits || 0)

//   // Initialize dates from lessonPlan
//   const [termStartDate, setTermStartDate] = useState(() => {
//     if (lessonPlan?.term_start_date) {
//       // If it's already a Date object
//       if (lessonPlan.term_start_date instanceof Date) {
//         return lessonPlan.term_start_date.toISOString().split("T")[0]
//       }

//       // If it's in ISO format (YYYY-MM-DD)
//       if (typeof lessonPlan.term_start_date === "string" && lessonPlan.term_start_date.includes("-")) {
//         return lessonPlan.term_start_date.split("T")[0]
//       }

//       // If it's in DDMMYYYY format
//       if (typeof lessonPlan.term_start_date === "string" && lessonPlan.term_start_date.length === 8) {
//         const day = lessonPlan.term_start_date.slice(0, 2)
//         const month = lessonPlan.term_start_date.slice(2, 4)
//         const year = lessonPlan.term_start_date.slice(4, 8)
//         return `${year}-${month}-${day}`
//       }
//     }
//     return ""
//   })

//   const [termEndDate, setTermEndDate] = useState(() => {
//     if (lessonPlan?.term_end_date) {
//       // If it's already a Date object
//       if (lessonPlan.term_end_date instanceof Date) {
//         return lessonPlan.term_end_date.toISOString().split("T")[0]
//       }

//       // If it's in ISO format (YYYY-MM-DD)
//       if (typeof lessonPlan.term_end_date === "string" && lessonPlan.term_end_date.includes("-")) {
//         return lessonPlan.term_end_date.split("T")[0]
//       }

//       // If it's in DDMMYYYY format
//       if (typeof lessonPlan.term_end_date === "string" && lessonPlan.term_end_date.length === 8) {
//         const day = lessonPlan.term_end_date.slice(0, 2)
//         const month = lessonPlan.term_end_date.slice(2, 4)
//         const year = lessonPlan.term_end_date.slice(4, 8)
//         return `${year}-${month}-${day}`
//       }
//     }
//     return ""
//   })

//   const [coursePrerequisites, setCoursePrerequisites] = useState(lessonPlan?.course_prerequisites || "")
//   const [coursePrerequisitesMaterials, setCoursePrerequisitesMaterials] = useState(
//     lessonPlan?.course_prerequisites_materials || "",
//   )
//   const [courseOutcomes, setCourseOutcomes] = useState(lessonPlan?.courseOutcomes || [{ id: uuidv4(), text: "" }])
//   const [remarks, setRemarks] = useState(lessonPlan?.remarks || "")

//   const [divisionError, setDivisionError] = useState("")
//   const [lectureHoursError, setLectureHoursError] = useState("")
//   const [labHoursError, setLabHoursError] = useState("")
//   const [creditsError, setCreditsError] = useState("")
//   const [termStartDateError, setTermStartDateError] = useState("")
//   const [termEndDateError, setTermEndDateError] = useState("")
//   const [coursePrerequisitesError, setCoursePrerequisitesError] = useState("")
//   const [coursePrerequisitesMaterialsError, setCoursePrerequisitesMaterialsError] = useState("")
//   const [courseOutcomesError, setCourseOutcomesError] = useState("")

//   const handleAddCourseOutcome = () => {
//     setCourseOutcomes([...courseOutcomes, { id: uuidv4(), text: "" }])
//   }

//   const handleRemoveCourseOutcome = (index: number) => {
//     if (courseOutcomes.length > 1) {
//       setCourseOutcomes(courseOutcomes.filter((_, i) => i !== index))
//     }
//   }

//   const handleCourseOutcomeChange = (index: number, value: string) => {
//     const updatedOutcomes = [...courseOutcomes]
//     updatedOutcomes[index].text = value
//     setCourseOutcomes(updatedOutcomes)
//   }

//   const resetErrors = () => {
//     setDivisionError("")
//     setLectureHoursError("")
//     setLabHoursError("")
//     setCreditsError("")
//     setTermStartDateError("")
//     setTermEndDateError("")
//     setCoursePrerequisitesError("")
//     setCoursePrerequisitesMaterialsError("")
//     setCourseOutcomesError("")
//   }

//   // Format date for display (DD/MM/YYYY)
//   const formatDateForUI = (isoDate: string): string => {
//     if (!isoDate) return ""

//     try {
//       const date = new Date(isoDate)
//       return formatDateForDisplay(date)
//     } catch (error) {
//       console.error("Error formatting date:", error)
//       return ""
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       // Reset all error states
//       resetErrors()

//       // Validate form data
//       let hasErrors = false

//       if (!division) {
//         setDivisionError("Division is required")
//         hasErrors = true
//       }

//       if (lectureHours < 1) {
//         setLectureHoursError("Lecture hours must be at least 1")
//         hasErrors = true
//       }

//       if (labHours < 0) {
//         setLabHoursError("Lab hours cannot be negative")
//         hasErrors = true
//       }

//       if (credits < 1) {
//         setCreditsError("Credits must be at least 1")
//         hasErrors = true
//       }

//       if (!termStartDate) {
//         setTermStartDateError("Term start date is required")
//         hasErrors = true
//       }

//       if (!termEndDate) {
//         setTermEndDateError("Term end date is required")
//         hasErrors = true
//       }

//       // Validate date range
//       if (termStartDate && termEndDate) {
//         const startDate = new Date(termStartDate)
//         const endDate = new Date(termEndDate)

//         if (startDate >= endDate) {
//           setTermEndDateError("End date must be after start date")
//           hasErrors = true
//         }
//       }

//       if (!coursePrerequisites) {
//         setCoursePrerequisitesError("Course prerequisites are required")
//         hasErrors = true
//       }

//       if (!coursePrerequisitesMaterials) {
//         setCoursePrerequisitesMaterialsError("Course prerequisites materials are required")
//         hasErrors = true
//       }

//       if (courseOutcomes.length === 0 || courseOutcomes.some((co) => !co.text)) {
//         setCourseOutcomesError("Please enter all CO's details")
//         hasErrors = true
//       }

//       if (hasErrors) {
//         setIsSubmitting(false)
//         toast.error("Please resolve validation errors before submitting")
//         return
//       }

//       // Prepare form data with Date objects
//       const formData = {
//         subject_id: lessonPlan?.subject?.id,
//         division,
//         lecture_hours: Number(lectureHours),
//         lab_hours: Number(labHours),
//         credits: Number(credits),
//         term_start_date: new Date(termStartDate), // Convert to Date object
//         term_end_date: new Date(termEndDate), // Convert to Date object
//         course_prerequisites: coursePrerequisites,
//         course_prerequisites_materials: coursePrerequisitesMaterials,
//         courseOutcomes,
//         remarks,
//       }

//       // Actually save to database
//       const result = await saveGeneralDetailsForm(formData)

//       if (result.success) {
//         // Update the lesson plan state with the new values
//         setLessonPlan((prev: any) => ({
//           ...prev,
//           division,
//           lecture_hours: Number(lectureHours),
//           lab_hours: Number(labHours),
//           credits: Number(credits),
//           term_start_date: new Date(termStartDate),
//           term_end_date: new Date(termEndDate),
//           course_prerequisites: coursePrerequisites,
//           course_prerequisites_materials: coursePrerequisitesMaterials,
//           courseOutcomes,
//           remarks,
//           general_details_completed: true,
//         }))

//         toast.success(result.message || "General details saved successfully")

//         // Automatically navigate to the Unit Planning tab after saving
//         // This will trigger the parent component to change tabs
//         setTimeout(() => {
//           const unitPlanningTab = document.querySelector('[value="unit-planning"]') as HTMLElement
//           if (unitPlanningTab) {
//             unitPlanningTab.click()
//           }
//         }, 500)
//       } else {
//         toast.error(result.error || "Failed to save general details")
//         console.error("Save error:", result)
//       }
//     } catch (error) {
//       console.error("Error saving general details:", error)
//       toast.error("An unexpected error occurred")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="p-6 space-y-6">
//       {/* Instructions Modal */}
//       {showInstructions && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={() => setShowInstructions(false)}>
//                 <XCircle className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-6 overflow-auto">
//               <h2 className="text-xl font-bold mb-4">Guidelines for learning materials</h2>
//               <p className="mb-4">
//                 It is mandatory to provide specific learning materials by ensuring the quality of content. Avoid
//                 providing vague references such as just the name of a textbook, a chapter title, or a general media/web
//                 link. Instead, ensure that the materials are clearly and precisely mentioned as follows:
//               </p>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold">I. Book:</h3>
//                   <p>
//                     Include the book title, edition, author, chapter number and name, and the specific page numbers to
//                     be referred.
//                   </p>
//                   <p className="text-sm text-gray-600 italic">
//                     Example: "Machine Learning" (2nd Edition) by Tom M. Mitchell, Chapter 5: Neural Networks, Pages
//                     123–140
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">II. Video:</h3>
//                   <p>
//                     Provide the exact video link, and if only a portion is relevant, specify the start and end
//                     timestamps.
//                   </p>
//                   <p className="text-sm text-gray-600 italic">Example: [YouTube link], watch from 02:15 to 10:30</p>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">III. Web Material:</h3>
//                   <p>Provide the full and direct URL to the web page/article that should be studied.</p>
//                   <p className="text-sm text-gray-600 italic">
//                     Example: [https://www.analyticsvidhya.com/neural-network-basics]
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">IV. Research Papers / Journal Articles:</h3>
//                   <p>
//                     Provide the full title, author(s), publication year, journal/conference name, and either the PDF or
//                     DOI/link.
//                   </p>
//                   <p className="text-sm text-gray-600 italic">
//                     Example: "A Survey on Deep Learning for Image Captioning" by Y. Zhang et al., IEEE Access, 2020,
//                     DOI: 10.1109/ACCESS.2020.299234
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">V. Lecture Notes (Prepared by Faculty):</h3>
//                   <p>
//                     If you create custom lecture notes, share the direct file or link, and mention specific slide/page
//                     numbers to be studied (If required to maintain continuity).
//                   </p>
//                   <p className="text-sm text-gray-600 italic">Example: Note 1: "Introduction to Classification"</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={() => setShowInstructions(false)}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-3 gap-6">
//         <div>
//           <Label htmlFor="subject-teacher-name">Subject Teacher Name</Label>
//           <Input id="subject-teacher-name" value={lessonPlan?.faculty?.name || ""} disabled className="mt-1" />
//         </div>
//         <div>
//           <Label htmlFor="subject-code">Subject Code</Label>
//           <Input id="subject-code" value={lessonPlan?.subject?.code || ""} disabled className="mt-1" />
//         </div>
//         <div>
//           <Label htmlFor="subject-name">Subject Name</Label>
//           <Input id="subject-name" value={lessonPlan?.subject?.name || ""} disabled className="mt-1" />
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-6">
//         <div>
//           <Label htmlFor="department">Department</Label>
//           <Input id="department" value={lessonPlan?.subject?.department?.name || ""} disabled className="mt-1" />
//         </div>
//         <div>
//           <Label htmlFor="semester">Semester</Label>
//           <Input id="semester" value={lessonPlan?.subject?.semester || ""} disabled className="mt-1" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="division">Division</Label>
//             <Select value={division} onValueChange={setDivision}>
//               <SelectTrigger id="division" className="mt-1">
//                 <SelectValue placeholder="Select Division" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Div 1 & 2">Div 1 & 2</SelectItem>
//                 <SelectItem value="Div 1">Div 1</SelectItem>
//                 <SelectItem value="Div 2">Div 2</SelectItem>
//               </SelectContent>
//             </Select>
//             {divisionError && <p className="text-red-500 text-xs mt-1">{divisionError}</p>}
//           </div>
//           <div>
//             <Label htmlFor="credits">Credits</Label>
//             <Input
//               id="credits"
//               type="number"
//               value={credits}
//               onChange={(e) => setCredits(Number(e.target.value))}
//               className="mt-1"
//             />
//             {creditsError && <p className="text-red-500 text-xs mt-1">{creditsError}</p>}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-4 gap-6">
//         <div>
//           <Label htmlFor="lecture-hour">Lecture Hour/week</Label>
//           <Input
//             id="lecture-hour"
//             type="number"
//             value={lectureHours}
//             onChange={(e) => setLectureHours(Number(e.target.value))}
//             className="mt-1"
//           />
//           {lectureHoursError && <p className="text-red-500 text-xs mt-1">{lectureHoursError}</p>}
//         </div>
//         <div>
//           <Label htmlFor="lab-hour">Lab Hour/week</Label>
//           <Input
//             id="lab-hour"
//             type="number"
//             value={labHours}
//             onChange={(e) => setLabHours(Number(e.target.value))}
//             className="mt-1"
//           />
//           {labHoursError && <p className="text-red-500 text-xs mt-1">{labHoursError}</p>}
//         </div>
//         <div>
//           <Label htmlFor="term-start-date">Term Start Date</Label>
//           <div className="relative">
//             <Input
//               id="term-start-date"
//               type="date"
//               value={termStartDate}
//               onChange={(e) => setTermStartDate(e.target.value)}
//               className="mt-1"
//             />
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
//               <Calendar className="h-4 w-4" />
//             </div>
//           </div>
//           {termStartDateError && <p className="text-red-500 text-xs mt-1">{termStartDateError}</p>}
//           {/* {termStartDate && <p className="text-xs text-gray-500 mt-1">{formatDateForUI(termStartDate)}</p>} */}
//         </div>
//         <div>
//           <Label htmlFor="term-end-date">Term End Date</Label>
//           <div className="relative">
//             <Input
//               id="term-end-date"
//               type="date"
//               value={termEndDate}
//               onChange={(e) => setTermEndDate(e.target.value)}
//               className="mt-1"
//             />
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
//               <Calendar className="h-4 w-4" />
//             </div>
//           </div>
//           {termEndDateError && <p className="text-red-500 text-xs mt-1">{termEndDateError}</p>}
//           {/* {termEndDate && <p className="text-xs text-gray-500 mt-1">{formatDateForUI(termEndDate)}</p>} */}
//         </div>
//       </div>

//       <div>
//         <div className="flex items-center justify-between">
//           <Label htmlFor="course-prerequisites">Course Prerequisites</Label>
//         </div>
//         <Textarea
//           id="course-prerequisites"
//           placeholder="List the topics or concepts students are expected to be familiar with before studying this course."
//           value={coursePrerequisites}
//           onChange={(e) => setCoursePrerequisites(e.target.value)}
//           className="mt-2"
//           rows={4}
//         />
//         {coursePrerequisitesError && <p className="text-red-500 text-xs mt-1">{coursePrerequisitesError}</p>}
//       </div>

//       <div>
//         <div className="flex items-center justify-between">
//           <Label htmlFor="course-prerequisites-materials">Course Prerequisites materials</Label>
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="text-blue-600"
//             onClick={() => setShowInstructions(true)}
//           >
//             <InfoIcon className="h-4 w-4 mr-1" />
//             View Instructions
//           </Button>
//         </div>
//         <Textarea
//           id="course-prerequisites-materials"
//           placeholder="List any materials students should review before starting this course."
//           value={coursePrerequisitesMaterials}
//           onChange={(e) => setCoursePrerequisitesMaterials(e.target.value)}
//           className="mt-1"
//           rows={4}
//         />
//         {coursePrerequisitesMaterialsError && (
//           <p className="text-red-500 text-xs mt-1">{coursePrerequisitesMaterialsError}</p>
//         )}
//       </div>

//       <div className="space-y-4">
//         <Label>Course Outcomes (CO)</Label>

//         {courseOutcomes.map((outcome, index) => (
//           <div key={outcome.id} className="flex items-center gap-4">
//             <div className="w-24">
//               <Label>CO {index + 1}</Label>
//             </div>
//             <div className="flex-1">
//               <Input
//                 placeholder={`Enter Course Outcome ${index + 1}`}
//                 value={outcome.text}
//                 onChange={(e) => handleCourseOutcomeChange(index, e.target.value)}
//               />
//             </div>
//             {index > 0 && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => handleRemoveCourseOutcome(index)}
//                 className="text-red-500"
//               >
//                 <XCircle className="h-5 w-5" />
//               </Button>
//             )}
//           </div>
//         ))}
//         {courseOutcomesError && <p className="text-red-500 text-xs mt-1">{courseOutcomesError}</p>}

//         <Button type="button" onClick={handleAddCourseOutcome} className="bg-[#1A5CA1] hover:bg-[#154A80]">
//           <PlusCircle className="h-4 w-4 mr-2" />
//           Add Course Outcome
//         </Button>
//       </div>

//       <div>
//         <Label htmlFor="remarks">Remarks (Optional)</Label>
//         <Textarea
//           id="remarks"
//           placeholder="Any additional remarks or notes"
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//           className="mt-1"
//           rows={3}
//         />
//       </div>

//       <div className="flex justify-end">
//         <Button type="submit" className="bg-[#1A5CA1] hover:bg-[#154A80]" disabled={isSubmitting}>
//           {isSubmitting ? "Saving..." : "Save General Details"}
//         </Button>
//       </div>
//     </form>
//   )
// }



//@ts-nocheck
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon, PlusCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { saveGeneralDetailsForm } from "@/app/dashboard/actions/saveGeneralDetailsForm"
import { useDashboardContext } from "@/context/DashboardContext"

interface GeneralDetailsFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
  openPdfViewer: (file: string) => void
}

export default function GeneralDetailsForm({ lessonPlan, setLessonPlan, openPdfViewer }: GeneralDetailsFormProps) {
  const { userData } = useDashboardContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [facultyTermDates, setFacultyTermDates] = useState<{
    termStartDate: string
    termEndDate: string
  } | null>(null)

  // Form state
  const [division, setDivision] = useState(lessonPlan?.division || "Div 1 & 2")
  const [lectureHours, setLectureHours] = useState(lessonPlan?.subject?.lecture_hours || 0)
  const [labHours, setLabHours] = useState(lessonPlan?.subject?.lab_hours || 0)
  const [credits, setCredits] = useState(lessonPlan?.subject?.credits || 0)
  const [coursePrerequisites, setCoursePrerequisites] = useState(lessonPlan?.course_prerequisites || "")
  const [coursePrerequisitesMaterials, setCoursePrerequisitesMaterials] = useState(
    lessonPlan?.course_prerequisites_materials || "",
  )
  const [courseOutcomes, setCourseOutcomes] = useState(lessonPlan?.courseOutcomes || [{ id: uuidv4(), text: "" }])
  const [remarks, setRemarks] = useState(lessonPlan?.remarks || "")

  const [divisionError, setDivisionError] = useState("")
  const [lectureHoursError, setLectureHoursError] = useState("")
  const [labHoursError, setLabHoursError] = useState("")
  const [creditsError, setCreditsError] = useState("")
  const [coursePrerequisitesError, setCoursePrerequisitesError] = useState("")
  const [coursePrerequisitesMaterialsError, setCoursePrerequisitesMaterialsError] = useState("")
  const [courseOutcomesError, setCourseOutcomesError] = useState("")

  // Fetch faculty term dates on component mount
  useEffect(() => {
    const fetchFacultyTermDates = async () => {
      try {
        // This would be an API call to get the faculty's term dates set by HOD
        // For now, we'll use the lesson plan data or fetch from user role
        if (lessonPlan?.faculty_role?.term_start_date && lessonPlan?.faculty_role?.term_end_date) {
          setFacultyTermDates({
            termStartDate: lessonPlan.faculty_role.term_start_date,
            termEndDate: lessonPlan.faculty_role.term_end_date,
          })
        }
      } catch (error) {
        console.error("Error fetching faculty term dates:", error)
      }
    }

    fetchFacultyTermDates()
  }, [lessonPlan]);
  const getTermDates = () => {
    // Try multiple paths to get the term dates
    let termStartDate = ""
    let termEndDate = ""

    // Path 1: Direct from subject metadata
    if (lessonPlan?.subject?.metadata?.term_start_date) {
      termStartDate = lessonPlan.subject.metadata.term_start_date
    }
    if (lessonPlan?.subject?.metadata?.term_end_date) {
      termEndDate = lessonPlan.subject.metadata.term_end_date
    }

    // Path 2: If metadata is a string (JSON), parse it
    if (!termStartDate && typeof lessonPlan?.subject?.metadata === "string") {
      try {
        const parsedMetadata = JSON.parse(lessonPlan.subject.metadata)
        termStartDate = parsedMetadata?.term_start_date || ""
        termEndDate = parsedMetadata?.term_end_date || ""
      } catch (error) {
        console.error("Error parsing metadata:", error)
      }
    }

    // Path 3: Direct from lesson plan
    if (!termStartDate && lessonPlan?.term_start_date) {
      termStartDate = lessonPlan.term_start_date
    }
    if (!termEndDate && lessonPlan?.term_end_date) {
      termEndDate = lessonPlan.term_end_date
    }

    // Convert to DD-MM-YYYY format if needed
    const formatToDD_MM_YYYY = (dateStr: string): string => {
      if (!dateStr) return ""

      // If already in DD-MM-YYYY format, return as is
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        return dateStr
      }

      // If in YYYY-MM-DD format, convert to DD-MM-YYYY
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-")
        return `${day}-${month}-${year}`
      }

      // If in other formats, try to parse and convert
      try {
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, "0")
          const month = String(date.getMonth() + 1).padStart(2, "0")
          const year = date.getFullYear()
          return `${day}-${month}-${year}`
        }
      } catch (error) {
        console.error("Error parsing date:", error)
      }

      return dateStr // Return original if can't parse
    }

    return {
      termStartDate: formatToDD_MM_YYYY(termStartDate),
      termEndDate: formatToDD_MM_YYYY(termEndDate),
    }
  }

  const { termStartDate, termEndDate } = getTermDates()

  // Helper function to format date for display (DD-MM-YYYY)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    // If it's in YYYY-MM-DD format, convert to DD-MM-YYYY
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split("-")
      return `${day}-${month}-${year}`
    }
    // If it's already in DD-MM-YYYY format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) return dateString
    return dateString
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Reset all error states
      resetErrors()

      // Validate form data
      let hasErrors = false

      if (!division) {
        setDivisionError("Division is required")
        hasErrors = true
      }

      if (lectureHours < 1) {
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

      // Prepare form data - use HOD-set term dates
      const formData = {
        subject_id: lessonPlan?.subject?.id,
        division,
        lecture_hours: Number(lectureHours),
        lab_hours: Number(labHours),
        credits: Number(credits),
        term_start_date: facultyTermDates?.termStartDate || "",
        term_end_date: facultyTermDates?.termEndDate || "",
        course_prerequisites: coursePrerequisites,
        course_prerequisites_materials: coursePrerequisitesMaterials,
        courseOutcomes,
        remarks,
      }

      // Actually save to database
      const result = await saveGeneralDetailsForm(formData)

      if (result.success) {
        // Update the lesson plan state with the new values
        setLessonPlan((prev: any) => ({
          ...prev,
          division,
          lecture_hours: Number(lectureHours),
          lab_hours: Number(labHours),
          credits: Number(credits),
          term_start_date: facultyTermDates?.termStartDate || "",
          term_end_date: facultyTermDates?.termEndDate || "",
          course_prerequisites: coursePrerequisites,
          course_prerequisites_materials: coursePrerequisitesMaterials,
          courseOutcomes,
          remarks,
          general_details_completed: true,
          status: "in_progress", // Ensure status remains in_progress until all sections are complete
        }))

        toast.success("General details saved successfully! Status: In Progress")

        // Automatically navigate to the next tab
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
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger id="division" className="mt-1">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Div 1 & 2">Div 1 & 2</SelectItem>
                <SelectItem value="Div 1">Div 1</SelectItem>
                <SelectItem value="Div 2">Div 2</SelectItem>
              </SelectContent>
            </Select>
            {divisionError && <p className="text-red-500 text-xs mt-1">{divisionError}</p>}
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

      <div className="grid grid-cols-4 gap-6">
        <div>
          <Label htmlFor="lecture-hour">Lecture Hour/week</Label>
          <Input
            id="lecture-hour"
            type="number"
            value={lectureHours}
            onChange={(e) => setLectureHours(Number(e.target.value))}
            className="mt-1"
          />
          {lectureHoursError && <p className="text-red-500 text-xs mt-1">{lectureHoursError}</p>}
        </div>
        <div>
          <Label htmlFor="lab-hour">Lab Hour/week</Label>
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
            value={termStartDate || "Not set by HOD"}
            disabled
            className="mt-1 bg-gray-50"
          />
          <p className={`text-xs mt-1 font-medium ${termStartDate ? "text-green-600" : "text-blue-600"}`}>
          </p>
        </div>
        <div>
          <Label htmlFor="term-end-date">Term End Date</Label>
          <Input
            id="term-end-date"
            type="text"
            value={termEndDate || "Not set by HOD"}
            disabled
            className="mt-1 bg-gray-50"
          />
          <p className={`text-xs mt-1 font-medium ${termEndDate ? "text-green-600" : "text-blue-600"}`}>
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="course-prerequisites">Course Prerequisites<span className="text-red-500">*</span></Label>
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
          <Label htmlFor="course-prerequisites-materials">Course Prerequisites materials <span className="text-red-500">*</span></Label>
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

      <div className="flex justify-end">
        <Button type="submit" className="bg-[#1A5CA1] hover:bg-[#154A80]" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save General Details"}
        </Button>
      </div>
    </form>
  )
}
