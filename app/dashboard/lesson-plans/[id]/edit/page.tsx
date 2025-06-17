// //@ts-nocheck

// //@ts-ignore
// "use client"

// import { useState, useEffect, useMemo } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Save, X } from "lucide-react"
// import Link from "next/link"
// import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
// import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
// import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
// import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
// import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
// import { toast } from "sonner"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
// import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"

// export default function EditLessonPlanPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { userData } = useDashboardContext()
//   const [activeTab, setActiveTab] = useState("general-details")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [lessonPlan, setLessonPlan] = useState<any>(null)
//   const [showPdfViewer, setShowPdfViewer] = useState(false)
//   const [pdfFile, setPdfFile] = useState<string | null>(null)

//   // Fetch actual lesson plan data
//   useEffect(() => {
//     const loadLessonPlan = async () => {
//       try {
//         setIsLoading(true)
//         const result = await fetchLessonPlanById(params.id as string)

//         if (result.success) {
//           setLessonPlan(result.data)
//         } else {
//           toast.error(result.error || "Failed to load lesson plan")
//         }
//       } catch (error) {
//         console.error("Error loading lesson plan:", error)
//         toast.error("Failed to load lesson plan")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id && userData.id) {
//       loadLessonPlan()
//     }
//   }, [params.id, userData.id])

//   const handleSave = async () => {
//     setIsSaving(true)

//     // This would be replaced with an actual API call
//     setTimeout(() => {
//       toast.success("Lesson plan saved successfully")
//       setIsSaving(false)
//     }, 1500)
//   }

//   const openPdfViewer = (file: string) => {
//     setPdfFile(file)
//     setShowPdfViewer(true)
//   }

//   const closePdfViewer = () => {
//     setShowPdfViewer(false)
//     setPdfFile(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg">Loading lesson plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!lessonPlan) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg text-red-600">Failed to load lesson plan</p>
//           <Button asChild className="mt-4">
//             <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // Determine which tabs to show based on subject type
//   const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
//   const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

//   return (
//     <div className="p-8">
//       {/* PDF Viewer Modal */}
//       {showPdfViewer && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={closePdfViewer}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-4 overflow-auto">
//               {pdfFile ? (
//                 <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
//               ) : (
//                 <p>No PDF file specified</p>
//               )}
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={closePdfViewer}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
//           Lesson Planning
//         </p>
//       </div>

//       <div className="flex items-center justify-between mb-6 mt-5">
//         <div className="flex items-center gap-2">
//           <Link href={`/dashboard/lesson-plans`}>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
//           <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
//           {isSubjectTheoryOnly(lessonPlan?.subject) && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
//           )}
//           {isSubjectPracticalOnly(lessonPlan?.subject) && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
//           )}
//           {isSubjectBoth(lessonPlan?.subject) && (
//             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
//           )}
//           {lessonPlan?.is_sharing && (
//             <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//               Shared ({lessonPlan.sharing_faculty.length} Faculty)
//             </span>
//           )}
//         </div>
//         {/* <div className="flex items-center gap-2">
//           <Button onClick={handleSave} disabled={isSaving} className="bg-[#1A5CA1] hover:bg-[#154A80]">
//             <Save className="mr-2 h-4 w-4" />
//             {isSaving ? "Saving..." : "Save"}
//           </Button>
//         </div> */}
//       </div>

//       <Card className="mb-6">
//         <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList
//             className={`grid w-full ${showUnitPlanning && showPracticalPlanning ? "grid-cols-5" : showUnitPlanning || showPracticalPlanning ? "grid-cols-4" : "grid-cols-3"}`}
//           >
//             <TabsTrigger value="general-details">General Details</TabsTrigger>
//             {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
//             {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
//             <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="general-details">
//             <GeneralDetailsForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} openPdfViewer={openPdfViewer} />
//           </TabsContent>

//           {showUnitPlanning && (
//             <TabsContent value="unit-planning">
//               <UnitPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//             </TabsContent>
//           )}

//           {showPracticalPlanning && (
//             <TabsContent value="practical-planning">
//               <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//             </TabsContent>
//           )}

//           <TabsContent value="cie-planning">
//             <CIEPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//           </TabsContent>

//           <TabsContent value="additional-info">
//             <AdditionalInfoForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
// }



// //@ts-nocheck

// //@ts-ignore
// "use client"

// import { useState, useEffect, useMemo } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Save, X } from "lucide-react"
// import Link from "next/link"
// import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
// import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
// import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
// import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
// import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
// import { toast } from "sonner"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
// import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"

// export default function EditLessonPlanPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { userData } = useDashboardContext()
//   const [activeTab, setActiveTab] = useState("general-details")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [lessonPlan, setLessonPlan] = useState<any>(null)
//   const [showPdfViewer, setShowPdfViewer] = useState(false)
//   const [pdfFile, setPdfFile] = useState<string | null>(null)

//   // Fetch actual lesson plan data
//   useEffect(() => {
//     const loadLessonPlan = async () => {
//       try {
//         setIsLoading(true)
//         const result = await fetchLessonPlanById(params.id as string)

//         if (result.success) {
//           setLessonPlan(result.data)
//         } else {
//           toast.error(result.error || "Failed to load lesson plan")
//         }
//       } catch (error) {
//         console.error("Error loading lesson plan:", error)
//         toast.error("Failed to load lesson plan")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id && userData.id) {
//       loadLessonPlan()
//     }
//   }, [params.id, userData.id])

//   const handleSave = async () => {
//     setIsSaving(true)

//     // This would be replaced with an actual API call
//     setTimeout(() => {
//       toast.success("Lesson plan saved successfully")
//       setIsSaving(false)
//     }, 1500)
//   }

//   const openPdfViewer = (file: string) => {
//     setPdfFile(file)
//     setShowPdfViewer(true)
//   }

//   const closePdfViewer = () => {
//     setShowPdfViewer(false)
//     setPdfFile(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg">Loading lesson plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!lessonPlan) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg text-red-600">Failed to load lesson plan</p>
//           <Button asChild className="mt-4">
//             <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // Determine which tabs to show based on subject type
//   const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
//   const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

//   return (
//     <div className="p-8">
//       {/* PDF Viewer Modal */}
//       {showPdfViewer && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={closePdfViewer}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-4 overflow-auto">
//               {pdfFile ? (
//                 <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
//               ) : (
//                 <p>No PDF file specified</p>
//               )}
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={closePdfViewer}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
//           Lesson Planning
//         </p>
//       </div>

