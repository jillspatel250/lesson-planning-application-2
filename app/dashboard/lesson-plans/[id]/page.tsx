"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardContext } from "@/context/DashboardContext"

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

  // Mock data for initial development
  useEffect(() => {
    // This would be replaced with an actual API call
    setTimeout(() => {
      setLessonPlan({
        id: params.id,
        subject: {
          id: "fe66b762-e3d1-4be9-b2ce-3273fd1cbda1",
          code: "CEU102",
          name: "Programming in C++",
          semester: 2,
          lecture_hours: 3,
          lab_hours: 2,
          abbreviation_name: "C++",
          credits: 4,
          department: {
            id: "d76a381e-0f08-464c-8eea-e2529db86a32",
            name: "Computer Science and Engineering",
            abbreviation_depart: "CSE",
          },
        },
        faculty: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
        academic_year: "2025",
        division: "Div 1 & 2",
        term_start_date: "10/12/2024",
        term_end_date: "30/05/2025",
        course_prerequisites: "Basic programming knowledge, Fundamentals of computer science",
        course_prerequisites_materials: "Introduction to Programming textbook, Online C tutorials",
        courseOutcomes: [
          { id: "co1", text: "Understand the fundamentals of C++ programming" },
          { id: "co2", text: "Apply object-oriented concepts to solve programming problems" },
        ],
        remarks: "This course is designed for beginners with some programming background",
        general_details: {
          // Additional general details fields
        },
        units: [
          {
            id: "unit1",
            name: "Introduction to C++",
            lectures: 8,
            topics: "History of C++, Basic syntax, Data types, Variables, Operators",
            self_study_topics: "Evolution of programming languages, Comparison with C",
            self_study_materials: "Online articles about programming language history",
            materials: "C++ Primer textbook, Chapter 1-3",
          },
        ],
        practicals: [
          {
            id: "practical1",
            aim: "Implement basic C++ programs using variables and operators",
            lab_hours: 2,
            probable_week: "Week 2",
            associated_unit: "unit1",
            software_hardware_requirements: "C++ compiler (GCC/G++), Visual Studio Code",
            tasks: "Write a program to calculate simple interest, Create a calculator program",
            evaluation_method: "Code review and demonstration",
            pedagogy: "Guided practice",
            blooms_taxonomy: "Apply",
            reference_material: "Lab manual pages 5-10",
          },
        ],
        cies: [
          {
            id: "cie1",
            type: "Quiz",
            units_covered: ["unit1"],
            date: "2024-12-20",
            marks: 50,
            duration: 45,
            blooms_taxonomy: "Remember, Understand, Apply",
            evaluation_pedagogy: "Written test",
            skill_mapping: "Problem-solving, Logical thinking",
            co_mapping: "CO1, CO2",
            pso_mapping: "PSO1",
            peo_mapping: "PEO1",
          },
        ],
        additional_info: {
          classroom_conduct: "Students are expected to be punctual and participate actively in discussions",
          attendance_policy: "Minimum 75% attendance is required to be eligible for the final examination",
          lesson_planning_guidelines: "Lessons will follow a structured approach with theory followed by examples",
          cie_guidelines: "Out of 5 CIEs conducted, the best 4 scores will be considered for final CIE calculation",
          self_study_guidelines: "Self-study topics will be assessed through assignments and quizzes",
        },
      })
      setIsLoading(false)
    }, 1000)
  }, [params.id, userData])

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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A5CA1]">Lesson Planning</h1>
        <div className="relative">
          <Select defaultValue="subject-teacher">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Subject Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subject-teacher">Subject Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/lesson-plans`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
        </div>
      </div>

      <Card className="mb-6">
        <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general-details">General Details</TabsTrigger>
            <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>
            <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>
            <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
            <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
          </TabsList>

          <TabsContent value="general-details">
            <GeneralDetailsForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} openPdfViewer={openPdfViewer} />
          </TabsContent>

          <TabsContent value="unit-planning">
            <UnitPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
          </TabsContent>

          <TabsContent value="practical-planning">
            <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
          </TabsContent>

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
