


//@ts-nocheck
//@ts-ignore
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, X } from "lucide-react"
import Link from "next/link"
import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
import { toast } from "sonner"
import { useDashboardContext } from "@/context/DashboardContext"
import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"
import { supabase } from "@/utils/supabase/client"

export default function EditLessonPlanPage() {
  const router = useRouter()
  const params = useParams()
  const { userData } = useDashboardContext()
  const [activeTab, setActiveTab] = useState("general-details")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lessonPlan, setLessonPlan] = useState<any>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [pdfFile, setPdfFile] = useState<string | null>(null)
  const [commonSubject, setCommonSubject] = useState<any>([])
  const [copiedData, setCopiedData] = useState<any>([])
  const [isCopying, setIsCopying] = useState(false)

  // Fetch actual lesson plan data
  useEffect(() => {
    const loadLessonPlan = async () => {
      try {
        setIsLoading(true)
        const result = await fetchLessonPlanById(params.id as string)

        if (result.success) {
          setLessonPlan(result.data)
        } else {
          toast.error(result.error || "Failed to load lesson plan")
        }
      } catch (error) {
        console.error("Error loading lesson plan:", error)
        toast.error("Failed to load lesson plan")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id && userData.id) {
      loadLessonPlan()
    }
  }, [params.id, userData.id])

  useEffect(() => {
    const loadCopyLP = async () => {
      if (!lessonPlan?.subject?.code) {
        console.log("No subject code found")
        return
      }

      try {
        console.log("🔍 Searching for subject code:", lessonPlan.subject.code)

        // Step 1: Find all subjects with the same code across departments
        const { data: allSubjectsWithCode, error: subjectsError } = await supabase
          .from("subjects")
          .select("id, code, name, department_id")
          .eq("code", lessonPlan.subject.code)

        if (subjectsError) {
          console.error("Error fetching subjects:", subjectsError)
          return
        }

        if (!allSubjectsWithCode || allSubjectsWithCode.length <= 1) {
          console.log("No other subjects found with code:", lessonPlan.subject.code)
          setCommonSubject([])
          return
        }

        // Step 2: Get all subject IDs
        const subjectIds = allSubjectsWithCode.map((subject) => subject.id)
        console.log("Found subject IDs:", subjectIds)

        // Step 3: Find faculty assigned to any of these subjects
        const { data: facultyWithSubjects, error: facultyError } = await supabase
          .from("user_role")
          .select("*, users(*), subjects(*), departments(*)")
          .in("subject_id", subjectIds)

        if (facultyError) {
          console.error("Error fetching faculty:", facultyError)
          return
        }

        console.log("Found faculty with same subject code:", facultyWithSubjects?.length)

        if (facultyWithSubjects && facultyWithSubjects.length > 1) {
          setCommonSubject(facultyWithSubjects)
          console.log("✅ Copy button should now appear")
        } else {
          setCommonSubject([])
          console.log("❌ Not enough faculty found for copy functionality")
        }
      } catch (error) {
        console.error("Error in loadCopyLP:", error)
        setCommonSubject([])
      }
    }

    if (lessonPlan?.subject?.code) {
      loadCopyLP()
    }
  }, [lessonPlan?.subject?.code])

  const handleSave = async () => {
    setIsSaving(true)

    // This would be replaced with an actual API call
    setTimeout(() => {
      toast.success("Lesson plan saved successfully")
      setIsSaving(false)
    }, 1500)
  }

  // 🎯 ENHANCED COPY - Find the single form with maximum completion flags (TRUE count)
  const handleCopy = async () => {
    try {
      setIsCopying(true)
      console.log("🔄 Starting max completion flags copy process...")

      // Step 1: Collect ALL individual forms from all faculty with same subject code
      const allForms = []

      for (const subject of commonSubject) {
        if (subject.id !== lessonPlan.id) {
          console.log(`📋 Checking ${subject.users.name} - ${subject.subjects.name} (${subject.departments.name})`)

          // Fetch form data for this specific faculty-subject combination
          const { data: formData, error: formError } = await supabase
            .from("forms")
            .select(`
              *,
              complete_general,
              complete_unit,
              complete_practical,
              complete_cie,
              complete_additional,
              users(*),
              subjects(*, departments(*))
            `)
            .eq("faculty_id", subject.users.id)
            .eq("subject_id", subject.subjects.id)

          if (formError) {
            console.error("    ❌ Error fetching form:", formError)
            continue
          }

          if (formData && formData.length > 0) {
            const form = formData[0]

            // Count TRUE flags in completion columns
            let trueCount = 0
            if (form.complete_general === true) trueCount++
            if (form.complete_unit === true) trueCount++
            if (form.complete_practical === true) trueCount++
            if (form.complete_cie === true) trueCount++
            if (form.complete_additional === true) trueCount++

            console.log(`    ✅ Form found - TRUE flags: ${trueCount}/5`)
            console.log(
              `       Flags: G:${form.complete_general} U:${form.complete_unit} P:${form.complete_practical} C:${form.complete_cie} A:${form.complete_additional}`,
            )

            // Only consider forms with actual form data and at least 1 TRUE flag
            if (form.form && trueCount > 0) {
              allForms.push({
                faculty: subject.users,
                department: subject.departments,
                subject: subject.subjects,
                formData: form.form,
                trueCount: trueCount,
                completionFlags: {
                  general: form.complete_general,
                  unit: form.complete_unit,
                  practical: form.complete_practical,
                  cie: form.complete_cie,
                  additional: form.complete_additional,
                },
              })
            } else {
              console.log(`    ⚠️ Form has ${trueCount} TRUE flags or no form data - skipping`)
            }
          } else {
            console.log("    ❌ No form data found")
          }
        }
      }

      if (allForms.length === 0) {
        toast.warning("No completed lesson plan data found to copy from")
        return
      }

      // Step 2: Sort by TRUE count (highest first)
      allForms.sort((a, b) => b.trueCount - a.trueCount)

      // Step 3: Select the form with maximum TRUE flags
      const bestForm = allForms[0]

      console.log("\n🏆 ALL FORMS RANKED BY TRUE FLAGS:")
      allForms.forEach((form, index) => {
        console.log(
          `${index + 1}. ${form.faculty.name} (${form.department.name}) - ${form.subject.name}: ${form.trueCount}/5 TRUE flags`,
        )
      })

      console.log(`\n✅ SELECTED: ${bestForm.faculty.name} with ${bestForm.trueCount}/5 TRUE flags`)

      // Step 4: Copy from the form with maximum TRUE flags
      const formData = bestForm.formData

      console.log("🔍 DEBUG: Source additionalInfo data:", formData.additionalInfo)
      console.log("🔍 DEBUG: Current lessonPlan.additionalInfo:", lessonPlan.additionalInfo)

      setLessonPlan((prevLessonPlan) => {
        const updatedPlan = {
          ...prevLessonPlan,
          // 🔧 FIXED: Copy General Details properly
          division: formData.generalDetails?.division || prevLessonPlan.division,
          lecture_hours: formData.generalDetails?.lecture_hours || prevLessonPlan.lecture_hours,
          lab_hours: formData.generalDetails?.lab_hours || prevLessonPlan.lab_hours,
          credits: formData.generalDetails?.credits || prevLessonPlan.credits,
          term_start_date: formData.generalDetails?.term_start_date || prevLessonPlan.term_start_date,
          term_end_date: formData.generalDetails?.term_end_date || prevLessonPlan.term_end_date,
          course_prerequisites: formData.generalDetails?.course_prerequisites || prevLessonPlan.course_prerequisites,
          course_prerequisites_materials:
            formData.generalDetails?.course_prerequisites_materials || prevLessonPlan.course_prerequisites_materials,
          courseOutcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.courseOutcomes,
          course_outcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.course_outcomes,
          remarks: formData.generalDetails?.remarks || prevLessonPlan.remarks,

          // Copy Unit Planning
          unitPlanning: formData.unitPlanning || prevLessonPlan.unitPlanning,
          units: formData.unitPlanning?.units || prevLessonPlan.units,

          // Copy Practical Planning
          practicalPlanning: formData.practicalPlanning || prevLessonPlan.practicalPlanning,
          practicals: formData.practicalPlanning?.practicals || formData.practicals || prevLessonPlan.practicals,

          // Copy CIE Planning
          ciePlanning: formData.ciePlanning || prevLessonPlan.ciePlanning,
          cieDetails: formData.ciePlanning?.cieDetails || formData.cieDetails || prevLessonPlan.cieDetails,
          cie_components:
            formData.ciePlanning?.cie_components || formData.cie_components || prevLessonPlan.cie_components,
          cies: formData.ciePlanning?.cies || formData.cies || prevLessonPlan.cies,

          // 🔧 FIXED: Copy Additional Information - Use correct field name "additional_info" not "additionalInfo"
          additional_info: {
            ...prevLessonPlan.additional_info,
            // Copy text fields from source additionalInfo
            classroom_conduct:
              formData.additionalInfo?.classroom_conduct || prevLessonPlan.additional_info?.classroom_conduct,
            attendance_policy:
              formData.additionalInfo?.attendance_policy || prevLessonPlan.additional_info?.attendance_policy,
            lesson_planning_guidelines:
              formData.additionalInfo?.lesson_planning_guidelines ||
              prevLessonPlan.additional_info?.lesson_planning_guidelines,
            cie_guidelines: formData.additionalInfo?.cie_guidelines || prevLessonPlan.additional_info?.cie_guidelines,
            self_study_guidelines:
              formData.additionalInfo?.self_study_guidelines || prevLessonPlan.additional_info?.self_study_guidelines,
            topics_beyond_syllabus:
              formData.additionalInfo?.topics_beyond_syllabus || prevLessonPlan.additional_info?.topics_beyond_syllabus,
            reference_materials:
              formData.additionalInfo?.reference_materials || prevLessonPlan.additional_info?.reference_materials,
            academic_integrity:
              formData.additionalInfo?.academic_integrity || prevLessonPlan.additional_info?.academic_integrity,
            communication_channels:
              formData.additionalInfo?.communication_channels || prevLessonPlan.additional_info?.communication_channels,
            interdisciplinary_integration:
              formData.additionalInfo?.interdisciplinary_integration ||
              prevLessonPlan.additional_info?.interdisciplinary_integration,

            // Copy learner planning TEXT only - NO PDF files
            fast_learner_planning:
              formData.additionalInfo?.fast_learner_planning || prevLessonPlan.additional_info?.fast_learner_planning,
            medium_learner_planning:
              formData.additionalInfo?.medium_learner_planning ||
              prevLessonPlan.additional_info?.medium_learner_planning,
            slow_learner_planning:
              formData.additionalInfo?.slow_learner_planning || prevLessonPlan.additional_info?.slow_learner_planning,

            // Copy events if available
            events: formData.additionalInfo?.events || prevLessonPlan.additional_info?.events || [],

            // 🚫 KEEP existing PDF file URLs - DO NOT copy them
            fast_learner_file_url: prevLessonPlan.additional_info?.fast_learner_file_url,
            medium_learner_file_url: prevLessonPlan.additional_info?.medium_learner_file_url,
            slow_learner_file_url: prevLessonPlan.additional_info?.slow_learner_file_url,
          },

          // Update status to indicate data is ready for editing
          status: "in_progress",
          general_details_completed: true,
        }

        console.log("🔍 DEBUG: Updated lessonPlan.additional_info:", updatedPlan.additional_info)
        console.log("🔍 DEBUG: Specific fields copied:")
        console.log("  - classroom_conduct:", updatedPlan.additional_info?.classroom_conduct)
        console.log("  - attendance_policy:", updatedPlan.additional_info?.attendance_policy)
        console.log("  - lesson_planning_guidelines:", updatedPlan.additional_info?.lesson_planning_guidelines)

        return updatedPlan
      })
      

      console.log("📝 Copying data sections:")
      console.log("  ✅ General Details:", !!formData.generalDetails)
      console.log("  ✅ Unit Planning:", !!formData.unitPlanning)
      console.log("  ✅ Practical Planning:", !!formData.practicalPlanning)
      console.log("  ✅ CIE Planning:", !!formData.ciePlanning)
      console.log("  ✅ Additional Info (TEXT ONLY):", !!formData.additionalInfo)
      console.log("  🚫 PDF Files: EXCLUDED")

      // Show detailed success message with TRUE flags breakdown
      const flagsText = Object.entries(bestForm.completionFlags)
        .filter(([key, value]) => value === true)
        .map(([key]) => key.charAt(0).toUpperCase())
        .join(", ");

      toast.success(
        `✅ Copied from ${bestForm.faculty.name} (${bestForm.department.name}) - ` +
          `${bestForm.trueCount}/5 sections complete (${flagsText})!`,
      )
     

    
    } catch (error) {
      console.error("💥 Error in max completion copy process:", error)
      toast.error("Failed to copy lesson plan data")
    } finally {
      setIsCopying(false)
    }
  }

  const openPdfViewer = (file: string) => {
    setPdfFile(file)
    setShowPdfViewer(true)
  }

  const closePdfViewer = () => {
    setShowPdfViewer(false)
    setPdfFile(null)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-lg">Loading lesson plan...</p>
        </div>
      </div>
    )
  }

  if (!lessonPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-lg text-red-600">Failed to load lesson plan</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Determine which tabs to show based on subject type
  const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
  const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

  return (
    <div className="p-8">
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
              <Button variant="ghost" size="icon" onClick={closePdfViewer}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {pdfFile ? (
                <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
              ) : (
                <p>No PDF file specified</p>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={closePdfViewer}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">Lesson Planning</p>
      </div>

      <div className="flex items-center justify-between mb-6 mt-5">
        <div className="flex items-center w-full gap-2">
          <Link href={`/dashboard/lesson-plans`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
          {isSubjectTheoryOnly(lessonPlan?.subject) && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
          )}
          {isSubjectPracticalOnly(lessonPlan?.subject) && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
          )}
          {isSubjectBoth(lessonPlan?.subject) && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
          )}
          {lessonPlan?.is_sharing && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              Shared ({lessonPlan.sharing_faculty.length} Faculty)
            </span>
          )}

          {commonSubject.length >= 2 && (
            <>
              <Button className="ml-auto text-white" onClick={handleCopy} disabled={isCopying}>
                <Copy className="mr-2" />
                {isCopying ? "Finding Best Form..." : "Copy Best"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  console.log("🔍 DEBUG: Current lessonPlan:", lessonPlan)
                  console.log("🔍 DEBUG: Current additional_info:", lessonPlan?.additional_info)
                  toast.info("Check console for debug info")
                }}
              >
                Debug State
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${
              showUnitPlanning && showPracticalPlanning
                ? "grid-cols-5"
                : showUnitPlanning || showPracticalPlanning
                  ? "grid-cols-4"
                  : "grid-cols-3"
            }`}
          >
            <TabsTrigger value="general-details">General Details</TabsTrigger>
            {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
            {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
            <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
            <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
          </TabsList>

          <TabsContent value="general-details">
            <GeneralDetailsForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} openPdfViewer={openPdfViewer} />
          </TabsContent>

          {showUnitPlanning && (
            <TabsContent value="unit-planning">
              <UnitPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
            </TabsContent>
          )}

          {showPracticalPlanning && (
            <TabsContent value="practical-planning">
              <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} userData={userData} />
            </TabsContent>
          )}

          <TabsContent value="cie-planning">
            <CIEPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
          </TabsContent>

          <TabsContent value="additional-info">
            <AdditionalInfoForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}