//       <div className="flex items-center justify-between mb-6 mt-5">
//         <div className="flex items-center gap-2">
//           <Link href={`/dashboard/lesson-plans`}>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
//           <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
//           {isSubjectTheoryOnly(lessonPlan?.subject) && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
//           )}
//           {isSubjectPracticalOnly(lessonPlan?.subject) && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
//           )}
//           {isSubjectBoth(lessonPlan?.subject) && (
//             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
//           )}
//           {lessonPlan?.is_sharing && (
//             <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//               Shared ({lessonPlan.sharing_faculty.length} Faculty)
//             </span>
//           )}
//         </div>
//         {/* <div className="flex items-center gap-2">
//           <Button onClick={handleSave} disabled={isSaving} className="bg-[#1A5CA1] hover:bg-[#154A80]">
//             <Save className="mr-2 h-4 w-4" />
//             {isSaving ? "Saving..." : "Save"}
//           </Button>
//         </div> */}
//       </div>

//       <Card className="mb-6">
//         <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList
//             className={`grid w-full ${showUnitPlanning && showPracticalPlanning ? "grid-cols-5" : showUnitPlanning || showPracticalPlanning ? "grid-cols-4" : "grid-cols-3"}`}
//           >
//             <TabsTrigger value="general-details">General Details</TabsTrigger>
//             {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
//             {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
//             <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="general-details">
//             <GeneralDetailsForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} openPdfViewer={openPdfViewer} />
//           </TabsContent>

//           {showUnitPlanning && (
//             <TabsContent value="unit-planning">
//               <UnitPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//             </TabsContent>
//           )}

//           {showPracticalPlanning && (
//             <TabsContent value="practical-planning">
//               <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//             </TabsContent>
//           )}

//           <TabsContent value="cie-planning">
//             <CIEPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//           </TabsContent>

//           <TabsContent value="additional-info">
//             <AdditionalInfoForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
// 






















// //@ts-nocheck
// //@ts-ignore
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Copy, X } from "lucide-react"
// import Link from "next/link"
// import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
// import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
// import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
// import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
// import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
// import { toast } from "sonner"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
// import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"
// import { supabase } from "@/utils/supabase/client"

// export default function EditLessonPlanPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { userData } = useDashboardContext()
//   const [activeTab, setActiveTab] = useState("general-details")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [lessonPlan, setLessonPlan] = useState<any>(null)
//   const [showPdfViewer, setShowPdfViewer] = useState(false)
//   const [pdfFile, setPdfFile] = useState<string | null>(null)
//   const [commonSubject, setCommonSubject] = useState<any>([])
//   const [copiedData, setCopiedData] = useState<any>([])

//   // Fetch actual lesson plan data
//   useEffect(() => {
//     const loadLessonPlan = async () => {
//       try {
//         setIsLoading(true)
//         const result = await fetchLessonPlanById(params.id as string)

//         if (result.success) {
//           setLessonPlan(result.data)
//         } else {
//           toast.error(result.error || "Failed to load lesson plan")
//         }
//       } catch (error) {
//         console.error("Error loading lesson plan:", error)
//         toast.error("Failed to load lesson plan")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id && userData.id) {
//       loadLessonPlan()
//     }
//   }, [params.id, userData.id])

//   useEffect(() => {
//     const loadCopyLP = async () => {
//       const { data: commonSubject, error: commonSubjectError } = await supabase
//         .from("user_role")
//         .select("*, users(*), subjects(*), departments(*)")
//         .eq("subject_id", lessonPlan?.subject?.id)

//       if (commonSubject.length > 1) {
//         setCommonSubject(commonSubject)
//       } else {
//         console.error(commonSubjectError)
//       }
//     }

//     if (lessonPlan?.subject?.id) {
//       loadCopyLP()
//     }
//   }, [lessonPlan])

//   const handleSave = async () => {
//     setIsSaving(true)

//     // This would be replaced with an actual API call
//     setTimeout(() => {
//       toast.success("Lesson plan saved successfully")
//       setIsSaving(false)
//     }, 1500)
//   }

//   const handleCopy = async () => {
//     try {
//       console.log("🔄 Starting copy process...")

//       for (const subject of commonSubject) {
//         if (subject.id !== lessonPlan.id) {
//           console.log("📋 Copying from:", subject.users.name)
//           console.log("📊 Subject ID:", subject.subjects.id, "Faculty ID:", subject.users.id)

//           const { data: copyFormData, error: copyError } = await supabase
//             .from("forms")
//             .select("*, users(*), subjects(*, departments(*))")
//             .eq("faculty_id", subject.users.id)
//             .eq("subject_id", subject.subjects.id)

//           if (copyError) {
//             console.error("❌ Error fetching form data:", copyError)
//             toast.error("Failed to fetch form data for copying")
//             continue
//           }

//           if (copyFormData && copyFormData.length > 0) {
//             const sourceForm = copyFormData[0]
//             console.log("✅ Found form data:", sourceForm)

//             // Extract the form data
//             const formData = sourceForm.form

//             if (formData) {
//               console.log("📝 Processing form data:", formData)

//               // Update the lesson plan state with copied data
//               setLessonPlan((prevLessonPlan) => ({
//                 ...prevLessonPlan,
//                 // Copy General Details
//                 division: formData.generalDetails?.division || prevLessonPlan.division,
//                 lecture_hours: formData.generalDetails?.lecture_hours || prevLessonPlan.lecture_hours,
//                 lab_hours: formData.generalDetails?.lab_hours || prevLessonPlan.lab_hours,
//                 credits: formData.generalDetails?.credits || prevLessonPlan.credits,
//                 term_start_date: formData.generalDetails?.term_start_date || prevLessonPlan.term_start_date,
//                 term_end_date: formData.generalDetails?.term_end_date || prevLessonPlan.term_end_date,
//                 course_prerequisites:
//                   formData.generalDetails?.course_prerequisites || prevLessonPlan.course_prerequisites,
//                 course_prerequisites_materials:
//                   formData.generalDetails?.course_prerequisites_materials ||
//                   prevLessonPlan.course_prerequisites_materials,
//                 courseOutcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.courseOutcomes,
//                 remarks: formData.generalDetails?.remarks || prevLessonPlan.remarks,

//                 // Copy Unit Planning
//                 unitPlanning: formData.unitPlanning || prevLessonPlan.unitPlanning,
//                 units: formData.unitPlanning?.units || prevLessonPlan.units,

//                 // Copy Practical Planning
//                 practicalPlanning: formData.practicalPlanning || prevLessonPlan.practicalPlanning,
//                 practicals: formData.practicalPlanning?.practicals || prevLessonPlan.practicals,

//                 // Copy CIE Planning
//                 ciePlanning: formData.ciePlanning || prevLessonPlan.ciePlanning,
//                 cieDetails: formData.ciePlanning?.cieDetails || prevLessonPlan.cieDetails,

//                 // Copy Additional Information
//                 additionalInfo: formData.additionalInfo || prevLessonPlan.additionalInfo,
//                 references: formData.additionalInfo?.references || prevLessonPlan.references,
//                 additionalNotes: formData.additionalInfo?.additionalNotes || prevLessonPlan.additionalNotes,

