//@ts-ignore
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, X } from "lucide-react"
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

  const handleSave = async () => {
    setIsSaving(true)

    // This would be replaced with an actual API call
    setTimeout(() => {
      toast.success("Lesson plan saved successfully")
      setIsSaving(false)
    }, 1500)
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
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
          Lesson Planning
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 mt-5">
        <div className="flex items-center gap-2">
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
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#1A5CA1] hover:bg-[#154A80]">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${showUnitPlanning && showPracticalPlanning ? "grid-cols-5" : showUnitPlanning || showPracticalPlanning ? "grid-cols-4" : "grid-cols-3"}`}
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
              <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
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