//                 // Update status
//                 status: "in_progress",
//                 general_details_completed: true,
//               }))

//               // Save the copied data to current faculty's form
//               const { data: newForm, error: insertError } = await supabase
//                 .from("forms")
//                 .upsert({
//                   faculty_id: userData.id,
//                   subject_id: lessonPlan.subject.id,
//                   form: formData,
//                 })
//                 .select()

//               if (insertError) {
//                 console.error("❌ Error saving copied form:", insertError)
//                 toast.error("Failed to save copied data")
//               } else {
//                 console.log("✅ Copied data saved successfully")

//                 // Update subject status
//                 const { error: statusError } = await supabase
//                   .from("subjects")
//                   .update({ lesson_plan_status: "in_progress" })
//                   .eq("id", lessonPlan.subject.id)

//                 if (statusError) {
//                   console.error("❌ Error updating subject status:", statusError)
//                 }

//                 toast.success(`Successfully copied lesson plan data from ${subject.users.name}!`)

//                 // Refresh the page to ensure all forms show the copied data
//                 setTimeout(() => {
//                   window.location.reload()
//                 }, 1500)
//               }

//               setCopiedData(copyFormData)
//               break // Exit loop after successful copy
//             } else {
//               console.log("⚠️ No form data found for this faculty")
//               toast.warning(`No completed form data found for ${subject.users.name}`)
//             }
//           } else {
//             console.log("⚠️ No form records found")
//             toast.warning(`No lesson plan data found for ${subject.users.name}`)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("💥 Error in copy process:", error)
//       toast.error("Failed to copy lesson plan data")
//     }
//   }

//   const openPdfViewer = (file: string) => {
//     setPdfFile(file)
//     setShowPdfViewer(true)
//   }

//   const closePdfViewer = () => {
//     setShowPdfViewer(false)
//     setPdfFile(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg">Loading lesson plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!lessonPlan) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg text-red-600">Failed to load lesson plan</p>
//           <Button asChild className="mt-4">
//             <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // Determine which tabs to show based on subject type
//   const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
//   const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

//   return (
//     <div className="p-8">
//       {/* PDF Viewer Modal */}
//       {showPdfViewer && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={closePdfViewer}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-4 overflow-auto">
//               {pdfFile ? (
//                 <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
//               ) : (
//                 <p>No PDF file specified</p>
//               )}
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={closePdfViewer}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">Lesson Planning</p>
//       </div>

//       <div className="flex items-center justify-between mb-6 mt-5">
//         <div className="flex items-center w-full gap-2">
//           <Link href={`/dashboard/lesson-plans`}>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
//           <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
//           {isSubjectTheoryOnly(lessonPlan?.subject) && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
//           )}
//           {isSubjectPracticalOnly(lessonPlan?.subject) && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
//           )}
//           {isSubjectBoth(lessonPlan?.subject) && (
//             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
//           )}
//           {lessonPlan?.is_sharing && (
//             <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//               Shared ({lessonPlan.sharing_faculty.length} Faculty)
//             </span>
//           )}

//           {commonSubject.length >= 2 && (
//             <Button className="ml-auto bg-blue-500 hover:bg-green-700 text-white" onClick={handleCopy}>
//               <Copy className="mr-2" />
//               Copy
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card className="mb-6">
//         <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList
//             className={`grid w-full ${
//               showUnitPlanning && showPracticalPlanning
//                 ? "grid-cols-5"
//                 : showUnitPlanning || showPracticalPlanning
//                   ? "grid-cols-4"
//                   : "grid-cols-3"
//             }`}
//           >
//             <TabsTrigger value="general-details">General Details</TabsTrigger>
//             {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
//             {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
//             <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="general-details">
//             <GeneralDetailsForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} openPdfViewer={openPdfViewer} />
//           </TabsContent>

//           {showUnitPlanning && (
//             <TabsContent value="unit-planning">
//               <UnitPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//             </TabsContent>
//           )}

//           {showPracticalPlanning && (
//             <TabsContent value="practical-planning">
//               <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//             </TabsContent>
//           )}

//           <TabsContent value="cie-planning">
//             <CIEPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//           </TabsContent>

//           <TabsContent value="additional-info">
//             <AdditionalInfoForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )

// }

































// //@ts-nocheck
// //@ts-ignore
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Copy, X } from "lucide-react"
// import Link from "next/link"
// import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
// import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
// import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
// import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
// import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
// import { toast } from "sonner"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
// import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"
// import { supabase } from "@/utils/supabase/client"

// export default function EditLessonPlanPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { userData } = useDashboardContext()
//   const [activeTab, setActiveTab] = useState("general-details")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [lessonPlan, setLessonPlan] = useState<any>(null)
//   const [showPdfViewer, setShowPdfViewer] = useState(false)
//   const [pdfFile, setPdfFile] = useState<string | null>(null)
//   const [commonSubject, setCommonSubject] = useState<any>([])
//   const [copiedData, setCopiedData] = useState<any>([])

//   // Fetch actual lesson plan data
//   useEffect(() => {
//     const loadLessonPlan = async () => {
//       try {
//         setIsLoading(true)
//         const result = await fetchLessonPlanById(params.id as string)

//         if (result.success) {
//           setLessonPlan(result.data)
//         } else {
//           toast.error(result.error || "Failed to load lesson plan")
//         }
//       } catch (error) {
//         console.error("Error loading lesson plan:", error)
//         toast.error("Failed to load lesson plan")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id && userData.id) {
//       loadLessonPlan()
//     }
//   }, [params.id, userData.id])

//   useEffect(() => {
//     const loadCopyLP = async () => {
//       const { data: commonSubject, error: commonSubjectError } = await supabase
//         .from("user_role")
//         .select("*, users(*), subjects(*), departments(*)")
//         .eq("subject_id", lessonPlan?.subject?.id)

//       if (commonSubject.length > 1) {
//         setCommonSubject(commonSubject)
//       } else {
//         console.error(commonSubjectError)
//       }
//     }

//     if (lessonPlan?.subject?.id) {
//       loadCopyLP()
//     }
//   }, [lessonPlan])

//   const handleSave = async () => {
//     setIsSaving(true)

//     // This would be replaced with an actual API call
//     setTimeout(() => {
//       toast.success("Lesson plan saved successfully")
//       setIsSaving(false)
//     }, 1500)
//   }

//   const handleCopy = async () => {
//     try {
//       console.log("🔄 Starting copy process...")

//       for (const subject of commonSubject) {
//         if (subject.id !== lessonPlan.id) {
//           console.log("📋 Copying from:", subject.users.name)
//           console.log("📊 Subject ID:", subject.subjects.id, "Faculty ID:", subject.users.id)

//           const { data: copyFormData, error: copyError } = await supabase
//             .from("forms")
//             .select("*, users(*), subjects(*, departments(*))")
//             .eq("faculty_id", subject.users.id)
//             .eq("subject_id", subject.subjects.id)

//           if (copyError) {
//             console.error("❌ Error fetching form data:", copyError)
//             toast.error("Failed to fetch form data for copying")
//             continue
//           }

//           if (copyFormData && copyFormData.length > 0) {
//             const sourceForm = copyFormData[0]
//             console.log("✅ Found form data:", sourceForm)

//             // Extract the form data
//             const formData = sourceForm.form

//             if (formData) {
//               console.log("📝 Processing form data:", formData)

//               // 🎯 FIXED: Update the lesson plan state with ALL copied data using correct field names
//               setLessonPlan((prevLessonPlan) => ({
//                 ...prevLessonPlan,
//                 // Copy General Details
//                 division: formData.generalDetails?.division || prevLessonPlan.division,
//                 lecture_hours: formData.generalDetails?.lecture_hours || prevLessonPlan.lecture_hours,
//                 lab_hours: formData.generalDetails?.lab_hours || prevLessonPlan.lab_hours,
//                 credits: formData.generalDetails?.credits || prevLessonPlan.credits,
//                 term_start_date: formData.generalDetails?.term_start_date || prevLessonPlan.term_start_date,
//                 term_end_date: formData.generalDetails?.term_end_date || prevLessonPlan.term_end_date,
//                 course_prerequisites:
//                   formData.generalDetails?.course_prerequisites || prevLessonPlan.course_prerequisites,
//                 course_prerequisites_materials:
//                   formData.generalDetails?.course_prerequisites_materials ||
//                   prevLessonPlan.course_prerequisites_materials,
//                 courseOutcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.courseOutcomes,
//                 course_outcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.course_outcomes,
//                 remarks: formData.generalDetails?.remarks || prevLessonPlan.remarks,

//                 // Copy Unit Planning
//                 unitPlanning: formData.unitPlanning || prevLessonPlan.unitPlanning,
//                 units: formData.unitPlanning?.units || prevLessonPlan.units,

//                 // 🔧 FIXED: Copy Practical Planning with correct field names
//                 practicalPlanning: formData.practicalPlanning || prevLessonPlan.practicalPlanning,
//                 practicals: formData.practicalPlanning?.practicals || formData.practicals || prevLessonPlan.practicals,

//                 // 🔧 FIXED: Copy CIE Planning with correct field names
//                 ciePlanning: formData.ciePlanning || prevLessonPlan.ciePlanning,
//                 cieDetails: formData.ciePlanning?.cieDetails || formData.cieDetails || prevLessonPlan.cieDetails,
//                 cie_components:
//                   formData.ciePlanning?.cie_components || formData.cie_components || prevLessonPlan.cie_components,
//                 cies: formData.ciePlanning?.cies || formData.cies || prevLessonPlan.cies,

//                 // Copy Additional Information
//                 additionalInfo: formData.additionalInfo || prevLessonPlan.additionalInfo,
//                 references: formData.additionalInfo?.references || formData.references || prevLessonPlan.references,
//                 additionalNotes:
//                   formData.additionalInfo?.additionalNotes ||
//                   formData.additionalNotes ||
//                   prevLessonPlan.additionalNotes,

//                 // Update status
//                 status: "in_progress",
//                 general_details_completed: true,
//               }))

//               // Save the copied data to current faculty's form
//               const { data: newForm, error: insertError } = await supabase
//                 .from("forms")
//                 .upsert({
//                   faculty_id: userData.id,
//                   subject_id: lessonPlan.subject.id,
//                   form: formData,
//                 })
//                 .select()

//               if (insertError) {
//                 console.error("❌ Error saving copied form:", insertError)
//                 toast.error("Failed to save copied data")
//               } else {
//                 console.log("✅ Copied data saved successfully")

//                 // Update subject status
//                 const { error: statusError } = await supabase
//                   .from("subjects")
//                   .update({ lesson_plan_status: "in_progress" })
//                   .eq("id", lessonPlan.subject.id)

//                 if (statusError) {
//                   console.error("❌ Error updating subject status:", statusError)
//                 }

//                 toast.success(`Successfully copied lesson plan data from ${subject.users.name}!`)

//                 // ✅ NO REFRESH - Data shows immediately!
//               }

//               setCopiedData(copyFormData)
//               break // Exit loop after successful copy
//             } else {
//               console.log("⚠️ No form data found for this faculty")
//               toast.warning(`No completed form data found for ${subject.users.name}`)
//             }
//           } else {
//             console.log("⚠️ No form records found")
//             toast.warning(`No lesson plan data found for ${subject.users.name}`)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("💥 Error in copy process:", error)
//       toast.error("Failed to copy lesson plan data")
//     }
//   }

//   const openPdfViewer = (file: string) => {
//     setPdfFile(file)
//     setShowPdfViewer(true)
//   }

//   const closePdfViewer = () => {
//     setShowPdfViewer(false)
//     setPdfFile(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg">Loading lesson plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!lessonPlan) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg text-red-600">Failed to load lesson plan</p>
//           <Button asChild className="mt-4">
//             <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // Determine which tabs to show based on subject type
//   const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
//   const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

//   return (
//     <div className="p-8">
//       {/* PDF Viewer Modal */}
//       {showPdfViewer && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={closePdfViewer}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-4 overflow-auto">
//               {pdfFile ? (
//                 <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
//               ) : (
//                 <p>No PDF file specified</p>
//               )}
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={closePdfViewer}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">Lesson Planning</p>
//       </div>

//       <div className="flex items-center justify-between mb-6 mt-5">
//         <div className="flex items-center w-full gap-2">
//           <Link href={`/dashboard/lesson-plans`}>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
//           <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
//           {isSubjectTheoryOnly(lessonPlan?.subject) && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
//           )}
//           {isSubjectPracticalOnly(lessonPlan?.subject) && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
//           )}
//           {isSubjectBoth(lessonPlan?.subject) && (
//             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
//           )}
//           {lessonPlan?.is_sharing && (
//             <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//               Shared ({lessonPlan.sharing_faculty.length} Faculty)
//             </span>
//           )}

//           {commonSubject.length >= 2 && (
//             <Button className="ml-auto bg-green-600 hover:bg-green-700 text-white" onClick={handleCopy}>
//               <Copy className="mr-2" />
//               Copy
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card className="mb-6">
//         <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList
//             className={`grid w-full ${
//               showUnitPlanning && showPracticalPlanning
//                 ? "grid-cols-5"
//                 : showUnitPlanning || showPracticalPlanning
//                   ? "grid-cols-4"
//                   : "grid-cols-3"
//             }`}
//           >
//             <TabsTrigger value="general-details">General Details</TabsTrigger>
//             {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
//             {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
//             <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="general-details">
//             <GeneralDetailsForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               openPdfViewer={openPdfViewer}
//               key={`general-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>

//           {showUnitPlanning && (
//             <TabsContent value="unit-planning">
//               <UnitPlanningForm
//                 lessonPlan={lessonPlan}
//                 setLessonPlan={setLessonPlan}
//                 key={`unit-${lessonPlan?.status}-${Date.now()}`}
//               />
//             </TabsContent>
//           )}

//           {showPracticalPlanning && (
//             <TabsContent value="practical-planning">
//               <PracticalPlanningForm
//                 lessonPlan={lessonPlan}
//                 setLessonPlan={setLessonPlan}
//                 userData={userData}
//                 key={`practical-${lessonPlan?.status}-${Date.now()}`}
//               />
//             </TabsContent>
//           )}

//           <TabsContent value="cie-planning">
//             <CIEPlanningForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               key={`cie-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>

//           <TabsContent value="additional-info">
//             <AdditionalInfoForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               key={`additional-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
// }























































// //@ts-nocheck
// //@ts-ignore
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Copy, X } from "lucide-react"
// import Link from "next/link"
// import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
// import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
// import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
// import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
// import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
// import { toast } from "sonner"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
// import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"
// import { supabase } from "@/utils/supabase/client"

// export default function EditLessonPlanPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { userData } = useDashboardContext()
//   const [activeTab, setActiveTab] = useState("general-details")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [lessonPlan, setLessonPlan] = useState<any>(null)
//   const [showPdfViewer, setShowPdfViewer] = useState(false)
//   const [pdfFile, setPdfFile] = useState<string | null>(null)
//   const [commonSubject, setCommonSubject] = useState<any>([])
//   const [copiedData, setCopiedData] = useState<any>([])
//   const [isCopying, setIsCopying] = useState(false)

//   // Fetch actual lesson plan data
//   useEffect(() => {
//     const loadLessonPlan = async () => {
//       try {
//         setIsLoading(true)
//         const result = await fetchLessonPlanById(params.id as string)

//         if (result.success) {
//           setLessonPlan(result.data)
//         } else {
//           toast.error(result.error || "Failed to load lesson plan")
//         }
//       } catch (error) {
//         console.error("Error loading lesson plan:", error)
//         toast.error("Failed to load lesson plan")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id && userData.id) {
//       loadLessonPlan()
//     }
//   }, [params.id, userData.id])

//   useEffect(() => {
//     const loadCopyLP = async () => {
//       const { data: commonSubject, error: commonSubjectError } = await supabase
//         .from("user_role")
//         .select("*, users(*), subjects(*), departments(*)")
//         .eq("subject_id", lessonPlan?.subject?.id)

//       if (commonSubject.length > 1) {
//         setCommonSubject(commonSubject)
//       } else {
//         console.error(commonSubjectError)
//       }
//     }

//     if (lessonPlan?.subject?.id) {
//       loadCopyLP()
//     }
//   }, [lessonPlan])

//   const handleSave = async () => {
//     setIsSaving(true)

//     // This would be replaced with an actual API call
//     setTimeout(() => {
//       toast.success("Lesson plan saved successfully")
//       setIsSaving(false)
//     }, 1500)
//   }

//   // 🎯 SIMPLIFIED COPY - Only populate form fields, NO database save
//   const handleCopy = async () => {
//     try {
//       setIsCopying(true)
//       console.log("🔄 Starting copy process...")

//       for (const subject of commonSubject) {
//         if (subject.id !== lessonPlan.id) {
//           console.log("📋 Copying from:", subject.users.name)

//           const { data: copyFormData, error: copyError } = await supabase
//             .from("forms")
//             .select("*, users(*), subjects(*, departments(*))")
//             .eq("faculty_id", subject.users.id)
//             .eq("subject_id", subject.subjects.id)

//           if (copyError) {
//             console.error("❌ Error fetching form data:", copyError)
//             toast.error("Failed to fetch form data for copying")
//             continue
//           }

//           if (copyFormData && copyFormData.length > 0) {
//             const sourceForm = copyFormData[0]
//             const formData = sourceForm.form

//             if (formData) {
//               console.log("📝 Loading copied data into form...")

//               // 🎯 ONLY UPDATE STATE - NO DATABASE SAVE
//               setLessonPlan((prevLessonPlan) => ({
//                 ...prevLessonPlan,
//                 // Copy General Details
//                 division: formData.generalDetails?.division || prevLessonPlan.division,
//                 lecture_hours: formData.generalDetails?.lecture_hours || prevLessonPlan.lecture_hours,
//                 lab_hours: formData.generalDetails?.lab_hours || prevLessonPlan.lab_hours,
//                 credits: formData.generalDetails?.credits || prevLessonPlan.credits,
//                 term_start_date: formData.generalDetails?.term_start_date || prevLessonPlan.term_start_date,
//                 term_end_date: formData.generalDetails?.term_end_date || prevLessonPlan.term_end_date,
//                 course_prerequisites:
//                   formData.generalDetails?.course_prerequisites || prevLessonPlan.course_prerequisites,
//                 course_prerequisites_materials:
//                   formData.generalDetails?.course_prerequisites_materials ||
//                   prevLessonPlan.course_prerequisites_materials,
//                 courseOutcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.courseOutcomes,
//                 course_outcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.course_outcomes,
//                 remarks: formData.generalDetails?.remarks || prevLessonPlan.remarks,

//                 // Copy Unit Planning
//                 unitPlanning: formData.unitPlanning || prevLessonPlan.unitPlanning,
//                 units: formData.unitPlanning?.units || prevLessonPlan.units,

//                 // Copy Practical Planning
//                 practicalPlanning: formData.practicalPlanning || prevLessonPlan.practicalPlanning,
//                 practicals: formData.practicalPlanning?.practicals || formData.practicals || prevLessonPlan.practicals,

//                 // Copy CIE Planning
//                 ciePlanning: formData.ciePlanning || prevLessonPlan.ciePlanning,
//                 cieDetails: formData.ciePlanning?.cieDetails || formData.cieDetails || prevLessonPlan.cieDetails,
//                 cie_components:
//                   formData.ciePlanning?.cie_components || formData.cie_components || prevLessonPlan.cie_components,
//                 cies: formData.ciePlanning?.cies || formData.cies || prevLessonPlan.cies,

//                 // Copy Additional Information
//                 additionalInfo: formData.additionalInfo || prevLessonPlan.additionalInfo,
//                 references: formData.additionalInfo?.references || formData.references || prevLessonPlan.references,
//                 additionalNotes:
//                   formData.additionalInfo?.additionalNotes ||
//                   formData.additionalNotes ||
//                   prevLessonPlan.additionalNotes,

//                 // Update status to indicate data is ready for editing
//                 status: "in_progress",
//                 general_details_completed: true,
//               }))

//               toast.success(`✅ Copied lesson plan data from ${subject.users.name}! You can now edit and save.`)
//               setCopiedData(copyFormData)
//               break // Exit loop after successful copy
//             } else {
//               toast.warning(`No completed form data found for ${subject.users.name}`)
//             }
//           } else {
//             toast.warning(`No lesson plan data found for ${subject.users.name}`)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("💥 Error in copy process:", error)
//       toast.error("Failed to copy lesson plan data")
//     } finally {
//       setIsCopying(false)
//     }
//   }

//   const openPdfViewer = (file: string) => {
//     setPdfFile(file)
//     setShowPdfViewer(true)
//   }

//   const closePdfViewer = () => {
//     setShowPdfViewer(false)
//     setPdfFile(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg">Loading lesson plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!lessonPlan) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg text-red-600">Failed to load lesson plan</p>
//           <Button asChild className="mt-4">
//             <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // Determine which tabs to show based on subject type
//   const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
//   const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

//   return (
//     <div className="p-8">
//       {/* PDF Viewer Modal */}
//       {showPdfViewer && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={closePdfViewer}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-4 overflow-auto">
//               {pdfFile ? (
//                 <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
//               ) : (
//                 <p>No PDF file specified</p>
//               )}
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={closePdfViewer}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">Lesson Planning</p>
//       </div>

//       <div className="flex items-center justify-between mb-6 mt-5">
//         <div className="flex items-center w-full gap-2">
//           <Link href={`/dashboard/lesson-plans`}>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
//           <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
//           {isSubjectTheoryOnly(lessonPlan?.subject) && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
//           )}
//           {isSubjectPracticalOnly(lessonPlan?.subject) && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
//           )}
//           {isSubjectBoth(lessonPlan?.subject) && (
//             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
//           )}
//           {lessonPlan?.is_sharing && (
//             <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//               Shared ({lessonPlan.sharing_faculty.length} Faculty)
//             </span>
//           )}

//           {commonSubject.length >= 2 && (
//             <Button
//               className="ml-auto bg-green-600 hover:bg-green-700 text-white"
//               onClick={handleCopy}
//               disabled={isCopying}
//             >
//               <Copy className="mr-2" />
//               {isCopying ? "Copying..." : "Copy"}
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card className="mb-6">
//         <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList
//             className={`grid w-full ${
//               showUnitPlanning && showPracticalPlanning
//                 ? "grid-cols-5"
//                 : showUnitPlanning || showPracticalPlanning
//                   ? "grid-cols-4"
//                   : "grid-cols-3"
//             }`}
//           >
//             <TabsTrigger value="general-details">General Details</TabsTrigger>
//             {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
//             {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
//             <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="general-details">
//             <GeneralDetailsForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               openPdfViewer={openPdfViewer}
//               key={`general-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>

//           {showUnitPlanning && (
//             <TabsContent value="unit-planning">
//               <UnitPlanningForm
//                 lessonPlan={lessonPlan}
//                 setLessonPlan={setLessonPlan}
//                 key={`unit-${lessonPlan?.status}-${Date.now()}`}
//               />
//             </TabsContent>
//           )}

//           {showPracticalPlanning && (
//             <TabsContent value="practical-planning">
//               <PracticalPlanningForm
//                 lessonPlan={lessonPlan}
//                 setLessonPlan={setLessonPlan}
//                 userData={userData}
//                 key={`practical-${lessonPlan?.status}-${Date.now()}`}
//               />
//             </TabsContent>
//           )}

//           <TabsContent value="cie-planning">
//             <CIEPlanningForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               key={`cie-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>

//           <TabsContent value="additional-info">
//             <AdditionalInfoForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               key={`additional-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
// }











// //@ts-nocheck
// //@ts-ignore
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Copy, X } from "lucide-react"
// import Link from "next/link"
// import GeneralDetailsForm from "@/components/lesson-plan/GeneralDetailsForm"
// import UnitPlanningForm from "@/components/lesson-plan/UnitPlanningForm"
// import PracticalPlanningForm from "@/components/lesson-plan/PracticalPlanningForm"
// import CIEPlanningForm from "@/components/lesson-plan/CIEPlanningForm"
// import AdditionalInfoForm from "@/components/lesson-plan/AdditionalInfoForm"
// import { toast } from "sonner"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { isSubjectTheoryOnly, isSubjectPracticalOnly, isSubjectBoth } from "@/utils/dateUtils"
// import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"
// import { supabase } from "@/utils/supabase/client"

// export default function EditLessonPlanPage() {
//   const router = useRouter()
//   const params = useParams()
//   const { userData } = useDashboardContext()
//   const [activeTab, setActiveTab] = useState("general-details")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [lessonPlan, setLessonPlan] = useState<any>(null)
//   const [showPdfViewer, setShowPdfViewer] = useState(false)
//   const [pdfFile, setPdfFile] = useState<string | null>(null)
//   const [commonSubject, setCommonSubject] = useState<any>([])
//   const [copiedData, setCopiedData] = useState<any>([])
//   const [isCopying, setIsCopying] = useState(false)

//   // Fetch actual lesson plan data
//   useEffect(() => {
//     const loadLessonPlan = async () => {
//       try {
//         setIsLoading(true)
//         const result = await fetchLessonPlanById(params.id as string)

//         if (result.success) {
//           setLessonPlan(result.data)
//         } else {
//           toast.error(result.error || "Failed to load lesson plan")
//         }
//       } catch (error) {
//         console.error("Error loading lesson plan:", error)
//         toast.error("Failed to load lesson plan")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id && userData.id) {
//       loadLessonPlan()
//     }
//   }, [params.id, userData.id])

//   useEffect(() => { 
//     const loadCopyLP = async () => {
//       if (!lessonPlan?.subject?.code) {
//         console.log("No subject code found")
//         return
//       }

//       try {
//         console.log("🔍 Searching for subject code:", lessonPlan.subject.code)

//         // Step 1: Find all subjects with the same code across departments
//         const { data: allSubjectsWithCode, error: subjectsError } = await supabase
//           .from("subjects")
//           .select("id, code, name, department_id")
//           .eq("code", lessonPlan.subject.code)

//         if (subjectsError) {
//           console.error("Error fetching subjects:", subjectsError)
//           return
//         }

//         if (!allSubjectsWithCode || allSubjectsWithCode.length <= 1) {
//           console.log("No other subjects found with code:", lessonPlan.subject.code)
//           setCommonSubject([])
//           return
//         }

//         // Step 2: Get all subject IDs
//         const subjectIds = allSubjectsWithCode.map((subject) => subject.id)
//         console.log("Found subject IDs:", subjectIds)

//         // Step 3: Find faculty assigned to any of these subjects
//         const { data: facultyWithSubjects, error: facultyError } = await supabase
//           .from("user_role")
//           .select("*, users(*), subjects(*), departments(*)")
//           .in("subject_id", subjectIds)

//         if (facultyError) {
//           console.error("Error fetching faculty:", facultyError)
//           return
//         }

//         console.log("Found faculty with same subject code:", facultyWithSubjects?.length)

//         if (facultyWithSubjects && facultyWithSubjects.length > 1) {
//           setCommonSubject(facultyWithSubjects)
//           console.log("✅ Copy button should now appear")
//         } else {
//           setCommonSubject([])
//           console.log("❌ Not enough faculty found for copy functionality")
//         }
//       } catch (error) {
//         console.error("Error in loadCopyLP:", error)
//         setCommonSubject([])
//       }
//     }

//     if (lessonPlan?.subject?.code) {
//       loadCopyLP()
//     }
//   }, [lessonPlan?.subject?.code])

//   const handleSave = async () => {
//     setIsSaving(true)

//     // This would be replaced with an actual API call
//     setTimeout(() => {
//       toast.success("Lesson plan saved successfully")
//       setIsSaving(false)
//     }, 1500)
//   }

//   // 🎯 SIMPLIFIED COPY - Only populate form fields, NO database save
//   const handleCopy = async () => {
//     try {
//       setIsCopying(true)
//       console.log("🔄 Starting copy process...")

//       for (const subject of commonSubject) {
//         if (subject.id !== lessonPlan.id) {
//           console.log("📋 Copying from:", subject.users.name)

//           const { data: copyFormData, error: copyError } = await supabase
//             .from("forms")
//             .select("*, users(*), subjects(*, departments(*))")
//             .eq("faculty_id", subject.users.id)
//             .eq("subject_id", subject.subjects.id)

//           if (copyError) {
//             console.error("❌ Error fetching form data:", copyError)
//             toast.error("Failed to fetch form data for copying")
//             continue
//           }

//           if (copyFormData && copyFormData.length > 0) {
//             const sourceForm = copyFormData[0]
//             const formData = sourceForm.form

//             if (formData) {
//               console.log("📝 Loading copied data into form...")

//               // 🎯 ONLY UPDATE STATE - NO DATABASE SAVE
//               setLessonPlan((prevLessonPlan) => ({
//                 ...prevLessonPlan,
//                 // Copy General Details
//                 division: formData.generalDetails?.division || prevLessonPlan.division,
//                 lecture_hours: formData.generalDetails?.lecture_hours || prevLessonPlan.lecture_hours,
//                 lab_hours: formData.generalDetails?.lab_hours || prevLessonPlan.lab_hours,
//                 credits: formData.generalDetails?.credits || prevLessonPlan.credits,
//                 term_start_date: formData.generalDetails?.term_start_date || prevLessonPlan.term_start_date,
//                 term_end_date: formData.generalDetails?.term_end_date || prevLessonPlan.term_end_date,
//                 course_prerequisites:
//                   formData.generalDetails?.course_prerequisites || prevLessonPlan.course_prerequisites,
//                 course_prerequisites_materials:
//                   formData.generalDetails?.course_prerequisites_materials ||
//                   prevLessonPlan.course_prerequisites_materials,
//                 courseOutcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.courseOutcomes,
//                 course_outcomes: formData.generalDetails?.courseOutcomes || prevLessonPlan.course_outcomes,
//                 remarks: formData.generalDetails?.remarks || prevLessonPlan.remarks,

//                 // Copy Unit Planning
//                 unitPlanning: formData.unitPlanning || prevLessonPlan.unitPlanning,
//                 units: formData.unitPlanning?.units || prevLessonPlan.units,

//                 // Copy Practical Planning
//                 practicalPlanning: formData.practicalPlanning || prevLessonPlan.practicalPlanning,
//                 practicals: formData.practicalPlanning?.practicals || formData.practicals || prevLessonPlan.practicals,

//                 // Copy CIE Planning
//                 ciePlanning: formData.ciePlanning || prevLessonPlan.ciePlanning,
//                 cieDetails: formData.ciePlanning?.cieDetails || formData.cieDetails || prevLessonPlan.cieDetails,
//                 cie_components:
//                   formData.ciePlanning?.cie_components || formData.cie_components || prevLessonPlan.cie_components,
//                 cies: formData.ciePlanning?.cies || formData.cies || prevLessonPlan.cies,

//                 // Copy Additional Information
//                 additionalInfo: formData.additionalInfo || prevLessonPlan.additionalInfo,
//                 references: formData.additionalInfo?.references || formData.references || prevLessonPlan.references,
//                 additionalNotes:
//                   formData.additionalInfo?.additionalNotes ||
//                   formData.additionalNotes ||
//                   prevLessonPlan.additionalNotes,

//                 // Update status to indicate data is ready for editing
//                 status: "in_progress",
//                 general_details_completed: true,
//               }))

//               toast.success(`Copied lesson plan data from ${subject.users.name}! You can now edit and save.`)
//               setCopiedData(copyFormData)
//               break // Exit loop after successful copy
//             } else {
//               toast.warning(`No completed form data found for ${subject.users.name}`)
//             }
//           } else {
//             toast.warning(`No lesson plan data found for ${subject.users.name}`)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("💥 Error in copy process:", error)
//       toast.error("Failed to copy lesson plan data")
//     } finally {
//       setIsCopying(false)
//     }
//   }

//   const openPdfViewer = (file: string) => {
//     setPdfFile(file)
//     setShowPdfViewer(true)
//   }

//   const closePdfViewer = () => {
//     setShowPdfViewer(false)
//     setPdfFile(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg">Loading lesson plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!lessonPlan) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center py-12">
//           <p className="text-lg text-red-600">Failed to load lesson plan</p>
//           <Button asChild className="mt-4">
//             <Link href="/dashboard/lesson-plans">Back to Lesson Plans</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // Determine which tabs to show based on subject type
//   const showUnitPlanning = !isSubjectPracticalOnly(lessonPlan?.subject)
//   const showPracticalPlanning = !isSubjectTheoryOnly(lessonPlan?.subject)

//   return (
//     <div className="p-8">
//       {/* PDF Viewer Modal */}
//       {showPdfViewer && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h3 className="text-lg font-semibold">Course Prerequisites Instructions</h3>
//               <Button variant="ghost" size="icon" onClick={closePdfViewer}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 p-4 overflow-auto">
//               {pdfFile ? (
//                 <iframe src={`/annexure-i.pdf`} className="w-full h-full" title="PDF Viewer" />
//               ) : (
//                 <p>No PDF file specified</p>
//               )}
//             </div>
//             <div className="p-4 border-t flex justify-end">
//               <Button variant="outline" onClick={closePdfViewer}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">Lesson Planning</p>
//       </div>

//       <div className="flex items-center justify-between mb-6 mt-5">
//         <div className="flex items-center w-full gap-2">
//           <Link href={`/dashboard/lesson-plans`}>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h2 className="text-xl font-semibold">{lessonPlan?.subject?.name}</h2>
//           <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{lessonPlan?.subject?.code}</span>
//           {isSubjectTheoryOnly(lessonPlan?.subject) && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Theory Only</span>
//           )}
//           {isSubjectPracticalOnly(lessonPlan?.subject) && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Practical Only</span>
//           )}
//           {isSubjectBoth(lessonPlan?.subject) && (
//             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Theory + Practical</span>
//           )}
//           {lessonPlan?.is_sharing && (
//             <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//               Shared ({lessonPlan.sharing_faculty.length} Faculty)
//             </span>
//           )}

//           {commonSubject.length >= 2 && (
//             <Button
//               className="ml-auto text-white"
//               onClick={handleCopy}
//               disabled={isCopying}
//             >
//               <Copy className="mr-2" />
//               {isCopying ? "Copying..." : "Copy"}
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card className="mb-6">
//         <Tabs defaultValue="general-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList
//             className={`grid w-full ${
//               showUnitPlanning && showPracticalPlanning
//                 ? "grid-cols-5"
//                 : showUnitPlanning || showPracticalPlanning
//                   ? "grid-cols-4"
//                   : "grid-cols-3"
//             }`}
//           >
//             <TabsTrigger value="general-details">General Details</TabsTrigger>
//             {showUnitPlanning && <TabsTrigger value="unit-planning">Unit Planning</TabsTrigger>}
//             {showPracticalPlanning && <TabsTrigger value="practical-planning">Practical Planning</TabsTrigger>}
//             <TabsTrigger value="cie-planning">CIE Planning</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
//           </TabsList>

//           <TabsContent value="general-details">
//             <GeneralDetailsForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               openPdfViewer={openPdfViewer}
//               key={`general-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>

//           {showUnitPlanning && (
//             <TabsContent value="unit-planning">
//               <UnitPlanningForm
//                 lessonPlan={lessonPlan}
//                 setLessonPlan={setLessonPlan}
//                 key={`unit-${lessonPlan?.status}-${Date.now()}`}
//               />
//             </TabsContent>
//           )}

//           {showPracticalPlanning && (
//             <TabsContent value="practical-planning">
//               <PracticalPlanningForm
//                 lessonPlan={lessonPlan}
//                 setLessonPlan={setLessonPlan}
//                 userData={userData}
//                 key={`practical-${lessonPlan?.status}-${Date.now()}`}
//               />
//             </TabsContent>
//           )}

//           <TabsContent value="cie-planning">
//             <CIEPlanningForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               key={`cie-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>

//           <TabsContent value="additional-info">
//             <AdditionalInfoForm
//               lessonPlan={lessonPlan}
//               setLessonPlan={setLessonPlan}
//               key={`additional-${lessonPlan?.status}-${Date.now()}`}
//             />
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
// }




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

  // 🎯 SIMPLIFIED COPY - Only populate form fields, NO database save
  const handleCopy = async () => {
    try {
      setIsCopying(true)
      console.log("🔄 Starting copy process...")

      for (const subject of commonSubject) {
        if (subject.id !== lessonPlan.id) {
          console.log("📋 Copying from:", subject.users.name)

          const { data: copyFormData, error: copyError } = await supabase
            .from("forms")
            .select("*, users(*), subjects(*, departments(*))")
            .eq("faculty_id", subject.users.id)
            .eq("subject_id", subject.subjects.id)

          if (copyError) {
            console.error("❌ Error fetching form data:", copyError)
            toast.error("Failed to fetch form data for copying")
            continue
          }

          if (copyFormData && copyFormData.length > 0) {
            const sourceForm = copyFormData[0]
            const formData = sourceForm.form

            if (formData) {
              console.log("📝 Loading copied data into form...")

              // 🎯 ONLY UPDATE STATE - NO DATABASE SAVE
              setLessonPlan((prevLessonPlan) => ({
                ...prevLessonPlan,
                // Copy General Details
                division: formData.generalDetails?.division || prevLessonPlan.division,
                lecture_hours: formData.generalDetails?.lecture_hours || prevLessonPlan.lecture_hours,
                lab_hours: formData.generalDetails?.lab_hours || prevLessonPlan.lab_hours,
                credits: formData.generalDetails?.credits || prevLessonPlan.credits,
                term_start_date: formData.generalDetails?.term_start_date || prevLessonPlan.term_start_date,
                term_end_date: formData.generalDetails?.term_end_date || prevLessonPlan.term_end_date,
                course_prerequisites:
                  formData.generalDetails?.course_prerequisites || prevLessonPlan.course_prerequisites,
                course_prerequisites_materials:
                  formData.generalDetails?.course_prerequisites_materials ||
                  prevLessonPlan.course_prerequisites_materials,
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

                // Copy Additional Information
                additionalInfo: formData.additionalInfo || prevLessonPlan.additionalInfo,
                references: formData.additionalInfo?.references || formData.references || prevLessonPlan.references,
                additionalNotes:
                  formData.additionalInfo?.additionalNotes ||
                  formData.additionalNotes ||
                  prevLessonPlan.additionalNotes,

                // Update status to indicate data is ready for editing
                status: "in_progress",
                general_details_completed: true,
              }))

              toast.success(`✅ Copied lesson plan data from ${subject.users.name}! You can now edit and save.`)
              setCopiedData(copyFormData)
              break // Exit loop after successful copy
            } else {
              toast.warning(`No completed form data found for ${subject.users.name}`)
            }
          } else {
            toast.warning(`No lesson plan data found for ${subject.users.name}`)
          }
        }
      }
    } catch (error) {
      console.error("💥 Error in copy process:", error)
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
            <Button
              className="ml-auto bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCopy}
              disabled={isCopying}
            >
              <Copy className="mr-2" />
              {isCopying ? "Copying..." : "Copy"}
            </Button>
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
            {/* FIXED: Remove the problematic key prop with Date.now() */}
            <GeneralDetailsForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} openPdfViewer={openPdfViewer} />
          </TabsContent>

          {showUnitPlanning && (
            <TabsContent value="unit-planning">
              {/* FIXED: Remove the problematic key prop with Date.now() */}
              <UnitPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
            </TabsContent>
          )}

          {showPracticalPlanning && (
            <TabsContent value="practical-planning">
              {/* FIXED: Remove the problematic key prop with Date.now() */}
              <PracticalPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} userData={userData} />
            </TabsContent>
          )}

          <TabsContent value="cie-planning">
            {/* FIXED: Remove the problematic key prop with Date.now() */}
            <CIEPlanningForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
          </TabsContent>

          <TabsContent value="additional-info">
            {/* FIXED: Remove the problematic key prop with Date.now() */}
            <AdditionalInfoForm lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
