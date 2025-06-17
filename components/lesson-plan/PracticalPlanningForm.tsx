// //@ts-nocheck
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, Trash2, AlertTriangle, Info } from "lucide-react"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import { supabase } from "@/utils/supabase/client"
// import { savePracticalPlanningForm } from "@/app/dashboard/actions/savePracticalPlanningForm"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { saveFormDraft, loadFormDraft, deleteFormDraft } from "@/app/dashboard/actions/saveFormDraft"

// interface PSOPEOItem {
//   id: string
//   label?: string
//   description: string
// }

// interface PracticalPlanningFormProps {
//   lessonPlan: any
//   setLessonPlan: React.Dispatch<React.SetStateAction<any>>
//   userData: any
// }

// // Practical Pedagogy Options
// const practicalPedagogyOptions = [
//   "Problem-Based/Case Study Learning",
//   "Project-Based Learning",
//   "Collaborative Learning",
//   "Code Walkthroughs",
//   "Self-Learning with Guidance",
//   "Experiential Learning",
//   "Flipped Laboratory",
//   "Pair Programming",
//   "Peer Learning",
//   "Research-Oriented Practical",
//   "Other",
// ]

// // Evaluation Method Options
// const evaluationMethodOptions = [
//   "Viva",
//   "Lab Performance",
//   "File Submission",
//   "Mini-Project",
//   "Code Review",
//   "Peer Evaluation",
//   "Presentation",
//   "Other",
// ]

// // Bloom's Taxonomy Options for Practicals
// const bloomsTaxonomyOptions = ["Apply", "Analyze", "Evaluate", "Create"]

// // Skill Mapping Options
// const skillMappingOptions = [
//   "Technical Skills",
//   "Cognitive Skills",
//   "Professional Skills",
//   "Research and Innovation Skills",
//   "Entrepreneurial or Managerial Skills",
//   "Communication Skills",
//   "Leadership and Teamwork Skills",
//   "Creativity and Design Thinking Skills",
//   "Ethical, Social, and Environmental Awareness Skills",
// ]

// // Default PSO/PEO options if none are found
// const defaultPsoOptions = [
//   { id: "pso-1", label: "PSO1", description: "Program Specific Outcome 1" },
//   { id: "pso-2", label: "PSO2", description: "Program Specific Outcome 2" },
//   { id: "pso-3", label: "PSO3", description: "Program Specific Outcome 3" },
//   { id: "pso-4", label: "PSO4", description: "Program Specific Outcome 4" },
//   { id: "pso-5", label: "PSO5", description: "Program Specific Outcome 5" },
// ]

// const defaultPeoOptions = [
//   { id: "peo-1", label: "PEO1", description: "Program Educational Objective 1" },
//   { id: "peo-2", label: "PEO2", description: "Program Educational Objective 2" },
//   { id: "peo-3", label: "PEO3", description: "Program Educational Objective 3" },
//   { id: "peo-4", label: "PEO4", description: "Program Educational Objective 4" },
//   { id: "pso-5", label: "PEO5", description: "Program Educational Objective 5" },
// ]

// export default function PracticalPlanningForm({ lessonPlan, setLessonPlan, userData }: PracticalPlanningFormProps) {
//   const [activePractical, setActivePractical] = useState(0)
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [validationWarnings, setValidationWarnings] = useState<string[]>([])
//   const [departmentPsoPeo, setDepartmentPsoPeo] = useState<{
//     pso_data: PSOPEOItem[]
//     peo_data: PSOPEOItem[]
//   }>({
//     pso_data: [],
//     peo_data: [],
//   })
//   const [loadingPsoPeo, setLoadingPsoPeo] = useState(false)
//   const [psoPeoError, setPsoPeoError] = useState<string | null>(null)
//   const [saving, setSaving] = useState(false)
//   const [warningDialogOpen, setWarningDialogOpen] = useState(false)
//   const [currentWarning, setCurrentWarning] = useState("")
//   const [isSavingDraft, setIsSavingDraft] = useState(false)
//   const [lastSaved, setLastSaved] = useState<Date | null>(null)
//   const [showOtherSkillInput, setShowOtherSkillInput] = useState(false)
//   const [otherSkillValue, setOtherSkillValue] = useState("")
//   const [showOtherPedagogyInput, setShowOtherPedagogyInput] = useState(false)
//   const [otherPedagogyValue, setOtherPedagogyValue] = useState("")
//   const [showOtherEvaluationInput, setShowOtherEvaluationInput] = useState(false)
//   const [otherEvaluationValue, setOtherEvaluationValue] = useState("")
//   // Term dates from metadata
//   const [termDates, setTermDates] = useState<{
//     startDate: string
//     endDate: string
//   }>({
//     startDate: "",
//     endDate: "",
//   })
//   // Debug state for term dates
//   const [debugInfo, setDebugInfo] = useState<{
//     termStartDate: string
//     termEndDate: string
//     lessonPlanDates: {
//       start: string
//       end: string
//     }
//     metadataDates: {
//       start: string
//       end: string
//     }
//   }>({
//     termStartDate: "",
//     termEndDate: "",
//     lessonPlanDates: {
//       start: "",
//       end: "",
//     },
//     metadataDates: {
//       start: "",
//       end: "",
//     },
//   })
//   // Week options state
//   const [weekOptions, setWeekOptions] = useState<string[]>([])

//   // Field-specific error states
//   const [practicalAimError, setPracticalAimError] = useState("")
//   const [associatedUnitsError, setAssociatedUnitsError] = useState("")
//   const [probableWeekError, setProbableWeekError] = useState("")
//   const [labHoursError, setLabHoursError] = useState("")
//   const [softwareHardwareError, setSoftwareHardwareError] = useState("")
//   const [practicalTasksError, setPracticalTasksError] = useState("")
//   const [evaluationMethodsError, setEvaluationMethodsError] = useState("")
//   const [practicalPedagogyError, setPracticalPedagogyError] = useState("")
//   const [referenceError, setReferenceError] = useState("")
//   const [coMappingError, setCoMappingError] = useState("")
//   const [bloomsError, setBloomsError] = useState("")
//   const [skillMappingError, setSkillMappingError] = useState("")
//   const [skillObjectivesError, setSkillObjectivesError] = useState("")

//   // Add this to your state variables at the top of the component
//   const [isLoadingDraft, setIsLoadingDraft] = useState(true)

//   // FIXED: Check if subject is practical-only
//   const isPracticalOnly = lessonPlan?.subject?.is_practical === true && lessonPlan?.subject?.is_theory === false

//   // Initialize practicals if empty
//   useEffect(() => {
//     if (!lessonPlan.practicals || lessonPlan.practicals.length === 0) {
//       const initialPractical = {
//         id: "practical1",
//         practical_aim: "",
//         associated_units: [],
//         probable_week: "",
//         lab_hours: 2,
//         software_hardware_requirements: "",
//         practical_tasks: "",
//         evaluation_methods: [],
//         other_evaluation_method: "",
//         practical_pedagogy: "",
//         other_pedagogy: "",
//         reference_material: "",
//         co_mapping: [],
//         pso_mapping: [],
//         peo_mapping: [],
//         blooms_taxonomy: [],
//         skill_mapping: [],
//         skill_objectives: "",
//       }

//       setLessonPlan((prev: any) => ({
//         ...prev,
//         practicals: [initialPractical],
//       }))
//     }
//   }, [lessonPlan?.practicals, setLessonPlan])

//  ///jills change
//  useEffect(() => {
//   const loadPsoPeoData = async () => {
//     if (!lessonPlan.subject?.id) return

//     setLoadingPsoPeo(true)
//     setPsoPeoError(null)

//     try {
//       // Step 1: Get the department_id from the subject
//       const { data: subjectData, error: subjectError } = await supabase
//         .from("subjects")
//         .select("department_id")
//         .eq("id", lessonPlan.subject.id)
//         .single()

//       if (subjectError || !subjectData?.department_id) {
//         throw new Error("Failed to fetch subject's department.")
//       }

//       const departmentId = subjectData.department_id

//       // Step 2: Fetch PSO/PEO data from department_pso_peo
//       const { data: deptPsoPeo, error: deptError } = await supabase
//         .from("department_pso_peo")
//         .select("pso_data, peo_data")
//         .eq("department_id", departmentId)
//         .single()

//       let psoData = defaultPsoOptions
//       let peoData = defaultPeoOptions

//       if (!deptError && deptPsoPeo) {
//         if (Array.isArray(deptPsoPeo.pso_data)) {
//           psoData = deptPsoPeo.pso_data
//         }

//         if (Array.isArray(deptPsoPeo.peo_data)) {
//           peoData = deptPsoPeo.peo_data
//         }
//       } else {
//         console.warn("Falling back to default PSO/PEO due to missing department data or error.")
//       }

//       // Step 3: Set data to state
//       setDepartmentPsoPeo({
//         pso_data: psoData,
//         peo_data: peoData,
//       })

//       console.log("Loaded PSO/PEO from department_pso_peo:", {
//         pso_count: psoData.length,
//         peo_count: peoData.length,
//       })
//     } catch (error) {
//       console.error("Error loading PSO/PEO:", error)
//       setPsoPeoError("Failed to load PSO/PEO. Default values used.")

//       setDepartmentPsoPeo({
//         pso_data: defaultPsoOptions,
//         peo_data: defaultPeoOptions,
//       })
//     } finally {
//       setLoadingPsoPeo(false)
//     }
//   }

//   loadPsoPeoData()
// }, [lessonPlan.subject?.id])


//   // Fetch term dates from metadata and generate week options
//   useEffect(() => {
//     const fetchTermDates = async () => {
//       try {
//         if (!lessonPlan?.subject?.code) {
//           console.log("DEBUG - No subject code available")
//           return
//         }

//         console.log("DEBUG - Fetching term dates for subject code:", lessonPlan.subject.code)

//         const { data, error } = await supabase
//           .from("subjects")
//           .select("metadata")
//           .eq("code", lessonPlan.subject.code)
//           .single()

//         if (error) {
//           console.error("DEBUG - Error fetching subject metadata:", error)
//           return
//         }

//         if (!data) {
//           console.log("DEBUG - No data returned for subject")
//           return
//         }

//         console.log("DEBUG - Raw metadata from database:", data.metadata)

//         let metadata = data.metadata
//         if (typeof metadata === "string") {
//           try {
//             metadata = JSON.parse(metadata)
//             console.log("DEBUG - Parsed metadata:", metadata)
//           } catch (e) {
//             console.error("DEBUG - Error parsing metadata string:", e)
//             return
//           }
//         }

//         // Get term dates from metadata
//         const startDate = metadata?.term_start_date || ""
//         const endDate = metadata?.term_end_date || ""

//         // Update term dates state
//         setTermDates({
//           startDate,
//           endDate,
//         })

//         // Update debug info
//         setDebugInfo((prev) => ({
//           ...prev,
//           termStartDate: startDate,
//           termEndDate: endDate,
//           lessonPlanDates: {
//             start: lessonPlan?.term_start_date || "Not set in lessonPlan",
//             end: lessonPlan?.term_end_date || "Not set in lessonPlan",
//           },
//           metadataDates: {
//             start: startDate,
//             end: endDate,
//           },
//         }))

//         console.log("DEBUG - Term dates from metadata:", {
//           term_start_date: startDate,
//           term_end_date: endDate,
//         })

//         // Generate week options based on metadata dates
//         if (startDate && endDate) {
//           const weeks = generateWeekOptions(startDate, endDate)
//           setWeekOptions(weeks)
//         }
//       } catch (error) {
//         console.error("DEBUG - Unexpected error fetching term dates:", error)
//       }
//     }

//     fetchTermDates()
//   }, [lessonPlan?.subject?.code])

//   // Replace the existing useEffect for loading drafts with this improved implementation
//   useEffect(() => {
//     console.log("🔍 PRACTICAL AUTO-LOAD: useEffect triggered")
//     console.log("🔍 PRACTICAL AUTO-LOAD: Dependencies:", {
//       userId: userData?.id,
//       subjectId: lessonPlan?.subject?.id,
//       facultyId: lessonPlan?.faculty?.id,
//       hasUserData: !!userData,
//       hasLessonPlan: !!lessonPlan,
//       hasSubject: !!lessonPlan?.subject,
//     })

//     // Auto-load draft immediately when component mounts and required data is available
//     const autoLoadDraft = async () => {
//       console.log("🔍 PRACTICAL AUTO-LOAD: autoLoadDraft function called")

//       // Check if we have all required data - we need either userData.id OR faculty.id from lesson plan
//       const facultyId = lessonPlan?.faculty?.id || userData?.id
//       const subjectId = lessonPlan?.subject?.id

//       if (!facultyId || !subjectId) {
//         console.log("❌ PRACTICAL AUTO-LOAD: Missing required data:", {
//           facultyId,
//           subjectId,
//           userDataId: userData?.id,
//           lessonPlanFacultyId: lessonPlan?.faculty?.id,
//           hasLessonPlan: !!lessonPlan,
//           hasSubject: !!lessonPlan?.subject,
//         })
//         setIsLoadingDraft(false)
//         return
//       }

//       console.log("✅ PRACTICAL AUTO-LOAD: Required data available - Faculty ID:", facultyId, "Subject ID:", subjectId)

//       // Check if we already have practicals data to avoid unnecessary loading
//       const currentPracticals = lessonPlan.practicals || []
//       const hasExistingData = currentPracticals.length > 0 && currentPracticals[0]?.practical_aim

//       console.log("🔍 PRACTICAL AUTO-LOAD: Existing data check:", {
//         practicalsLength: currentPracticals.length,
//         firstPracticalAim: currentPracticals[0]?.practical_aim,
//         hasExistingData,
//         fullPracticals: currentPracticals,
//       })

//       if (hasExistingData) {
//         console.log("⏭️ PRACTICAL AUTO-LOAD: Practicals already loaded, skipping auto-load")
//         setIsLoadingDraft(false)
//         return
//       }

//       console.log("🚀 PRACTICAL AUTO-LOAD: Starting auto-load process...")
//       setIsLoadingDraft(true)

//       try {
//         console.log("🔍 PRACTICAL AUTO-LOAD: Using faculty ID:", facultyId)
//         console.log("🔍 PRACTICAL AUTO-LOAD: Using subject ID:", subjectId)

//         console.log("📡 PRACTICAL AUTO-LOAD: Making API call to loadFormDraft...")
//         const result = await loadFormDraft(facultyId, subjectId, "practical_planning")

//         console.log("📡 PRACTICAL AUTO-LOAD: API response:", result)

//         if (result.success && result.data) {
//           const data = result.data
//           console.log("✅ PRACTICAL AUTO-LOAD: Draft data received:", data)

//           // Check if we have valid practical data structure
//           if (data.practicals && Array.isArray(data.practicals) && data.practicals.length > 0) {
//             console.log("✅ PRACTICAL AUTO-LOAD: Valid practicals found:", data.practicals.length)

//             // Ensure each practical has proper structure
//             const validPracticals = data.practicals.map((practical: any, index: number) => {
//               const validPractical = {
//                 ...practical,
//                 // Ensure all required fields have default values
//                 id: practical.id || `practical${index + 1}`,
//                 practical_aim: practical.practical_aim || "",
//                 associated_units: Array.isArray(practical.associated_units) ? practical.associated_units : [],
//                 probable_week: practical.probable_week || "",
//                 lab_hours: typeof practical.lab_hours === "number" ? practical.lab_hours : 2,
//                 software_hardware_requirements: practical.software_hardware_requirements || "",
//                 practical_tasks: practical.practical_tasks || "",
//                 evaluation_methods: Array.isArray(practical.evaluation_methods) ? practical.evaluation_methods : [],
//                 other_evaluation_method: practical.other_evaluation_method || "",
//                 practical_pedagogy: practical.practical_pedagogy || "",
//                 other_pedagogy: practical.other_pedagogy || "",
//                 reference_material: practical.reference_material || "",
//                 co_mapping: Array.isArray(practical.co_mapping) ? practical.co_mapping : [],
//                 pso_mapping: Array.isArray(practical.pso_mapping) ? practical.pso_mapping : [],
//                 peo_mapping: Array.isArray(practical.peo_mapping) ? practical.peo_mapping : [],
//                 blooms_taxonomy: Array.isArray(practical.blooms_taxonomy) ? practical.blooms_taxonomy : [],
//                 skill_mapping: Array.isArray(practical.skill_mapping) ? practical.skill_mapping : [],
//                 skill_objectives: practical.skill_objectives || "",
//               }
//               console.log(`🔍 PRACTICAL AUTO-LOAD: Processed practical ${index + 1}:`, validPractical)
//               return validPractical
//             })

//             console.log("🔄 PRACTICAL AUTO-LOAD: Setting practicals to lesson plan...")

//             // Update the lesson plan with loaded data
//             setLessonPlan((prev: any) => {
//               console.log("🔄 PRACTICAL AUTO-LOAD: Previous lesson plan:", prev)
//               const updated = {
//                 ...prev,
//                 practicals: validPracticals,
//                 practical_remarks: data.remarks || "",
//               }
//               console.log("🔄 PRACTICAL AUTO-LOAD: Updated lesson plan:", updated)
//               return updated
//             })

//             console.log("🎉 PRACTICAL AUTO-LOAD: Success! Showing toast...")
//             toast.success(`Draft loaded automatically with ${validPracticals.length} practical(s)`)

//             // Set last saved time if available
//             if (data.savedAt) {
//               setLastSaved(new Date(data.savedAt))
//               console.log("🔍 PRACTICAL AUTO-LOAD: Set last saved time:", data.savedAt)
//             } else {
//               setLastSaved(new Date())
//               console.log("🔍 PRACTICAL AUTO-LOAD: Set current time as last saved")
//             }
//           } else {
//             console.log("❌ PRACTICAL AUTO-LOAD: No valid practical data found in draft")
//             console.log("🔍 PRACTICAL AUTO-LOAD: Data structure:", {
//               hasPracticals: !!data.practicals,
//               isArray: Array.isArray(data.practicals),
//               length: data.practicals?.length,
//               practicals: data.practicals,
//             })
//           }
//         } else {
//           console.log("❌ PRACTICAL AUTO-LOAD: No draft found or failed to load")
//           console.log("🔍 PRACTICAL AUTO-LOAD: Result details:", {
//             success: result.success,
//             hasData: !!result.data,
//             error: result.error,
//           })
//         }
//       } catch (error) {
//         console.error("💥 PRACTICAL AUTO-LOAD: Error occurred:", error)
//         toast.error("Failed to auto-load draft")
//       } finally {
//         console.log("🏁 PRACTICAL AUTO-LOAD: Process completed, setting loading to false")
//         setIsLoadingDraft(false)
//       }
//     }

//     // Run auto-load when we have the required data (either userData.id OR faculty.id from lesson plan)
//     const facultyId = lessonPlan?.faculty?.id || userData?.id
//     const subjectId = lessonPlan?.subject?.id

//     if (facultyId && subjectId) {
//       console.log("✅ PRACTICAL AUTO-LOAD: Conditions met, calling autoLoadDraft")
//       autoLoadDraft()
//     } else {
//       console.log("❌ PRACTICAL AUTO-LOAD: Conditions not met, skipping auto-load")
//       console.log("🔍 PRACTICAL AUTO-LOAD: Missing:", {
//         facultyId: !!facultyId,
//         subjectId: !!subjectId,
//         userDataId: !!userData?.id,
//         lessonPlanFacultyId: !!lessonPlan?.faculty?.id,
//       })
//       setIsLoadingDraft(false)
//     }
//   }, [userData?.id, lessonPlan?.subject?.id, lessonPlan, setLessonPlan, userData, lessonPlan?.faculty?.id])

//   const handlePracticalChange = (index: number, field: string, value: any) => {
//     const updatedPracticals = [...(lessonPlan.practicals || [])]

//     updatedPracticals[index] = {
//       ...updatedPracticals[index],
//       [field]: value,
//     }

//     setLessonPlan((prev: any) => ({
//       ...prev,
//       practicals: updatedPracticals,
//     }))

//     validatePractical(updatedPracticals[index], index)
//   }

//   const validatePractical = (practical: any, index: number) => {
//     const errors: string[] = []
//     const warnings: string[] = []

//     // Add validation logic here if needed

//     setValidationErrors(errors)
//     setValidationWarnings(warnings)
//   }

//   const validateAllPracticals = () => {
//     const errors: string[] = []
//     const warnings: string[] = []
//     const currentPracticals = lessonPlan.practicals || []

//     // Add validation logic here if needed

//     return { errors, warnings }
//   }

//   const resetFieldErrors = () => {
//     setPracticalAimError("")
//     setAssociatedUnitsError("")
//     setProbableWeekError("")
//     setLabHoursError("")
//     setSoftwareHardwareError("")
//     setPracticalTasksError("")
//     setEvaluationMethodsError("")
//     setPracticalPedagogyError("")
//     setReferenceError("")
//     setCoMappingError("")
//     setBloomsError("")
//     setSkillMappingError("")
//     setSkillObjectivesError("")
//   }

//   const addPractical = () => {
//     const currentPracticals = lessonPlan.practicals || []
//     const newPracticalNumber = currentPracticals.length + 1
//     const newPractical = {
//       id: `practical${newPracticalNumber}`,
//       practical_aim: "",
//       associated_units: [],
//       probable_week: "",
//       lab_hours: 2,
//       software_hardware_requirements: "",
//       practical_tasks: "",
//       evaluation_methods: [],
//       other_evaluation_method: "",
//       practical_pedagogy: "",
//       other_pedagogy: "",
//       reference_material: "",
//       co_mapping: [],
//       pso_mapping: [],
//       peo_mapping: [],
//       blooms_taxonomy: [],
//       skill_mapping: [],
//       skill_objectives: "",
//     }

//     setLessonPlan((prev: any) => ({
//       ...prev,
//       practicals: [...currentPracticals, newPractical],
//     }))

//     setActivePractical(currentPracticals.length)
//   }

//   const removePractical = (index: number) => {
//     const currentPracticals = lessonPlan.practicals || []
//     if (currentPracticals.length <= 1) {
//       toast.error("At least one practical is required")
//       return
//     }

//     const updatedPracticals = currentPracticals.filter((_: any, i: number) => i !== index)
//     setLessonPlan((prev: any) => ({
//       ...prev,
//       practicals: updatedPracticals,
//     }))

//     if (activePractical >= index && activePractical > 0) {
//       setActivePractical(activePractical - 1)
//     }
//   }

//   const handleSaveDraft = async () => {
//     setIsSavingDraft(true)

//     try {
//       // Ensure we have valid practical data structure
//       const validPracticals = (lessonPlan.practicals || []).map((practical: any) => ({
//         ...practical,
//         // Ensure all required fields have default values
//         id: practical.id || `practical${Date.now()}`,
//         practical_aim: practical.practical_aim || "",
//         associated_units: practical.associated_units || [],
//         probable_week: practical.probable_week || "",
//         lab_hours: practical.lab_hours || 2,
//         software_hardware_requirements: practical.software_hardware_requirements || "",
//         practical_tasks: practical.practical_tasks || "",
//         evaluation_methods: practical.evaluation_methods || [],
//         other_evaluation_method: practical.other_evaluation_method || "",
//         practical_pedagogy: practical.practical_pedagogy || "",
//         other_pedagogy: practical.other_pedagogy || "",
//         reference_material: practical.reference_material || "",
//         co_mapping: practical.co_mapping || [],
//         pso_mapping: practical.pso_mapping || [],
//         peo_mapping: practical.peo_mapping || [],
//         blooms_taxonomy: practical.blooms_taxonomy || [],
//         skill_mapping: practical.skill_mapping || [],
//         skill_objectives: practical.skill_objectives || "",
//       }))

//       const formData = {
//         practicals: validPracticals,
//         remarks: lessonPlan.practical_remarks || "",
//       }

//       console.log("Saving practical draft data:", formData) // Debug log

//       const result = await saveFormDraft(
//         lessonPlan?.faculty?.id || userData?.id || "",
//         lessonPlan?.subject?.id || "",
//         "practical_planning",
//         formData,
//       )

//       if (result.success) {
//         setLastSaved(new Date())
//         toast.success("Draft saved successfully")
//       } else {
//         console.error("Draft save failed:", result.error)
//         toast.error(`Failed to save draft: ${result.error}`)
//       }
//     } catch (error) {
//       console.error("Error saving draft:", error)
//       toast.error("Failed to save draft")
//     } finally {
//       setIsSavingDraft(false)
//     }
//   }

//   const clearDraft = async () => {
//     try {
//       const result = await deleteFormDraft(
//         lessonPlan?.faculty?.id || userData?.id || "",
//         lessonPlan?.subject?.id || "",
//         "practical_planning",
//       )

//       if (result.success) {
//         console.log("Practical draft cleared after successful submission")
//       }
//     } catch (error) {
//       console.error("Error clearing practical draft:", error)
//     }
//   }

//   const handleSave = async () => {
//     setSaving(true)
//     resetFieldErrors()

//     // Validate current practical fields
//     let hasFieldErrors = false

//     if (!currentPractical.practical_aim) {
//       setPracticalAimError("Practical aim is required")
//       hasFieldErrors = true
//     }

//     // FIXED: Only validate associated units for non-practical-only subjects
//     if (!isPracticalOnly && (!currentPractical.associated_units || currentPractical.associated_units.length === 0)) {
//       setAssociatedUnitsError("Associated units are required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.probable_week) {
//       setProbableWeekError("Probable week is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.lab_hours || currentPractical.lab_hours < 1) {
//       setLabHoursError("Lab hours must be at least 1")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.software_hardware_requirements) {
//       setSoftwareHardwareError("Software/hardware requirements are required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.practical_tasks) {
//       setPracticalTasksError("Practical tasks are required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.evaluation_methods || currentPractical.evaluation_methods.length === 0) {
//       setEvaluationMethodsError("At least one evaluation method is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.practical_pedagogy) {
//       setPracticalPedagogyError("Practical pedagogy is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.reference_material) {
//       setReferenceError("Reference material is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.co_mapping || currentPractical.co_mapping.length === 0) {
//       setCoMappingError("CO mapping is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.blooms_taxonomy || currentPractical.blooms_taxonomy.length === 0) {
//       setBloomsError("At least one Bloom's taxonomy level is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.skill_mapping || currentPractical.skill_mapping.length === 0) {
//       setSkillMappingError("At least one skill must be mapped")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.skill_objectives) {
//       setSkillObjectivesError("Skill objectives are required")
//       hasFieldErrors = true
//     }

//     const { errors, warnings } = validateAllPracticals()

//     if (errors.length > 0 || hasFieldErrors) {
//       setValidationErrors(errors)
//       setValidationWarnings(warnings)
//       toast.error("Please fix validation errors before saving")
//       setSaving(false)
//       return
//     }

//     if (warnings.length > 0) {
//       setValidationWarnings(warnings)
//     }

//     try {
//       const result = await savePracticalPlanningForm({
//         faculty_id: lessonPlan.faculty?.id || userData?.id || "",
//         subject_id: lessonPlan.subject?.id || "",
//         practicals: lessonPlan.practicals,
//         remarks: lessonPlan.practical_remarks,
//       })

//       if (result.success) {
//         toast.success("Practical details saved successfully")
//         setValidationErrors([])
//         setValidationWarnings([])

//         setLessonPlan((prev: any) => ({
//           ...prev,
//           practical_planning_completed: true,
//         }))

//         // Clear the draft after successful submission
//         await clearDraft()
//       } else {
//         toast.error(result.error || "Failed to save practical details")
//       }
//     } catch (error) {
//       console.error("Error saving practical details:", error)
//       toast.error("An unexpected error occurred")
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Generate week options based on term dates from metadata
//   const generateWeekOptions = (startDateStr: string, endDateStr: string) => {
//     if (!startDateStr || !endDateStr) {
//       console.log("Missing term dates, cannot generate week options")
//       return []
//     }

//     try {
//       // Parse dates from DD-MM-YYYY format
//       const parseDate = (dateStr: string) => {
//         const [day, month, year] = dateStr.split("-").map(Number)
//         return new Date(year, month - 1, day) // Month is 0-indexed in JS Date
//       }

//       const startDate = parseDate(startDateStr)
//       const endDate = parseDate(endDateStr)

//       // Calculate number of weeks
//       const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//       const numWeeks = Math.ceil(diffDays / 7)

//       // Format date as DD-MM-YYYY
//       const formatDate = (date: Date) => {
//         const day = date.getDate().toString().padStart(2, "0")
//         const month = (date.getMonth() + 1).toString().padStart(2, "0")
//         const year = date.getFullYear()
//         return `${day}-${month}-${year}`
//       }

//       // Generate week options
//       return Array.from({ length: numWeeks }, (_, i) => {
//         const weekStartDate = new Date(startDate)
//         weekStartDate.setDate(startDate.getDate() + i * 7)

//         const weekEndDate = new Date(weekStartDate)
//         weekEndDate.setDate(weekStartDate.getDate() + 6)

//         // If the end date exceeds the term end date, use the term end date
//         if (weekEndDate > endDate) {
//           return `Week ${i + 1} (${formatDate(weekStartDate)} - ${formatDate(endDate)})`
//         }

//         return `Week ${i + 1} (${formatDate(weekStartDate)} - ${formatDate(weekEndDate)})`
//       })
//     } catch (error) {
//       console.error("Error generating week options:", error)
//       return []
//     }
//   }

//   const currentPracticals = lessonPlan.practicals || []
//   const currentPractical = currentPracticals[activePractical]

//   if (!currentPractical) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="p-6">
//       {/* Auto-loading indicator */}
//       {(lessonPlan.practicals?.length === 0 || !lessonPlan.practicals) && (
//         <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md flex items-center">
//           <Info className="h-4 w-4 mr-2" />
//           <span>Loading saved drafts...</span>
//         </div>
//       )}

//       {/* Validation Errors */}
//       {validationErrors.length > 0 && (
//         <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
//           <div className="flex items-start">
//             <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
//             <div className="text-red-800">
//               <ul className="list-disc list-inside space-y-1">
//                 {validationErrors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Validation Warnings */}
//       {validationWarnings.length > 0 && (
//         <div className="mb-6 border border-amber-200 bg-amber-50 rounded-lg p-4">
//           <div className="flex items-start">
//             <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
//             <div className="text-amber-800">
//               <ul className="list-disc list-inside space-y-1">
//                 {validationWarnings.map((warning, index) => (
//                   <li key={index}>{warning}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Practical Navigation */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex space-x-2 flex-wrap">
//           {currentPracticals.map((practical: any, index: number) => (
//             <Button
//               key={practical.id}
//               variant={activePractical === index ? "default" : "outline"}
//               className={activePractical === index ? "bg-[#1A5CA1] hover:bg-[#154A80]" : ""}
//               onClick={() => setActivePractical(index)}
//             >
//               Practical {index + 1}
//               {practical.practical_aim && (
//                 <Badge variant="secondary" className="ml-2 text-xs">
//                   {practical.practical_aim.substring(0, 10)}
//                   {practical.practical_aim.length > 10 ? "..." : ""}
//                 </Badge>
//               )}
//             </Button>
//           ))}
//           <Button variant="outline" onClick={addPractical}>
//             <Plus className="h-4 w-4 mr-1" />
//             Add Practical
//           </Button>
//         </div>
//         {currentPracticals.length > 1 && (
//           <Button
//             variant="ghost"
//             className="text-red-500 hover:text-red-700 hover:bg-red-50"
//             onClick={() => removePractical(activePractical)}
//           >
//             <Trash2 className="h-4 w-4 mr-1" />
//             Remove Practical
//           </Button>
//         )}
//       </div>

//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h3 className="text-xl font-semibold">Practical {activePractical + 1}</h3>
//         </div>

//         {/* Practical Aim */}
//         <div>
//           <Label htmlFor="practical-aim">
//             Practical Aim <span className="text-red-500">*</span>
//           </Label>
//           <Input
//             id="practical-aim"
//             value={currentPractical.practical_aim || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "practical_aim", e.target.value)}
//             placeholder="Enter practical aim"
//             className="mt-1"
//           />
//           {practicalAimError && <p className="text-red-500 text-xs mt-1">{practicalAimError}</p>}
//         </div>

//         {/* FIXED: Only show Associated Units for non-practical-only subjects */}
//         {!isPracticalOnly && (
//           <div>
//             <Label htmlFor="associated-units">
//               Associated Units <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value=""
//               onValueChange={(value) => {
//                 const currentUnits = currentPractical.associated_units || []
//                 if (!currentUnits.includes(value)) {
//                   handlePracticalChange(activePractical, "associated_units", [...currentUnits, value])
//                 }
//               }}
//             >
//               <SelectTrigger id="associated-units" className="mt-1">
//                 <SelectValue placeholder={`${(currentPractical.associated_units || []).length} unit(s) selected`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {(lessonPlan.units || []).map((unit: any, index: number) => (
//                   <SelectItem key={unit.id || `unit-${index}`} value={unit.id || `unit-${index}`}>
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="checkbox"
//                         checked={(currentPractical.associated_units || []).includes(unit.id || `unit-${index}`)}
//                         onChange={() => {}}
//                         className="mr-2"
//                       />
//                       Unit {index + 1}: {unit.unit_name || "No name specified"}
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {associatedUnitsError && <p className="text-red-500 text-xs mt-1">{associatedUnitsError}</p>}

//             {/* Display selected units */}
//             {currentPractical.associated_units && currentPractical.associated_units.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {currentPractical.associated_units.map((unitId: string) => {
//                   const unit = (lessonPlan.units || []).find((u: any) => u.id === unitId)
//                   const unitIndex = (lessonPlan.units || []).findIndex((u: any) => u.id === unitId)
//                   return (
//                     <Badge key={unitId} variant="secondary" className="text-xs">
//                       Unit {(unitIndex || 0) + 1}: {unit?.unit_name || "Unknown"}
//                       <button
//                         onClick={() => {
//                           const updated = (currentPractical.associated_units || []).filter(
//                             (id: string) => id !== unitId,
//                           )
//                           handlePracticalChange(activePractical, "associated_units", updated)
//                         }}
//                         className="ml-1 text-red-500 hover:text-red-700"
//                       >
//                         ×
//                       </button>
//                     </Badge>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Probable Week and Lab Hours */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Label htmlFor="probable-week">
//               Probable Week <span className="text-red-500">*</span>
//             </Label>
//             {/* Update the Select component to use week options from metadata */}
//             <Select
//               value={currentPractical.probable_week || ""}
//               onValueChange={(value) => handlePracticalChange(activePractical, "probable_week", value)}
//             >
//               <SelectTrigger id="probable-week" className="mt-1">
//                 <SelectValue placeholder="Select probable week" />
//               </SelectTrigger>
//               <SelectContent>
//                 {weekOptions.length > 0 ? (
//                   weekOptions.map((week) => (
//                     <SelectItem key={week} value={week}>
//                       {week}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="no-weeks">No weeks available</SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//             {probableWeekError && <p className="text-red-500 text-xs mt-1">{probableWeekError}</p>}
//           </div>

//           <div>
//             <Label htmlFor="lab-hours">
//               Lab Hours <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="lab-hours"
//               type="number"
//               min="1"
//               value={currentPractical.lab_hours || ""}
//               onChange={(e) => handlePracticalChange(activePractical, "lab_hours", Number(e.target.value))}
//               className="mt-1"
//             />
//             {labHoursError && <p className="text-red-500 text-xs mt-1">{labHoursError}</p>}
//           </div>
//         </div>

//         {/* Software/Hardware Requirements */}
//         <div>
//           <Label htmlFor="software-hardware">
//             Software/Hardware Requirements <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="software-hardware"
//             value={currentPractical.software_hardware_requirements || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "software_hardware_requirements", e.target.value)}
//             placeholder="Enter software/hardware requirements"
//             className="mt-1"
//             rows={3}
//           />
//           {softwareHardwareError && <p className="text-red-500 text-xs mt-1">{softwareHardwareError}</p>}
//         </div>

//         {/* Practical Tasks */}
//         <div>
//           <Label htmlFor="practical-tasks">
//             Practical Tasks/Problem Statement <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="practical-tasks"
//             value={currentPractical.practical_tasks || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "practical_tasks", e.target.value)}
//             placeholder="Enter practical tasks or problem statement"
//             className="mt-1"
//             rows={4}
//           />
//           {practicalTasksError && <p className="text-red-500 text-xs mt-1">{practicalTasksError}</p>}
//         </div>

//         {/* Evaluation Methods */}
//         <div>
//           <Label className="mb-2 block">
//             Evaluation Methods <span className="text-red-500">*</span>
//           </Label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {evaluationMethodOptions
//               .filter((method) => method !== "Other")
//               .map((method) => (
//                 <div key={method} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`evaluation-${method}`}
//                     checked={(currentPractical.evaluation_methods || []).includes(method)}
//                     onCheckedChange={(checked) => {
//                       const current = currentPractical.evaluation_methods || []
//                       if (checked) {
//                         handlePracticalChange(activePractical, "evaluation_methods", [...current, method])
//                       } else {
//                         handlePracticalChange(
//                           activePractical,
//                           "evaluation_methods",
//                           current.filter((m: string) => m !== method),
//                         )
//                       }
//                     }}
//                   />
//                   <Label
//                     htmlFor={`evaluation-${method}`}
//                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                   >
//                     {method}
//                   </Label>
//                 </div>
//               ))}

//             {/* Other option */}
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="evaluation-other"
//                 checked={
//                   showOtherEvaluationInput ||
//                   (currentPractical.evaluation_methods || []).some((m) => m.startsWith("Other:"))
//                 }
//                 onCheckedChange={(checked) => {
//                   setShowOtherEvaluationInput(!!checked)
//                   if (!checked) {
//                     // Remove any "Other:" entries when unchecked
//                     const current = currentPractical.evaluation_methods || []
//                     handlePracticalChange(
//                       activePractical,
//                       "evaluation_methods",
//                       current.filter((m: string) => !m.startsWith("Other:")),
//                     )
//                   }
//                 }}
//               />
//               <Label
//                 htmlFor="evaluation-other"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Other
//               </Label>
//             </div>
//           </div>

//           {/* Other Evaluation Method Input */}
//           {showOtherEvaluationInput && (
//             <div className="mt-3 flex gap-2">
//               <Input
//                 placeholder="Enter other evaluation method"
//                 value={otherEvaluationValue}
//                 onChange={(e) => setOtherEvaluationValue(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   if (otherEvaluationValue.trim()) {
//                     const current = currentPractical.evaluation_methods || []
//                     handlePracticalChange(activePractical, "evaluation_methods", [
//                       ...current,
//                       `Other: ${otherEvaluationValue.trim()}`,
//                     ])
//                     setOtherEvaluationValue("")
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//             </div>
//           )}

//           {/* Display selected evaluation methods */}
//           {(currentPractical.evaluation_methods || []).length > 0 && (
//             <div className="mt-2">
//               <Label className="text-sm text-gray-500">Selected Methods:</Label>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {(currentPractical.evaluation_methods || []).map((method: string, idx: number) => (
//                   <Badge key={`${method}-${idx}`} variant="secondary" className="text-xs">
//                     {method}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.evaluation_methods || []).filter(
//                           (m: string, i: number) => i !== idx,
//                         )
//                         handlePracticalChange(activePractical, "evaluation_methods", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {evaluationMethodsError && <p className="text-red-500 text-xs mt-1">{evaluationMethodsError}</p>}
//         </div>

//         {/* Practical Pedagogy */}
//         <div>
//           <Label htmlFor="practical-pedagogy">
//             Practical Pedagogy <span className="text-red-500">*</span>
//           </Label>
//           <Select
//             value={currentPractical.practical_pedagogy || ""}
//             onValueChange={(value) => {
//               if (value === "Other") {
//                 setShowOtherPedagogyInput(true)
//               } else {
//                 handlePracticalChange(activePractical, "practical_pedagogy", value)
//                 setShowOtherPedagogyInput(false)
//               }
//             }}
//           >
//             <SelectTrigger id="practical-pedagogy" className="mt-1">
//               <SelectValue placeholder="Select practical pedagogy" />
//             </SelectTrigger>
//             <SelectContent>
//               {practicalPedagogyOptions
//                 .filter((option) => option !== "Other")
//                 .map((pedagogy) => (
//                   <SelectItem key={pedagogy} value={pedagogy}>
//                     {pedagogy}
//                   </SelectItem>
//                 ))}
//               <SelectItem value="Other">Other</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Other Pedagogy Input */}
//           {showOtherPedagogyInput && (
//             <div className="mt-3 flex gap-2">
//               <Input
//                 placeholder="Enter other pedagogy"
//                 value={otherPedagogyValue}
//                 onChange={(e) => setOtherPedagogyValue(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   if (otherPedagogyValue.trim()) {
//                     handlePracticalChange(activePractical, "practical_pedagogy", `Other: ${otherPedagogyValue.trim()}`)
//                     setOtherPedagogyValue("")
//                     setShowOtherPedagogyInput(false)
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => {
//                   setShowOtherPedagogyInput(false)
//                 }}
//               >
//                 Cancel
//               </Button>
//             </div>
//           )}

//           {practicalPedagogyError && <p className="text-red-500 text-xs mt-1">{practicalPedagogyError}</p>}
//         </div>

//         {/* Reference Material */}
//         <div>
//           <Label htmlFor="reference-material">
//             Reference Material <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="reference-material"
//             value={currentPractical.reference_material || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "reference_material", e.target.value)}
//             placeholder="Enter reference material"
//             className="mt-1"
//             rows={3}
//           />
//           {referenceError && <p className="text-red-500 text-xs mt-1">{referenceError}</p>}
//         </div>

//         {/* CO, PSO, PEO Mapping */}
//         <div className="grid grid-cols-1 gap-6">
//           {/* CO Mapping */}
//           <div>
//             <Label>
//               CO Mapping <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value=""
//               onValueChange={(value) => {
//                 const current = currentPractical.co_mapping || []
//                 if (!current.includes(value)) {
//                   handlePracticalChange(activePractical, "co_mapping", [...current, value])
//                 }
//               }}
//             >
//               <SelectTrigger className="w-full mt-1">
//                 <SelectValue placeholder="Select Course Outcomes" />
//               </SelectTrigger>
//               <SelectContent>
//                 {(lessonPlan.courseOutcomes || []).map((co: any, index: number) => (
//                   <SelectItem key={co.id} value={co.id}>
//                     CO{index + 1}: {co.text}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Selected COs */}
//             <div className="mt-2 flex flex-wrap gap-2">
//               {(currentPractical.co_mapping || []).map((coId: string) => {
//                 const co = (lessonPlan.courseOutcomes || []).find((c: any) => c.id === coId)
//                 const coIndex = (lessonPlan.courseOutcomes || []).findIndex((c: any) => c.id === coId)
//                 return (
//                   <Badge key={coId} variant="secondary" className="text-xs">
//                     CO{(coIndex || 0) + 1}: {co?.text || "Unknown"}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.co_mapping || []).filter((id: string) => id !== coId)
//                         handlePracticalChange(activePractical, "co_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 )
//               })}
//             </div>
//             {coMappingError && <p className="text-red-500 text-xs mt-1">{coMappingError}</p>}
//           </div>

//           {/* PSO Mapping */}
//           <div>
//             <Label>PSO Mapping</Label>
//             <Select
//               value=""
//               onValueChange={(value) => {
//                 const current = currentPractical.pso_mapping || []
//                 if (!current.includes(value)) {
//                   handlePracticalChange(activePractical, "pso_mapping", [...current, value])
//                 }
//               }}
//             >
//               <SelectTrigger className="w-full mt-1">
//                 <SelectValue placeholder="Select PSO" />
//               </SelectTrigger>
//               <SelectContent>
//                 {departmentPsoPeo.pso_data.map((pso, index) => (
//                   <SelectItem key={pso.id} value={pso.id}>
//                     {pso.label || `PSO${index + 1}`}: {pso.description}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Selected PSOs */}
//             <div className="mt-2 flex flex-wrap gap-2">
//               {(currentPractical.pso_mapping || []).map((psoId: string) => {
//                 const pso = departmentPsoPeo.pso_data.find((p) => p.id === psoId)
//                 const psoIndex = departmentPsoPeo.pso_data.findIndex((p) => p.id === psoId)
//                 return (
//                   <Badge key={psoId} variant="secondary" className="text-xs">
//                     {pso?.label || `PSO${psoIndex + 1}`}: {pso?.description || "Unknown"}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.pso_mapping || []).filter((id: string) => id !== psoId)
//                         handlePracticalChange(activePractical, "pso_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 )
//               })}
//             </div>
//           </div>

//           {/* PEO Mapping */}
//           <div>
//             <Label>PEO Mapping</Label>
//             <Select
//               value=""
//               onValueChange={(value) => {
//                 const current = currentPractical.peo_mapping || []
//                 if (!current.includes(value)) {
//                   handlePracticalChange(activePractical, "peo_mapping", [...current, value])
//                 }
//               }}
//             >
//               <SelectTrigger className="w-full mt-1">
//                 <SelectValue placeholder="Select PEO" />
//               </SelectTrigger>
//               <SelectContent>
//                 {departmentPsoPeo.peo_data.map((peo, index) => (
//                   <SelectItem key={peo.id} value={peo.id}>
//                     {peo.label || `PEO${index + 1}`}: {peo.description}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Selected PEOs */}
//             <div className="mt-2 flex flex-wrap gap-2">
//               {(currentPractical.peo_mapping || []).map((peoId: string) => {
//                 const peo = departmentPsoPeo.peo_data.find((p) => p.id === peoId)
//                 const peoIndex = departmentPsoPeo.peo_data.findIndex((p) => p.id === peoId)
//                 return (
//                   <Badge key={peoId} variant="secondary" className="text-xs">
//                     {peo?.label || `PEO${peoIndex + 1}`}: {peo?.description || "Unknown"}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.peo_mapping || []).filter((id: string) => id !== peoId)
//                         handlePracticalChange(activePractical, "peo_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 )
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Bloom's Taxonomy */}
//         <div>
//           <Label className="mb-2 block">
//             Bloom&apos;s Taxonomy <span className="text-red-500">*</span>
//           </Label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {bloomsTaxonomyOptions.map((taxonomy) => (
//               <div key={taxonomy} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`taxonomy-${taxonomy}`}
//                   checked={(currentPractical.blooms_taxonomy || []).includes(taxonomy)}
//                   onCheckedChange={(checked) => {
//                     const current = currentPractical.blooms_taxonomy || []
//                     if (checked) {
//                       handlePracticalChange(activePractical, "blooms_taxonomy", [...current, taxonomy])
//                     } else {
//                       handlePracticalChange(
//                         activePractical,
//                         "blooms_taxonomy",
//                         current.filter((t: string) => t !== taxonomy),
//                       )
//                     }
//                   }}
//                 />
//                 <Label
//                   htmlFor={`taxonomy-${taxonomy}`}
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   {taxonomy}
//                 </Label>
//               </div>
//             ))}
//           </div>
//           {bloomsError && <p className="text-red-500 text-xs mt-1">{bloomsError}</p>}
//         </div>

//         {/* Skill Mapping */}
//         <div>
//           <Label className="mb-2 block">
//             Skill Mapping <span className="text-red-500">*</span>
//           </Label>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {skillMappingOptions.map((skill) => (
//               <div key={skill} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`skill-${skill}`}
//                   checked={(currentPractical.skill_mapping || []).includes(skill)}
//                   onCheckedChange={(checked) => {
//                     const current = currentPractical.skill_mapping || []
//                     if (checked) {
//                       handlePracticalChange(activePractical, "skill_mapping", [...current, skill])
//                     } else {
//                       handlePracticalChange(
//                         activePractical,
//                         "skill_mapping",
//                         current.filter((s: string) => s !== skill),
//                       )
//                     }
//                   }}
//                 />
//                 <Label
//                   htmlFor={`skill-${skill}`}
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   {skill}
//                 </Label>
//               </div>
//             ))}

//             {/* Other option */}
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="skill-other"
//                 checked={
//                   showOtherSkillInput || (currentPractical.skill_mapping || []).some((s) => s.startsWith("Other:"))
//                 }
//                 onCheckedChange={(checked) => {
//                   setShowOtherSkillInput(!!checked)
//                   if (!checked) {
//                     // Remove any "Other:" entries when unchecked
//                     const current = currentPractical.skill_mapping || []
//                     handlePracticalChange(
//                       activePractical,
//                       "skill_mapping",
//                       current.filter((s: string) => !s.startsWith("Other:")),
//                     )
//                   }
//                 }}
//               />
//               <Label
//                 htmlFor="skill-other"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Other
//               </Label>
//             </div>
//           </div>

//           {/* Other Skill Input */}
//           {showOtherSkillInput && (
//             <div className="mt-3 flex gap-2">
//               <Input
//                 placeholder="Enter other skill"
//                 value={otherSkillValue}
//                 onChange={(e) => setOtherSkillValue(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   if (otherSkillValue.trim()) {
//                     const current = currentPractical.skill_mapping || []
//                     handlePracticalChange(activePractical, "skill_mapping", [
//                       ...current,
//                       `Other: ${otherSkillValue.trim()}`,
//                     ])
//                     setOtherSkillValue("")
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//             </div>
//           )}

//           {skillMappingError && <p className="text-red-500 text-xs mt-1">{skillMappingError}</p>}
//         </div>

//         {/* Skill Objectives */}
//         <div>
//           <Label htmlFor="skill-objectives">
//             Skill Objectives <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="skill-objectives"
//             value={currentPractical.skill_objectives || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "skill_objectives", e.target.value)}
//             placeholder="Enter skill objectives"
//             className="mt-1"
//             rows={3}
//           />
//           {skillObjectivesError && <p className="text-red-500 text-xs mt-1">{skillObjectivesError}</p>}
//         </div>

//         {/* Remarks */}
//         <div>
//           <Label htmlFor="remarks">Remarks</Label>
//           <Textarea
//             id="remarks"
//             value={lessonPlan.practical_remarks || ""}
//             onChange={(e) =>
//               setLessonPlan((prev: any) => ({
//                 ...prev,
//                 practical_remarks: e.target.value,
//               }))
//             }
//             placeholder="Enter any additional remarks"
//             className="mt-1"
//             rows={3}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between mt-8">
//           <div className="flex items-center">
//             {lastSaved && (
//               <span className="text-sm text-gray-500">
//                 Last saved: {lastSaved.toLocaleTimeString()} {lastSaved.toLocaleDateString()}
//               </span>
//             )}
//           </div>
//           <div className="flex space-x-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleSaveDraft}
//               disabled={isSavingDraft}
//               className="min-w-[100px]"
//             >
//               {isSavingDraft ? "Saving..." : "Save Draft"}
//             </Button>
//             <Button
//               type="button"
//               onClick={handleSave}
//               disabled={saving}
//               className="min-w-[100px] bg-[#1A5CA1] hover:bg-[#154A80]"
//             >
//               {saving ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Warning Dialog */}
//       <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Warning</DialogTitle>
//             <DialogDescription>{currentWarning}</DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setWarningDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 setWarningDialogOpen(false)
//                 handleSave()
//               }}
//             >
//               Continue
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }







































//@ts-nocheck
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, AlertTriangle, Info } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/utils/supabase/client"
import { savePracticalPlanningForm } from "@/app/dashboard/actions/savePracticalPlanningForm"
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

interface PracticalPlanningFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
  userData: any
}

// Practical Pedagogy Options
const practicalPedagogyOptions = [
  "Problem-Based/Case Study Learning",
  "Project-Based Learning",
  "Collaborative Learning",
  "Code Walkthroughs",
  "Self-Learning with Guidance",
  "Experiential Learning",
  "Flipped Laboratory",
  "Pair Programming",
  "Peer Learning",
  "Research-Oriented Practical",
  "Other",
]

// Evaluation Method Options
const evaluationMethodOptions = [
  "Viva",
  "Lab Performance",
  "File Submission",
  "Mini-Project",
  "Code Review",
  "Peer Evaluation",
  "Presentation",
  "Other",
]

// Bloom's Taxonomy Options for Practicals
const bloomsTaxonomyOptions = ["Apply", "Analyze", "Evaluate", "Create"]

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

// Default PSO/PEO options if none are found
const defaultPsoOptions = [
  { id: "pso-1", label: "PSO1", description: "Program Specific Outcome 1" },
  { id: "pso-2", label: "PSO2", description: "Program Specific Outcome 2" },
  { id: "pso-3", label: "PSO3", description: "Program Specific Outcome 3" },
  { id: "pso-4", label: "PSO4", description: "Program Specific Outcome 4" },
  { id: "pso-5", label: "PSO5", description: "Program Specific Outcome 5" },
]

const defaultPeoOptions = [
  { id: "peo-1", label: "PEO1", description: "Program Educational Objective 1" },
  { id: "peo-2", label: "PEO2", description: "Program Educational Objective 2" },
  { id: "peo-3", label: "PEO3", description: "Program Educational Objective 3" },
  { id: "peo-4", label: "PEO4", description: "Program Educational Objective 4" },
  { id: "peo-5", label: "PEO5", description: "Program Educational Objective 5" },
]

export default function PracticalPlanningForm({ lessonPlan, setLessonPlan, userData }: PracticalPlanningFormProps) {
  const [activePractical, setActivePractical] = useState(0)
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
  const [psoPeoError, setPsoPeoError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [currentWarning, setCurrentWarning] = useState("")
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showOtherSkillInput, setShowOtherSkillInput] = useState(false)
  const [otherSkillValue, setOtherSkillValue] = useState("")
  const [showOtherPedagogyInput, setShowOtherPedagogyInput] = useState(false)
  const [otherPedagogyValue, setOtherPedagogyValue] = useState("")
  const [showOtherEvaluationInput, setShowOtherEvaluationInput] = useState(false)
  const [otherEvaluationValue, setOtherEvaluationValue] = useState("")
  // Term dates from metadata
  const [termDates, setTermDates] = useState<{
    startDate: string
    endDate: string
  }>({
    startDate: "",
    endDate: "",
  })
  // Debug state for term dates
  const [debugInfo, setDebugInfo] = useState<{
    termStartDate: string
    termEndDate: string
    lessonPlanDates: {
      start: string
      end: string
    }
    metadataDates: {
      start: string
      end: string
    }
  }>({
    termStartDate: "",
    termEndDate: "",
    lessonPlanDates: {
      start: "",
      end: "",
    },
    metadataDates: {
      start: "",
      end: "",
    },
  })
  // Week options state
  const [weekOptions, setWeekOptions] = useState<string[]>([])

  // Field-specific error states
  const [practicalAimError, setPracticalAimError] = useState("")
  const [associatedUnitsError, setAssociatedUnitsError] = useState("")
  const [probableWeekError, setProbableWeekError] = useState("")
  const [labHoursError, setLabHoursError] = useState("")
  const [softwareHardwareError, setSoftwareHardwareError] = useState("")
  const [practicalTasksError, setPracticalTasksError] = useState("")
  const [evaluationMethodsError, setEvaluationMethodsError] = useState("")
  const [practicalPedagogyError, setPracticalPedagogyError] = useState("")
  const [referenceError, setReferenceError] = useState("")
  const [coMappingError, setCoMappingError] = useState("")
  const [bloomsError, setBloomsError] = useState("")
  const [skillMappingError, setSkillMappingError] = useState("")
  const [skillObjectivesError, setSkillObjectivesError] = useState("")

  // Add this to your state variables at the top of the component
  const [isLoadingDraft, setIsLoadingDraft] = useState(true)

  // FIXED: Check if subject is practical-only
  const isPracticalOnly = lessonPlan?.subject?.is_practical === true && lessonPlan?.subject?.is_theory === false

  // Initialize practicals if empty
  useEffect(() => {
    if (!lessonPlan.practicals || lessonPlan.practicals.length === 0) {
      const initialPractical = {
        id: "practical1",
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
      }

      setLessonPlan((prev: any) => ({
        ...prev,
        practicals: [initialPractical],
      }))
    }
  }, [lessonPlan?.practicals, setLessonPlan])

  // Updated PSO/PEO loading logic to fetch from department_pso_peo table
  useEffect(() => {
    const loadPsoPeoData = async () => {
      if (!lessonPlan.subject?.id) return

      setLoadingPsoPeo(true)
      setPsoPeoError(null)

      try {
        // Step 1: Get the department_id from the subject
        const { data: subjectData, error: subjectError } = await supabase
          .from("subjects")
          .select("department_id")
          .eq("id", lessonPlan.subject.id)
          .single()

        if (subjectError || !subjectData?.department_id) {
          throw new Error("Failed to fetch subject's department.")
        }

        const departmentId = subjectData.department_id

        // Step 2: Fetch PSO/PEO data from department_pso_peo table
        const { data: deptPsoPeo, error: deptError } = await supabase
          .from("department_pso_peo")
          .select("pso_data, peo_data")
          .eq("department_id", departmentId)
          .single()

        let psoData = defaultPsoOptions
        let peoData = defaultPeoOptions

        if (!deptError && deptPsoPeo) {
          if (Array.isArray(deptPsoPeo.pso_data)) {
            psoData = deptPsoPeo.pso_data
          }

          if (Array.isArray(deptPsoPeo.peo_data)) {
            peoData = deptPsoPeo.peo_data
          }
        } else {
          console.warn("Falling back to default PSO/PEO due to missing department data or error.")
        }

        // Step 3: Set data to state
        setDepartmentPsoPeo({
          pso_data: psoData,
          peo_data: peoData,
        })

        console.log("Loaded PSO/PEO from department_pso_peo:", {
          pso_count: psoData.length,
          peo_count: peoData.length,
        })
      } catch (error) {
        console.error("Error loading PSO/PEO:", error)
        setPsoPeoError("Failed to load PSO/PEO. Default values used.")

        setDepartmentPsoPeo({
          pso_data: defaultPsoOptions,
          peo_data: defaultPeoOptions,
        })
      } finally {
        setLoadingPsoPeo(false)
      }
    }

    loadPsoPeoData()
  }, [lessonPlan.subject?.id])

  // Fetch term dates from metadata and generate week options
  const fetchTermDates = useCallback(async () => {
    try {
      if (!lessonPlan?.subject?.code) {
        console.log("DEBUG - No subject code available")
        return
      }

      console.log("DEBUG - Fetching term dates for subject code:", lessonPlan.subject.code)

      const { data, error } = await supabase
        .from("subjects")
        .select("metadata")
        .eq("code", lessonPlan.subject.code)
        .single()

      if (error) {
        console.error("DEBUG - Error fetching subject metadata:", error)
        return
      }

      if (!data) {
        console.log("DEBUG - No data returned for subject")
        return
      }

      console.log("DEBUG - Raw metadata from database:", data.metadata)

      let metadata = data.metadata
      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata)
          console.log("DEBUG - Parsed metadata:", metadata)
        } catch (e) {
          console.error("DEBUG - Error parsing metadata string:", e)
          return
        }
      }

      // Get term dates from metadata
      const startDate = metadata?.term_start_date || ""
      const endDate = metadata?.term_end_date || ""

      // Update term dates state
      setTermDates({
        startDate,
        endDate,
      })

      // Update debug info
      setDebugInfo((prev) => ({
        ...prev,
        termStartDate: startDate,
        termEndDate: endDate,
        lessonPlanDates: {
          start: lessonPlan?.term_start_date || "Not set in lessonPlan",
          end: lessonPlan?.term_end_date || "Not set in lessonPlan",
        },
        metadataDates: {
          start: startDate,
          end: endDate,
        },
      }))

      console.log("DEBUG - Term dates from metadata:", {
        term_start_date: startDate,
        term_end_date: endDate,
      })

      // Generate week options based on metadata dates
      if (startDate && endDate) {
        const weeks = generateWeekOptions(startDate, endDate)
        setWeekOptions(weeks)
      }
    } catch (error) {
      console.error("DEBUG - Unexpected error fetching term dates:", error)
    }
  }, [lessonPlan?.subject?.code, lessonPlan?.term_start_date, lessonPlan?.term_end_date])

  useEffect(() => {
    fetchTermDates()
  }, [fetchTermDates])

  // Replace the existing useEffect for loading drafts with this improved implementation
  useEffect(() => {
    console.log("🔍 PRACTICAL AUTO-LOAD: useEffect triggered")
    console.log("🔍 PRACTICAL AUTO-LOAD: Dependencies:", {
      userId: userData?.id,
      subjectId: lessonPlan?.subject?.id,
      facultyId: lessonPlan?.faculty?.id,
      hasUserData: !!userData,
      hasLessonPlan: !!lessonPlan,
      hasSubject: !!lessonPlan?.subject,
    })

    // Auto-load draft immediately when component mounts and required data is available
    const autoLoadDraft = async () => {
      console.log("🔍 PRACTICAL AUTO-LOAD: autoLoadDraft function called")

      // Check if we have all required data - we need either userData.id OR faculty.id from lesson plan
      const facultyId = lessonPlan?.faculty?.id || userData?.id
      const subjectId = lessonPlan?.subject?.id

      if (!facultyId || !subjectId) {
        console.log("❌ PRACTICAL AUTO-LOAD: Missing required data:", {
          facultyId,
          subjectId,
          userDataId: userData?.id,
          lessonPlanFacultyId: lessonPlan?.faculty?.id,
          hasLessonPlan: !!lessonPlan,
          hasSubject: !!lessonPlan?.subject,
        })
        setIsLoadingDraft(false)
        return
      }

      console.log("✅ PRACTICAL AUTO-LOAD: Required data available - Faculty ID:", facultyId, "Subject ID:", subjectId)

      // Check if we already have practicals data to avoid unnecessary loading
      const currentPracticals = lessonPlan.practicals || []
      const hasExistingData = currentPracticals.length > 0 && currentPracticals[0]?.practical_aim

      console.log("🔍 PRACTICAL AUTO-LOAD: Existing data check:", {
        practicalsLength: currentPracticals.length,
        firstPracticalAim: currentPracticals[0]?.practical_aim,
        hasExistingData,
        fullPracticals: currentPracticals,
      })

      if (hasExistingData) {
        console.log("⏭️ PRACTICAL AUTO-LOAD: Practicals already loaded, skipping auto-load")
        setIsLoadingDraft(false)
        return
      }

      console.log("🚀 PRACTICAL AUTO-LOAD: Starting auto-load process...")
      setIsLoadingDraft(true)

      try {
        console.log("🔍 PRACTICAL AUTO-LOAD: Using faculty ID:", facultyId)
        console.log("🔍 PRACTICAL AUTO-LOAD: Using subject ID:", subjectId)

        console.log("📡 PRACTICAL AUTO-LOAD: Making API call to loadFormDraft...")
        const result = await loadFormDraft(facultyId, subjectId, "practical_planning")

        console.log("📡 PRACTICAL AUTO-LOAD: API response:", result)

        if (result.success && result.data) {
          const data = result.data
          console.log("✅ PRACTICAL AUTO-LOAD: Draft data received:", data)

          // Check if we have valid practical data structure
          if (data.practicals && Array.isArray(data.practicals) && data.practicals.length > 0) {
            console.log("✅ PRACTICAL AUTO-LOAD: Valid practicals found:", data.practicals.length)

            // Ensure each practical has proper structure
            const validPracticals = data.practicals.map((practical: any, index: number) => {
              const validPractical = {
                ...practical,
                // Ensure all required fields have default values
                id: practical.id || `practical${index + 1}`,
                practical_aim: practical.practical_aim || "",
                associated_units: Array.isArray(practical.associated_units) ? practical.associated_units : [],
                probable_week: practical.probable_week || "",
                lab_hours: typeof practical.lab_hours === "number" ? practical.lab_hours : 2,
                software_hardware_requirements: practical.software_hardware_requirements || "",
                practical_tasks: practical.practical_tasks || "",
                evaluation_methods: Array.isArray(practical.evaluation_methods) ? practical.evaluation_methods : [],
                other_evaluation_method: practical.other_evaluation_method || "",
                practical_pedagogy: practical.practical_pedagogy || "",
                other_pedagogy: practical.other_pedagogy || "",
                reference_material: practical.reference_material || "",
                co_mapping: Array.isArray(practical.co_mapping) ? practical.co_mapping : [],
                pso_mapping: Array.isArray(practical.pso_mapping) ? practical.pso_mapping : [],
                peo_mapping: Array.isArray(practical.peo_mapping) ? practical.peo_mapping : [],
                blooms_taxonomy: Array.isArray(practical.blooms_taxonomy) ? practical.blooms_taxonomy : [],
                skill_mapping: Array.isArray(practical.skill_mapping) ? practical.skill_mapping : [],
                skill_objectives: practical.skill_objectives || "",
              }
              console.log(`🔍 PRACTICAL AUTO-LOAD: Processed practical ${index + 1}:`, validPractical)
              return validPractical
            })

            console.log("🔄 PRACTICAL AUTO-LOAD: Setting practicals to lesson plan...")

            // Update the lesson plan with loaded data
            setLessonPlan((prev: any) => {
              console.log("🔄 PRACTICAL AUTO-LOAD: Previous lesson plan:", prev)
              const updated = {
                ...prev,
                practicals: validPracticals,
                practical_remarks: data.remarks || "",
              }
              console.log("🔄 PRACTICAL AUTO-LOAD: Updated lesson plan:", updated)
              return updated
            })

            console.log("🎉 PRACTICAL AUTO-LOAD: Success! Showing toast...")
            toast.success(`Draft loaded automatically with ${validPracticals.length} practical(s)`)

            // Set last saved time if available
            if (data.savedAt) {
              setLastSaved(new Date(data.savedAt))
              console.log("🔍 PRACTICAL AUTO-LOAD: Set last saved time:", data.savedAt)
            } else {
              setLastSaved(new Date())
              console.log("🔍 PRACTICAL AUTO-LOAD: Set current time as last saved")
            }
          } else {
            console.log("❌ PRACTICAL AUTO-LOAD: No valid practical data found in draft")
            console.log("🔍 PRACTICAL AUTO-LOAD: Data structure:", {
              hasPracticals: !!data.practicals,
              isArray: Array.isArray(data.practicals),
              length: data.practicals?.length,
              practicals: data.practicals,
            })
          }
        } else {
          console.log("❌ PRACTICAL AUTO-LOAD: No draft found or failed to load")
          console.log("🔍 PRACTICAL AUTO-LOAD: Result details:", {
            success: result.success,
            hasData: !!result.data,
            error: result.error,
          })
        }
      } catch (error) {
        console.error("💥 PRACTICAL AUTO-LOAD: Error occurred:", error)
        toast.error("Failed to auto-load draft")
      } finally {
        console.log("🏁 PRACTICAL AUTO-LOAD: Process completed, setting loading to false")
        setIsLoadingDraft(false)
      }
    }

    // Run auto-load when we have the required data (either userData.id OR faculty.id from lesson plan)
    const facultyId = lessonPlan?.faculty?.id || userData?.id
    const subjectId = lessonPlan?.subject?.id

    if (facultyId && subjectId) {
      console.log("✅ PRACTICAL AUTO-LOAD: Conditions met, calling autoLoadDraft")
      autoLoadDraft()
    } else {
      console.log("❌ PRACTICAL AUTO-LOAD: Conditions not met, skipping auto-load")
      console.log("🔍 PRACTICAL AUTO-LOAD: Missing:", {
        facultyId: !!facultyId,
        subjectId: !!subjectId,
        userDataId: !!userData?.id,
        lessonPlanFacultyId: !!lessonPlan?.faculty?.id,
      })
      setIsLoadingDraft(false)
    }
  }, [userData?.id, lessonPlan?.subject?.id, lessonPlan, setLessonPlan, userData, lessonPlan?.faculty?.id])

  const handlePracticalChange = (index: number, field: string, value: any) => {
    const updatedPracticals = [...(lessonPlan.practicals || [])]

    updatedPracticals[index] = {
      ...updatedPracticals[index],
      [field]: value,
    }

    setLessonPlan((prev: any) => ({
      ...prev,
      practicals: updatedPracticals,
    }))

    validatePractical(updatedPracticals[index], index)
  }

  const validatePractical = (practical: any, index: number) => {
    const errors: string[] = []
    const warnings: string[] = []

    // Add validation logic here if needed

    setValidationErrors(errors)
    setValidationWarnings(warnings)
  }

  const validateAllPracticals = () => {
    const errors: string[] = []
    const warnings: string[] = []
    const currentPracticals = lessonPlan.practicals || []

    // Add validation logic here if needed

    return { errors, warnings }
  }

  const resetFieldErrors = () => {
    setPracticalAimError("")
    setAssociatedUnitsError("")
    setProbableWeekError("")
    setLabHoursError("")
    setSoftwareHardwareError("")
    setPracticalTasksError("")
    setEvaluationMethodsError("")
    setPracticalPedagogyError("")
    setReferenceError("")
    setCoMappingError("")
    setBloomsError("")
    setSkillMappingError("")
    setSkillObjectivesError("")
  }

  const addPractical = () => {
    const currentPracticals = lessonPlan.practicals || []
    const newPracticalNumber = currentPracticals.length + 1
    const newPractical = {
      id: `practical${newPracticalNumber}`,
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
    }

    setLessonPlan((prev: any) => ({
      ...prev,
      practicals: [...currentPracticals, newPractical],
    }))

    setActivePractical(currentPracticals.length)
  }

  const removePractical = (index: number) => {
    const currentPracticals = lessonPlan.practicals || []
    if (currentPracticals.length <= 1) {
      toast.error("At least one practical is required")
      return
    }

    const updatedPracticals = currentPracticals.filter((_: any, i: number) => i !== index)
    setLessonPlan((prev: any) => ({
      ...prev,
      practicals: updatedPracticals,
    }))

    if (activePractical >= index && activePractical > 0) {
      setActivePractical(activePractical - 1)
    }
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)

    try {
      // Ensure we have valid practical data structure
      const validPracticals = (lessonPlan.practicals || []).map((practical: any) => ({
        ...practical,
        // Ensure all required fields have default values
        id: practical.id || `practical${Date.now()}`,
        practical_aim: practical.practical_aim || "",
        associated_units: practical.associated_units || [],
        probable_week: practical.probable_week || "",
        lab_hours: practical.lab_hours || 2,
        software_hardware_requirements: practical.software_hardware_requirements || "",
        practical_tasks: practical.practical_tasks || "",
        evaluation_methods: practical.evaluation_methods || [],
        other_evaluation_method: practical.other_evaluation_method || "",
        practical_pedagogy: practical.practical_pedagogy || "",
        other_pedagogy: practical.other_pedagogy || "",
        reference_material: practical.reference_material || "",
        co_mapping: practical.co_mapping || [],
        pso_mapping: practical.pso_mapping || [],
        peo_mapping: practical.peo_mapping || [],
        blooms_taxonomy: practical.blooms_taxonomy || [],
        skill_mapping: practical.skill_mapping || [],
        skill_objectives: practical.skill_objectives || "",
      }))

      const formData = {
        practicals: validPracticals,
        remarks: lessonPlan.practical_remarks || "",
      }

      console.log("Saving practical draft data:", formData) // Debug log

      const result = await saveFormDraft(
        lessonPlan?.faculty?.id || userData?.id || "",
        lessonPlan?.subject?.id || "",
        "practical_planning",
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
        "practical_planning",
      )

      if (result.success) {
        console.log("Practical draft cleared after successful submission")
      }
    } catch (error) {
      console.error("Error clearing practical draft:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    resetFieldErrors()

    // Validate current practical fields
    let hasFieldErrors = false

    if (!currentPractical.practical_aim) {
      setPracticalAimError("Practical aim is required")
      hasFieldErrors = true
    }

    // FIXED: Only validate associated units for non-practical-only subjects
    if (!isPracticalOnly && (!currentPractical.associated_units || currentPractical.associated_units.length === 0)) {
      setAssociatedUnitsError("Associated units are required")
      hasFieldErrors = true
    }

    if (!currentPractical.probable_week) {
      setProbableWeekError("Probable week is required")
      hasFieldErrors = true
    }

    if (!currentPractical.lab_hours || currentPractical.lab_hours < 1) {
      setLabHoursError("Lab hours must be at least 1")
      hasFieldErrors = true
    }

    if (!currentPractical.software_hardware_requirements) {
      setSoftwareHardwareError("Software/hardware requirements are required")
      hasFieldErrors = true
    }

    if (!currentPractical.practical_tasks) {
      setPracticalTasksError("Practical tasks are required")
      hasFieldErrors = true
    }

    if (!currentPractical.evaluation_methods || currentPractical.evaluation_methods.length === 0) {
      setEvaluationMethodsError("At least one evaluation method is required")
      hasFieldErrors = true
    }

    if (!currentPractical.practical_pedagogy) {
      setPracticalPedagogyError("Practical pedagogy is required")
      hasFieldErrors = true
    }

    if (!currentPractical.reference_material) {
      setReferenceError("Reference material is required")
      hasFieldErrors = true
    }

    if (!currentPractical.co_mapping || currentPractical.co_mapping.length === 0) {
      setCoMappingError("CO mapping is required")
      hasFieldErrors = true
    }

    if (!currentPractical.blooms_taxonomy || currentPractical.blooms_taxonomy.length === 0) {
      setBloomsError("At least one Bloom's taxonomy level is required")
      hasFieldErrors = true
    }

    if (!currentPractical.skill_mapping || currentPractical.skill_mapping.length === 0) {
      setSkillMappingError("At least one skill must be mapped")
      hasFieldErrors = true
    }

    if (!currentPractical.skill_objectives) {
      setSkillObjectivesError("Skill objectives are required")
      hasFieldErrors = true
    }

    const { errors, warnings } = validateAllPracticals()

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
      const result = await savePracticalPlanningForm({
        faculty_id: lessonPlan.faculty?.id || userData?.id || "",
        subject_id: lessonPlan.subject?.id || "",
        practicals: lessonPlan.practicals,
        remarks: lessonPlan.practical_remarks,
      })

      if (result.success) {
        toast.success("Practical details saved successfully")
        setValidationErrors([])
        setValidationWarnings([])

        setLessonPlan((prev: any) => ({
          ...prev,
          practical_planning_completed: true,
        }))

        // Clear the draft after successful submission
        await clearDraft()
      } else {
        toast.error(result.error || "Failed to save practical details")
      }
    } catch (error) {
      console.error("Error saving practical details:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  // Generate week options based on term dates from metadata
  const generateWeekOptions = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) {
      console.log("Missing term dates, cannot generate week options")
      return []
    }

    try {
      // Parse dates from DD-MM-YYYY format
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("-").map(Number)
        return new Date(year, month - 1, day) // Month is 0-indexed in JS Date
      }

      const startDate = parseDate(startDateStr)
      const endDate = parseDate(endDateStr)

      // Calculate number of weeks
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const numWeeks = Math.ceil(diffDays / 7)

      // Format date as DD-MM-YYYY
      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
      }

      // Generate week options
      return Array.from({ length: numWeeks }, (_, i) => {
        const weekStartDate = new Date(startDate)
        weekStartDate.setDate(startDate.getDate() + i * 7)

        const weekEndDate = new Date(weekStartDate)
        weekEndDate.setDate(weekStartDate.getDate() + 6)

        // If the end date exceeds the term end date, use the term end date
        if (weekEndDate > endDate) {
          return `Week ${i + 1} (${formatDate(weekStartDate)} - ${formatDate(endDate)})`
        }

        return `Week ${i + 1} (${formatDate(weekStartDate)} - ${formatDate(weekEndDate)})`
      })
    } catch (error) {
      console.error("Error generating week options:", error)
      return []
    }
  }

  const currentPracticals = lessonPlan.practicals || []
  const currentPractical = currentPracticals[activePractical]

  if (!currentPractical) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      {/* Auto-loading indicator */}
      {(lessonPlan.practicals?.length === 0 || !lessonPlan.practicals) && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md flex items-center">
          <Info className="h-4 w-4 mr-2" />
          <span>Loading saved drafts...</span>
        </div>
      )}

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

      {/* Practical Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 flex-wrap">
          {currentPracticals.map((practical: any, index: number) => (
            <Button
              key={practical.id}
              variant={activePractical === index ? "default" : "outline"}
              className={activePractical === index ? "bg-[#1A5CA1] hover:bg-[#154A80]" : ""}
              onClick={() => setActivePractical(index)}
            >
              Practical {index + 1}
              {practical.practical_aim && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {practical.practical_aim.substring(0, 10)}
                  {practical.practical_aim.length > 10 ? "..." : ""}
                </Badge>
              )}
            </Button>
          ))}
          <Button variant="outline" onClick={addPractical}>
            <Plus className="h-4 w-4 mr-1" />
            Add Practical
          </Button>
        </div>
        {currentPracticals.length > 1 && (
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removePractical(activePractical)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Practical
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Practical {activePractical + 1}</h3>
        </div>

        {/* Practical Aim */}
        <div>
          <Label htmlFor="practical-aim">
            Practical Aim <span className="text-red-500">*</span>
          </Label>
          <Input
            id="practical-aim"
            value={currentPractical.practical_aim || ""}
            onChange={(e) => handlePracticalChange(activePractical, "practical_aim", e.target.value)}
            placeholder="Enter practical aim"
            className="mt-1"
          />
          {practicalAimError && <p className="text-red-500 text-xs mt-1">{practicalAimError}</p>}
        </div>

        {/* FIXED: Only show Associated Units for non-practical-only subjects */}
        {!isPracticalOnly && (
          <div>
            <Label htmlFor="associated-units">
              Associated Units <span className="text-red-500">*</span>
            </Label>
            <Select
              value=""
              onValueChange={(value) => {
                const currentUnits = currentPractical.associated_units || []
                if (!currentUnits.includes(value)) {
                  handlePracticalChange(activePractical, "associated_units", [...currentUnits, value])
                }
              }}
            >
              <SelectTrigger id="associated-units" className="mt-1">
                <SelectValue placeholder={`${(currentPractical.associated_units || []).length} unit(s) selected`} />
              </SelectTrigger>
              <SelectContent>
                {(lessonPlan.units || []).map((unit: any, index: number) => (
                  <SelectItem key={unit.id || `unit-${index}`} value={unit.id || `unit-${index}`}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(currentPractical.associated_units || []).includes(unit.id || `unit-${index}`)}
                        onChange={() => {}}
                        className="mr-2"
                      />
                      Unit {index + 1}: {unit.unit_name || "No name specified"}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {associatedUnitsError && <p className="text-red-500 text-xs mt-1">{associatedUnitsError}</p>}

            {/* Display selected units */}
            {currentPractical.associated_units && currentPractical.associated_units.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {currentPractical.associated_units.map((unitId: string) => {
                  const unit = (lessonPlan.units || []).find((u: any) => u.id === unitId)
                  const unitIndex = (lessonPlan.units || []).findIndex((u: any) => u.id === unitId)
                  return (
                    <Badge key={unitId} variant="secondary" className="text-xs">
                      Unit {(unitIndex || 0) + 1}: {unit?.unit_name || "Unknown"}
                      <button
                        onClick={() => {
                          const updated = (currentPractical.associated_units || []).filter(
                            (id: string) => id !== unitId,
                          )
                          handlePracticalChange(activePractical, "associated_units", updated)
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
        )}

        {/* Probable Week and Lab Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="probable-week">
              Probable Week <span className="text-red-500">*</span>
            </Label>
            {/* Update the Select component to use week options from metadata */}
            <Select
              value={currentPractical.probable_week || ""}
              onValueChange={(value) => handlePracticalChange(activePractical, "probable_week", value)}
            >
              <SelectTrigger id="probable-week" className="mt-1">
                <SelectValue placeholder="Select probable week" />
              </SelectTrigger>
              <SelectContent>
                {weekOptions.length > 0 ? (
                  weekOptions.map((week) => (
                    <SelectItem key={week} value={week}>
                      {week}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-weeks">No weeks available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {probableWeekError && <p className="text-red-500 text-xs mt-1">{probableWeekError}</p>}
          </div>

          <div>
            <Label htmlFor="lab-hours">
              Lab Hours <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lab-hours"
              type="number"
              min="1"
              value={currentPractical.lab_hours || ""}
              onChange={(e) => handlePracticalChange(activePractical, "lab_hours", Number(e.target.value))}
              className="mt-1"
            />
            {labHoursError && <p className="text-red-500 text-xs mt-1">{labHoursError}</p>}
          </div>
        </div>

        {/* Software/Hardware Requirements */}
        <div>
          <Label htmlFor="software-hardware">
            Software/Hardware Requirements <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="software-hardware"
            value={currentPractical.software_hardware_requirements || ""}
            onChange={(e) => handlePracticalChange(activePractical, "software_hardware_requirements", e.target.value)}
            placeholder="Enter software/hardware requirements"
            className="mt-1"
            rows={3}
          />
          {softwareHardwareError && <p className="text-red-500 text-xs mt-1">{softwareHardwareError}</p>}
        </div>

        {/* Practical Tasks */}
        <div>
          <Label htmlFor="practical-tasks">
            Practical Tasks/Problem Statement <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="practical-tasks"
            value={currentPractical.practical_tasks || ""}
            onChange={(e) => handlePracticalChange(activePractical, "practical_tasks", e.target.value)}
            placeholder="Enter practical tasks or problem statement"
            className="mt-1"
            rows={4}
          />
          {practicalTasksError && <p className="text-red-500 text-xs mt-1">{practicalTasksError}</p>}
        </div>

        {/* Evaluation Methods */}
        <div>
          <Label className="mb-2 block">
            Evaluation Methods <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {evaluationMethodOptions
              .filter((method) => method !== "Other")
              .map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`evaluation-${method}`}
                    checked={(currentPractical.evaluation_methods || []).includes(method)}
                    onCheckedChange={(checked) => {
                      const current = currentPractical.evaluation_methods || []
                      if (checked) {
                        handlePracticalChange(activePractical, "evaluation_methods", [...current, method])
                      } else {
                        handlePracticalChange(
                          activePractical,
                          "evaluation_methods",
                          current.filter((m: string) => m !== method),
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`evaluation-${method}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {method}
                  </Label>
                </div>
              ))}

            {/* Other option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="evaluation-other"
                checked={
                  showOtherEvaluationInput ||
                  (currentPractical.evaluation_methods || []).some((m) => m.startsWith("Other:"))
                }
                onCheckedChange={(checked) => {
                  setShowOtherEvaluationInput(!!checked)
                  if (!checked) {
                    // Remove any "Other:" entries when unchecked
                    const current = currentPractical.evaluation_methods || []
                    handlePracticalChange(
                      activePractical,
                      "evaluation_methods",
                      current.filter((m: string) => !m.startsWith("Other:")),
                    )
                  }
                }}
              />
              <Label
                htmlFor="evaluation-other"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Other
              </Label>
            </div>
          </div>

          {/* Other Evaluation Method Input */}
          {showOtherEvaluationInput && (
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Enter other evaluation method"
                value={otherEvaluationValue}
                onChange={(e) => setOtherEvaluationValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (otherEvaluationValue.trim()) {
                    const current = currentPractical.evaluation_methods || []
                    handlePracticalChange(activePractical, "evaluation_methods", [
                      ...current,
                      `Other: ${otherEvaluationValue.trim()}`,
                    ])
                    setOtherEvaluationValue("")
                  }
                }}
              >
                Add
              </Button>
            </div>
          )}

          {/* Display selected evaluation methods */}
          {(currentPractical.evaluation_methods || []).length > 0 && (
            <div className="mt-2">
              <Label className="text-sm text-gray-500">Selected Methods:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(currentPractical.evaluation_methods || []).map((method: string, idx: number) => (
                  <Badge key={`${method}-${idx}`} variant="secondary" className="text-xs">
                    {method}
                    <button
                      onClick={() => {
                        const updated = (currentPractical.evaluation_methods || []).filter(
                          (m: string, i: number) => i !== idx,
                        )
                        handlePracticalChange(activePractical, "evaluation_methods", updated)
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {evaluationMethodsError && <p className="text-red-500 text-xs mt-1">{evaluationMethodsError}</p>}
        </div>

        {/* Practical Pedagogy */}
        <div>
          <Label htmlFor="practical-pedagogy">
            Practical Pedagogy <span className="text-red-500">*</span>
          </Label>
          <Select
            value={currentPractical.practical_pedagogy || ""}
            onValueChange={(value) => {
              if (value === "Other") {
                setShowOtherPedagogyInput(true)
              } else {
                handlePracticalChange(activePractical, "practical_pedagogy", value)
                setShowOtherPedagogyInput(false)
              }
            }}
          >
            <SelectTrigger id="practical-pedagogy" className="mt-1">
              <SelectValue placeholder="Select practical pedagogy" />
            </SelectTrigger>
            <SelectContent>
              {practicalPedagogyOptions
                .filter((option) => option !== "Other")
                .map((pedagogy) => (
                  <SelectItem key={pedagogy} value={pedagogy}>
                    {pedagogy}
                  </SelectItem>
                ))}
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Other Pedagogy Input */}
          {showOtherPedagogyInput && (
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Enter other pedagogy"
                value={otherPedagogyValue}
                onChange={(e) => setOtherPedagogyValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (otherPedagogyValue.trim()) {
                    handlePracticalChange(activePractical, "practical_pedagogy", `Other: ${otherPedagogyValue.trim()}`)
                    setOtherPedagogyValue("")
                    setShowOtherPedagogyInput(false)
                  }
                }}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowOtherPedagogyInput(false)
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {practicalPedagogyError && <p className="text-red-500 text-xs mt-1">{practicalPedagogyError}</p>}
        </div>

        {/* Reference Material */}
        <div>
          <Label htmlFor="reference-material">
            Reference Material <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reference-material"
            value={currentPractical.reference_material || ""}
            onChange={(e) => handlePracticalChange(activePractical, "reference_material", e.target.value)}
            placeholder="Enter reference material"
            className="mt-1"
            rows={3}
          />
          {referenceError && <p className="text-red-500 text-xs mt-1">{referenceError}</p>}
        </div>

        {/* CO, PSO, PEO Mapping */}
        <div className="grid grid-cols-1 gap-6">
          {/* CO Mapping */}
          <div>
            <Label>
              CO Mapping <span className="text-red-500">*</span>
            </Label>
            <Select
              value=""
              onValueChange={(value) => {
                const current = currentPractical.co_mapping || []
                if (!current.includes(value)) {
                  handlePracticalChange(activePractical, "co_mapping", [...current, value])
                }
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Course Outcomes" />
              </SelectTrigger>
              <SelectContent>
                {(lessonPlan.courseOutcomes || []).map((co: any, index: number) => (
                  <SelectItem key={co.id} value={co.id}>
                    CO{index + 1}: {co.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected COs */}
            <div className="mt-2 flex flex-wrap gap-2">
              {(currentPractical.co_mapping || []).map((coId: string) => {
                const co = (lessonPlan.courseOutcomes || []).find((c: any) => c.id === coId)
                const coIndex = (lessonPlan.courseOutcomes || []).findIndex((c: any) => c.id === coId)
                return (
                  <Badge key={coId} variant="secondary" className="text-xs">
                    CO{(coIndex || 0) + 1}: {co?.text || "Unknown"}
                    <button
                      onClick={() => {
                        const updated = (currentPractical.co_mapping || []).filter((id: string) => id !== coId)
                        handlePracticalChange(activePractical, "co_mapping", updated)
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
            <Label>PSO Mapping</Label>
            <Select
              value=""
              onValueChange={(value) => {
                const current = currentPractical.pso_mapping || []
                if (!current.includes(value)) {
                  handlePracticalChange(activePractical, "pso_mapping", [...current, value])
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
              {(currentPractical.pso_mapping || []).map((psoId: string) => {
                const pso = departmentPsoPeo.pso_data.find((p) => p.id === psoId)
                const psoIndex = departmentPsoPeo.pso_data.findIndex((p) => p.id === psoId)
                return (
                  <Badge key={psoId} variant="secondary" className="text-xs">
                    {pso?.label || `PSO${psoIndex + 1}`}: {pso?.description || "Unknown"}
                    <button
                      onClick={() => {
                        const updated = (currentPractical.pso_mapping || []).filter((id: string) => id !== psoId)
                        handlePracticalChange(activePractical, "pso_mapping", updated)
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* PEO Mapping */}
          <div>
            <Label>PEO Mapping</Label>
            <Select
              value=""
              onValueChange={(value) => {
                const current = currentPractical.peo_mapping || []
                if (!current.includes(value)) {
                  handlePracticalChange(activePractical, "peo_mapping", [...current, value])
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
              {(currentPractical.peo_mapping || []).map((peoId: string) => {
                const peo = departmentPsoPeo.peo_data.find((p) => p.id === peoId)
                const peoIndex = departmentPsoPeo.peo_data.findIndex((p) => p.id === peoId)
                return (
                  <Badge key={peoId} variant="secondary" className="text-xs">
                    {peo?.label || `PEO${peoIndex + 1}`}: {peo?.description || "Unknown"}
                    <button
                      onClick={() => {
                        const updated = (currentPractical.peo_mapping || []).filter((id: string) => id !== peoId)
                        handlePracticalChange(activePractical, "peo_mapping", updated)
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bloom's Taxonomy */}
        <div>
          <Label className="mb-2 block">
            Bloom&apos;s Taxonomy <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloomsTaxonomyOptions.map((taxonomy) => (
              <div key={taxonomy} className="flex items-center space-x-2">
                <Checkbox
                  id={`taxonomy-${taxonomy}`}
                  checked={(currentPractical.blooms_taxonomy || []).includes(taxonomy)}
                  onCheckedChange={(checked) => {
                    const current = currentPractical.blooms_taxonomy || []
                    if (checked) {
                      handlePracticalChange(activePractical, "blooms_taxonomy", [...current, taxonomy])
                    } else {
                      handlePracticalChange(
                        activePractical,
                        "blooms_taxonomy",
                        current.filter((t: string) => t !== taxonomy),
                      )
                    }
                  }}
                />
                <Label
                  htmlFor={`taxonomy-${taxonomy}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {taxonomy}
                </Label>
              </div>
            ))}
          </div>
          {bloomsError && <p className="text-red-500 text-xs mt-1">{bloomsError}</p>}
        </div>

        {/* Skill Mapping */}
        <div>
          <Label className="mb-2 block">
            Skill Mapping <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skillMappingOptions.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={(currentPractical.skill_mapping || []).includes(skill)}
                  onCheckedChange={(checked) => {
                    const current = currentPractical.skill_mapping || []
                    if (checked) {
                      handlePracticalChange(activePractical, "skill_mapping", [...current, skill])
                    } else {
                      handlePracticalChange(
                        activePractical,
                        "skill_mapping",
                        current.filter((s: string) => s !== skill),
                      )
                    }
                  }}
                />
                <Label
                  htmlFor={`skill-${skill}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {skill}
                </Label>
              </div>
            ))}

            {/* Other option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skill-other"
                checked={
                  showOtherSkillInput || (currentPractical.skill_mapping || []).some((s) => s.startsWith("Other:"))
                }
                onCheckedChange={(checked) => {
                  setShowOtherSkillInput(!!checked)
                  if (!checked) {
                    // Remove any "Other:" entries when unchecked
                    const current = currentPractical.skill_mapping || []
                    handlePracticalChange(
                      activePractical,
                      "skill_mapping",
                      current.filter((s: string) => !s.startsWith("Other:")),
                    )
                  }
                }}
              />
              <Label
                htmlFor="skill-other"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Other
              </Label>
            </div>
          </div>

          {/* Other Skill Input */}
          {showOtherSkillInput && (
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Enter other skill"
                value={otherSkillValue}
                onChange={(e) => setOtherSkillValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (otherSkillValue.trim()) {
                    const current = currentPractical.skill_mapping || []
                    handlePracticalChange(activePractical, "skill_mapping", [
                      ...current,
                      `Other: ${otherSkillValue.trim()}`,
                    ])
                    setOtherSkillValue("")
                  }
                }}
              >
                Add
              </Button>
            </div>
          )}

          {skillMappingError && <p className="text-red-500 text-xs mt-1">{skillMappingError}</p>}
        </div>

        {/* Skill Objectives */}
        <div>
          <Label htmlFor="skill-objectives">
            Skill Objectives <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="skill-objectives"
            value={currentPractical.skill_objectives || ""}
            onChange={(e) => handlePracticalChange(activePractical, "skill_objectives", e.target.value)}
            placeholder="Enter skill objectives"
            className="mt-1"
            rows={3}
          />
          {skillObjectivesError && <p className="text-red-500 text-xs mt-1">{skillObjectivesError}</p>}
        </div>

        {/* Remarks */}
        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={lessonPlan.practical_remarks || ""}
            onChange={(e) =>
              setLessonPlan((prev: any) => ({
                ...prev,
                practical_remarks: e.target.value,
              }))
            }
            placeholder="Enter any additional remarks"
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex items-center">
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()} {lastSaved.toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="min-w-[100px]"
            >
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="min-w-[100px] bg-[#1A5CA1] hover:bg-[#154A80]"
            >
              {saving ? "Saving..." : "Save"}
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
              Cancel
            </Button>
            <Button
              onClick={() => {
                setWarningDialogOpen(false)
                handleSave()
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


























// //@ts-nocheck
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, Trash2, AlertTriangle, Info, Users } from "lucide-react"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import { supabase } from "@/utils/supabase/client"
// import { savePracticalPlanningForm } from "@/app/dashboard/actions/savePracticalPlanningForm"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { saveFormDraft, loadFormDraft, deleteFormDraft } from "@/app/dashboard/actions/saveFormDraft"
// import * as yup from "yup"

// // Define the schema for form validation
// const schema = yup.object({
//   date: yup.date().required("Date is required"),
//   topic: yup.string().required("Topic is required"),
//   learningObjectives: yup.string().required("Learning Objectives are required"),
//   activities: yup.string().required("Activities are required"),
//   assessment: yup.string().required("Assessment is required"),
//   resources: yup.string().required("Resources are required"),
//   differentiation: yup.string().required("Differentiation is required"),
//   notes: yup.string(),
// })

// interface PSOPEOItem {
//   id: string
//   label?: string
//   description: string
// }

// interface PracticalPlanningFormProps {
//   lessonPlan: any
//   setLessonPlan: React.Dispatch<React.SetStateAction<any>>
//   userData: any
// }

// // Practical Pedagogy Options
// const practicalPedagogyOptions = [
//   "Problem-Based/Case Study Learning",
//   "Project-Based Learning",
//   "Collaborative Learning",
//   "Code Walkthroughs",
//   "Self-Learning with Guidance",
//   "Experiential Learning",
//   "Flipped Laboratory",
//   "Pair Programming",
//   "Peer Learning",
//   "Research-Oriented Practical",
//   "Other",
// ]

// // Evaluation Method Options
// const evaluationMethodOptions = [
//   "Viva",
//   "Lab Performance",
//   "File Submission",
//   "Mini-Project",
//   "Code Review",
//   "Peer Evaluation",
//   "Presentation",
//   "Other",
// ]

// // Bloom's Taxonomy Options for Practicals
// const bloomsTaxonomyOptions = ["Apply", "Analyze", "Evaluate", "Create"]

// // Skill Mapping Options
// const skillMappingOptions = [
//   "Technical Skills",
//   "Cognitive Skills",
//   "Professional Skills",
//   "Research and Innovation Skills",
//   "Entrepreneurial or Managerial Skills",
//   "Communication Skills",
//   "Leadership and Teamwork Skills",
//   "Creativity and Design Thinking Skills",
//   "Ethical, Social, and Environmental Awareness Skills",
// ]

// // Default PSO/PEO options if none are found
// const defaultPsoOptions = [
//   { id: "pso-1", label: "PSO1", description: "Program Specific Outcome 1" },
//   { id: "pso-2", label: "PSO2", description: "Program Specific Outcome 2" },
//   { id: "pso-3", label: "PSO3", description: "Program Specific Outcome 3" },
//   { id: "pso-4", label: "PSO4", description: "Program Specific Outcome 4" },
//   { id: "pso-5", label: "PSO5", description: "Program Specific Outcome 5" },
// ]

// const defaultPeoOptions = [
//   { id: "peo-1", label: "PEO1", description: "Program Educational Objective 1" },
//   { id: "peo-2", label: "PEO2", description: "Program Educational Objective 2" },
//   { id: "peo-3", label: "PEO3", description: "Program Educational Objective 3" },
//   { id: "peo-4", label: "PEO4", description: "Program Educational Objective 4" },
//   { id: "pso-5", label: "PEO5", description: "Program Educational Objective 5" },
// ]

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8

// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

// export default function PracticalPlanningForm({ lessonPlan, setLessonPlan, userData }: PracticalPlanningFormProps) {
//   const [activePractical, setActivePractical] = useState(0)
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [validationWarnings, setValidationWarnings] = useState<string[]>([])
//   const [departmentPsoPeo, setDepartmentPsoPeo] = useState<{
//     pso_data: PSOPEOItem[]
//     peo_data: PSOPEOItem[]
//   }>({
//     pso_data: [],
//     peo_data: [],
//   })
//   const [loadingPsoPeo, setLoadingPsoPeo] = useState(false)
//   const [psoPeoError, setPsoPeoError] = useState<string | null>(null)
//   const [saving, setSaving] = useState(false)
//   const [warningDialogOpen, setWarningDialogOpen] = useState(false)
//   const [currentWarning, setCurrentWarning] = useState("")
//   const [isSavingDraft, setIsSavingDraft] = useState(false)
//   const [lastSaved, setLastSaved] = useState<Date | null>(null)
//   const [showOtherSkillInput, setShowOtherSkillInput] = useState(false)
//   const [otherSkillValue, setOtherSkillValue] = useState("")
//   const [showOtherPedagogyInput, setShowOtherPedagogyInput] = useState(false)
//   const [otherPedagogyValue, setOtherPedagogyValue] = useState("")
//   const [showOtherEvaluationInput, setShowOtherEvaluationInput] = useState(false)
//   const [otherEvaluationValue, setOtherEvaluationValue] = useState("")

//   // Faculty sharing state
//   const [isSharing, setIsSharing] = useState(false)
//   const [allFaculty, setAllFaculty] = useState<any[]>([])
//   const [primaryFaculty, setPrimaryFaculty] = useState<any>(null)
//   const [secondaryFaculty, setSecondaryFaculty] = useState<any[]>([])

//   // Term dates from metadata
//   const [termDates, setTermDates] = useState<{
//     startDate: string
//     endDate: string
//   }>({
//     startDate: "",
//     endDate: "",
//   })
//   // Debug state for term dates
//   const [debugInfo, setDebugInfo] = useState<{
//     termStartDate: string
//     termEndDate: string
//     lessonPlanDates: {
//       start: string
//       end: string
//     }
//     metadataDates: {
//       start: string
//       end: string
//     }
//   }>({
//     termStartDate: "",
//     termEndDate: "",
//     lessonPlanDates: {
//       start: "",
//       end: "",
//     },
//     metadataDates: {
//       start: "",
//       end: "",
//     },
//   })
//   // Week options state
//   const [weekOptions, setWeekOptions] = useState<string[]>([])

//   // Field-specific error states
//   const [practicalAimError, setPracticalAimError] = useState("")
//   const [associatedUnitsError, setAssociatedUnitsError] = useState("")
//   const [probableWeekError, setProbableWeekError] = useState("")
//   const [labHoursError, setLabHoursError] = useState("")
//   const [softwareHardwareError, setSoftwareHardwareError] = useState("")
//   const [practicalTasksError, setPracticalTasksError] = useState("")
//   const [evaluationMethodsError, setEvaluationMethodsError] = useState("")
//   const [practicalPedagogyError, setPracticalPedagogyError] = useState("")
//   const [referenceError, setReferenceError] = useState("")
//   const [coMappingError, setCoMappingError] = useState("")
//   const [bloomsError, setBloomsError] = useState("")
//   const [skillMappingError, setSkillMappingError] = useState("")
//   const [skillObjectivesError, setSkillObjectivesError] = useState("")

//   // Add this to your state variables at the top of the component
//   const [isLoadingDraft, setIsLoadingDraft] = useState(true)

//   // FIXED: Check if subject is practical-only
//   const isPracticalOnly = lessonPlan?.subject?.is_practical === true && lessonPlan?.subject?.is_theory === false

//   // Check for faculty sharing when component mounts
//   useEffect(() => {
//     const loadFacultySharing = async () => {
//       if (!lessonPlan?.subject?.id) return

//       try {
//         const response = await fetch(`/api/faculty-sharing?subjectId=${lessonPlan.subject.id}`)
//         const result = await response.json()

//         if (result.success) {
//           setIsSharing(result.isSharing)
//           setAllFaculty(result.allFaculty)
//           setPrimaryFaculty(result.primaryFaculty)
//           setSecondaryFaculty(result.secondaryFaculty)
//         }
//       } catch (error) {
//         console.error("Error loading faculty sharing:", error)
//       }
//     }

//     loadFacultySharing()
//   }, [lessonPlan?.subject?.id])

//   // Initialize practicals if empty
//   useEffect(() => {
//     if (!lessonPlan.practicals || lessonPlan.practicals.length === 0) {
//       const initialPractical = {
//         id: "practical1",
//         practical_aim: "",
//         associated_units: [],
//         probable_week: "",
//         lab_hours: 2,
//         software_hardware_requirements: "",
//         practical_tasks: "",
//         evaluation_methods: [],
//         other_evaluation_method: "",
//         practical_pedagogy: "",
//         other_pedagogy: "",
//         reference_material: "",
//         co_mapping: [],
//         pso_mapping: [],
//         peo_mapping: [],
//         blooms_taxonomy: [],
//         skill_mapping: [],
//         skill_objectives: "",
//         assigned_faculty_id: userData?.id, // Assign current user by default
//       }

//       setLessonPlan((prev: any) => ({
//         ...prev,
//         practicals: [initialPractical],
//       }))
//     }
//   }, [lessonPlan?.practicals, setLessonPlan, userData?.id])

//   // Load PSO/PEO data
//   useEffect(() => {
//     const loadPsoPeoData = async () => {
//       if (lessonPlan.subject?.id) {
//         setLoadingPsoPeo(true)
//         setPsoPeoError(null)

//         try {
//           // First attempt - try to get PSO/PEO directly from the subject
//           const { data: subjectData, error: subjectError } = await supabase
//             .from("subjects")
//             .select("pso, peo, department_id")
//             .eq("id", lessonPlan.subject.id)
//             .single()

//           if (subjectError) {
//             console.error("Error fetching subject PSO/PEO data:", subjectError)
//             throw new Error("Failed to fetch subject data")
//           }

//           // Initialize with default empty arrays
//           let psoData: PSOPEOItem[] = []
//           let peoData: PSOPEOItem[] = []

//           // Check if subject has PSO/PEO data
//           if (subjectData?.pso?.items && Array.isArray(subjectData.pso.items) && subjectData.pso.items.length > 0) {
//             psoData = subjectData.pso.items
//           }

//           if (subjectData?.peo?.items && Array.isArray(subjectData.peo.items) && subjectData.peo.items.length > 0) {
//             peoData = subjectData.peo.items
//           }

//           // If no PSO/PEO data found in subject, try to get from department
//           if ((psoData.length === 0 || peoData.length === 0) && subjectData?.department_id) {
//             console.log("Fetching department PSO/PEO data for department:", subjectData.department_id)

//             // Try to get department-level PSO/PEO data
//             const { data: deptData, error: deptError } = await supabase
//               .from("department_pso_peo")
//               .select("pso_data, peo_data")
//               .eq("department_id", subjectData.department_id)
//               .single()

//             if (!deptError && deptData) {
//               if (psoData.length === 0 && deptData.pso_data && Array.isArray(deptData.pso_data)) {
//                 psoData = deptData.pso_data
//                 console.log("Using department PSO data:", psoData)
//               }

//               if (peoData.length === 0 && deptData.peo_data && Array.isArray(deptData.peo_data)) {
//                 peoData = deptData.peo_data
//                 console.log("Using department PEO data:", peoData)
//               }
//             } else if (deptError && deptError.code !== "PGRST116") {
//               // PGRST116 is "not found" error, which is acceptable
//               console.error("Error fetching department PSO/PEO:", deptError)
//             }
//           }

//           // If still no data, try to get from any subject in the same department
//           if ((psoData.length === 0 || peoData.length === 0) && subjectData?.department_id) {
//             const { data: departmentSubjects, error: deptSubjectsError } = await supabase
//               .from("subjects")
//               .select("pso, peo")
//               .eq("department_id", subjectData.department_id)
//               .not("pso", "is", null)
//               .not("peo", "is", null)
//               .limit(1)

//             if (!deptSubjectsError && departmentSubjects && departmentSubjects.length > 0) {
//               const deptSubject = departmentSubjects[0]
//               if (psoData.length === 0 && deptSubject.pso?.items) {
//                 psoData = deptSubject.pso.items
//               }
//               if (peoData.length === 0 && deptSubject.peo?.items) {
//                 peoData = deptSubject.peo.items
//               }
//             }
//           }

//           // If still no data, use default values
//           if (psoData.length === 0) {
//             psoData = defaultPsoOptions
//           }

//           if (peoData.length === 0) {
//             peoData = defaultPeoOptions
//           }

//           setDepartmentPsoPeo({
//             pso_data: psoData || defaultPsoOptions,
//             peo_data: peoData || defaultPeoOptions,
//           })

//           console.log("Final PSO/PEO data loaded:", {
//             pso_count: psoData?.length || 0,
//             peo_count: peoData?.length || 0,
//           })
//         } catch (error) {
//           console.error("Error loading PSO/PEO data:", error)
//           setPsoPeoError("Failed to load PSO/PEO data. Using default values.")

//           // Set default PSO/PEO data as fallback
//           setDepartmentPsoPeo({
//             pso_data: defaultPsoOptions,
//             peo_data: defaultPeoOptions,
//           })
//         } finally {
//           setLoadingPsoPeo(false)
//         }
//       }
//     }

//     loadPsoPeoData()
//   }, [lessonPlan.subject?.id])

//   // Fetch term dates from metadata and generate week options
//   useEffect(() => {
//     const fetchTermDates = async () => {
//       try {
//         if (!lessonPlan?.subject?.code) {
//           console.log("DEBUG - No subject code available")
//           return
//         }

//         console.log("DEBUG - Fetching term dates for subject code:", lessonPlan.subject.code)

//         const { data, error } = await supabase
//           .from("subjects")
//           .select("metadata")
//           .eq("code", lessonPlan.subject.code)
//           .single()

//         if (error) {
//           console.error("DEBUG - Error fetching subject metadata:", error)
//           return
//         }

//         if (!data) {
//           console.log("DEBUG - No data returned for subject")
//           return
//         }

//         console.log("DEBUG - Raw metadata from database:", data.metadata)

//         let metadata = data.metadata
//         if (typeof metadata === "string") {
//           try {
//             metadata = JSON.parse(metadata)
//             console.log("DEBUG - Parsed metadata:", metadata)
//           } catch (e) {
//             console.error("DEBUG - Error parsing metadata string:", e)
//             return
//           }
//         }

//         // Get term dates from metadata
//         const startDate = metadata?.term_start_date || ""
//         const endDate = metadata?.term_end_date || ""

//         // Update term dates state
//         setTermDates({
//           startDate,
//           endDate,
//         })

//         // Update debug info
//         setDebugInfo((prev) => ({
//           ...prev,
//           termStartDate: startDate,
//           termEndDate: endDate,
//           lessonPlanDates: {
//             start: lessonPlan?.term_start_date || "Not set in lessonPlan",
//             end: lessonPlan?.term_end_date || "Not set in lessonPlan",
//           },
//           metadataDates: {
//             start: startDate,
//             end: endDate,
//           },
//         }))

//         console.log("DEBUG - Term dates from metadata:", {
//           term_start_date: startDate,
//           term_end_date: endDate,
//         })

//         // Generate week options based on metadata dates
//         if (startDate && endDate) {
//           const weeks = generateWeekOptions(startDate, endDate)
//           setWeekOptions(weeks)
//         }
//       } catch (error) {
//         console.error("DEBUG - Unexpected error fetching term dates:", error)
//       }
//     }

//     fetchTermDates()
//   }, [lessonPlan?.subject?.code, userData?.id, lessonPlan?.faculty?.id, lessonPlan])

//   // Replace the existing useEffect for loading drafts with this improved implementation
//   useEffect(() => {
//     console.log("🔍 PRACTICAL AUTO-LOAD: useEffect triggered")
//     console.log("🔍 PRACTICAL AUTO-LOAD: Dependencies:", {
//       userId: userData?.id,
//       subjectId: lessonPlan?.subject?.id,
//       facultyId: lessonPlan?.faculty?.id,
//       hasUserData: !!userData,
//       hasLessonPlan: !!lessonPlan,
//       hasSubject: !!lessonPlan?.subject,
//     })

//     // Auto-load draft immediately when component mounts and required data is available
//     const autoLoadDraft = async () => {
//       console.log("🔍 PRACTICAL AUTO-LOAD: autoLoadDraft function called")

//       // Check if we have all required data - we need either userData.id OR faculty.id from lesson plan
//       const facultyId = lessonPlan?.faculty?.id || userData?.id
//       const subjectId = lessonPlan?.subject?.id

//       if (!facultyId || !subjectId) {
//         console.log("❌ PRACTICAL AUTO-LOAD: Missing required data:", {
//           facultyId,
//           subjectId,
//           userDataId: userData?.id,
//           lessonPlanFacultyId: lessonPlan?.faculty?.id,
//           hasLessonPlan: !!lessonPlan,
//           hasSubject: !!lessonPlan?.subject,
//         })
//         setIsLoadingDraft(false)
//         return
//       }

//       console.log("✅ PRACTICAL AUTO-LOAD: Required data available - Faculty ID:", facultyId, "Subject ID:", subjectId)

//       // Check if we already have practicals data to avoid unnecessary loading
//       const currentPracticals = lessonPlan.practicals || []
//       const hasExistingData = currentPracticals.length > 0 && currentPracticals[0]?.practical_aim

//       console.log("🔍 PRACTICAL AUTO-LOAD: Existing data check:", {
//         practicalsLength: currentPracticals.length,
//         firstPracticalAim: currentPracticals[0]?.practical_aim,
//         hasExistingData,
//         fullPracticals: currentPracticals,
//       })

//       if (hasExistingData) {
//         console.log("⏭️ PRACTICAL AUTO-LOAD: Practicals already loaded, skipping auto-load")
//         setIsLoadingDraft(false)
//         return
//       }

//       console.log("🚀 PRACTICAL AUTO-LOAD: Starting auto-load process...")
//       setIsLoadingDraft(true)

//       try {
//         console.log("🔍 PRACTICAL AUTO-LOAD: Using faculty ID:", facultyId)
//         console.log("🔍 PRACTICAL AUTO-LOAD: Using subject ID:", subjectId)

//         console.log("📡 PRACTICAL AUTO-LOAD: Making API call to loadFormDraft...")
//         const result = await loadFormDraft(facultyId, subjectId, "practical_planning")

//         console.log("📡 PRACTICAL AUTO-LOAD: API response:", result)

//         if (result.success && result.data) {
//           const data = result.data
//           console.log("✅ PRACTICAL AUTO-LOAD: Draft data received:", data)

//           // Check if we have valid practical data structure
//           if (data.practicals && Array.isArray(data.practicals) && data.practicals.length > 0) {
//             console.log("✅ PRACTICAL AUTO-LOAD: Valid practicals found:", data.practicals.length)

//             // Ensure each practical has proper structure
//             const validPracticals = data.practicals.map((practical: any, index: number) => {
//               const validPractical = {
//                 ...practical,
//                 // Ensure all required fields have default values
//                 id: practical.id || `practical${index + 1}`,
//                 practical_aim: practical.practical_aim || "",
//                 associated_units: Array.isArray(practical.associated_units) ? practical.associated_units : [],
//                 probable_week: practical.probable_week || "",
//                 lab_hours: typeof practical.lab_hours === "number" ? practical.lab_hours : 2,
//                 software_hardware_requirements: practical.software_hardware_requirements || "",
//                 practical_tasks: practical.practical_tasks || "",
//                 evaluation_methods: Array.isArray(practical.evaluation_methods) ? practical.evaluation_methods : [],
//                 other_evaluation_method: practical.other_evaluation_method || "",
//                 practical_pedagogy: practical.practical_pedagogy || "",
//                 other_pedagogy: practical.other_pedagogy || "",
//                 reference_material: practical.reference_material || "",
//                 co_mapping: Array.isArray(practical.co_mapping) ? practical.co_mapping : [],
//                 pso_mapping: Array.isArray(practical.pso_mapping) ? practical.pso_mapping : [],
//                 peo_mapping: Array.isArray(practical.peo_mapping) ? practical.peo_mapping : [],
//                 blooms_taxonomy: Array.isArray(practical.blooms_taxonomy) ? practical.blooms_taxonomy : [],
//                 skill_mapping: Array.isArray(practical.skill_mapping) ? practical.skill_mapping : [],
//                 skill_objectives: practical.skill_objectives || "",
//                 assigned_faculty_id: practical.assigned_faculty_id || userData?.id, // Ensure faculty assignment
//               }
//               console.log(`🔍 PRACTICAL AUTO-LOAD: Processed practical ${index + 1}:`, validPractical)
//               return validPractical
//             })

//             console.log("🔄 PRACTICAL AUTO-LOAD: Setting practicals to lesson plan...")

//             // Update the lesson plan with loaded data
//             setLessonPlan((prev: any) => {
//               console.log("🔄 PRACTICAL AUTO-LOAD: Previous lesson plan:", prev)
//               const updated = {
//                 ...prev,
//                 practicals: validPracticals,
//                 practical_remarks: data.remarks || "",
//               }
//               console.log("🔄 PRACTICAL AUTO-LOAD: Updated lesson plan:", updated)
//               return updated
//             })

//             console.log("🎉 PRACTICAL AUTO-LOAD: Success! Showing toast...")
//             toast.success(`Draft loaded automatically with ${validPracticals.length} practical(s)`)

//             // Set last saved time if available
//             if (data.savedAt) {
//               setLastSaved(new Date(data.savedAt))
//               console.log("🔍 PRACTICAL AUTO-LOAD: Set last saved time:", data.savedAt)
//             } else {
//               setLastSaved(new Date())
//               console.log("🔍 PRACTICAL AUTO-LOAD: Set current time as last saved")
//             }
//           } else {
//             console.log("❌ PRACTICAL AUTO-LOAD: No valid practical data found in draft")
//             console.log("🔍 PRACTICAL AUTO-LOAD: Data structure:", {
//               hasPracticals: !!data.practicals,
//               isArray: Array.isArray(data.practicals),
//               length: data.practicals?.length,
//               practicals: data.practicals,
//             })
//           }
//         } else {
//           console.log("❌ PRACTICAL AUTO-LOAD: No draft found or failed to load")
//           console.log("🔍 PRACTICAL AUTO-LOAD: Result details:", {
//             success: result.success,
//             hasData: !!result.data,
//             error: result.error,
//           })
//         }
//       } catch (error) {
//         console.error("💥 PRACTICAL AUTO-LOAD: Error occurred:", error)
//         toast.error("Failed to auto-load draft")
//       } finally {
//         console.log("🏁 PRACTICAL AUTO-LOAD: Process completed, setting loading to false")
//         setIsLoadingDraft(false)
//       }
//     }

//     // Run auto-load when we have the required data (either userData.id OR faculty.id from lesson plan)
//     const facultyId = lessonPlan?.faculty?.id || userData?.id
//     const subjectId = lessonPlan?.subject?.id

//     if (facultyId && subjectId) {
//       console.log("✅ PRACTICAL AUTO-LOAD: Conditions met, calling autoLoadDraft")
//       autoLoadDraft()
//     } else {
//       console.log("❌ PRACTICAL AUTO-LOAD: Conditions not met, skipping auto-load")
//       console.log("🔍 PRACTICAL AUTO-LOAD: Missing:", {
//         facultyId: !!facultyId,
//         subjectId: !!subjectId,
//         userDataId: !!userData?.id,
//         lessonPlanFacultyId: !!lessonPlan?.faculty?.id,
//       })
//       setIsLoadingDraft(false)
//     }
//   }, [userData?.id, lessonPlan?.subject?.id, lessonPlan, setLessonPlan, userData, lessonPlan?.faculty?.id])

//   const handlePracticalChange = (index: number, field: string, value: any) => {
//     const updatedPracticals = [...(lessonPlan.practicals || [])]

//     updatedPracticals[index] = {
//       ...updatedPracticals[index],
//       [field]: value,
//     }

//     setLessonPlan((prev: any) => ({
//       ...prev,
//       practicals: updatedPracticals,
//     }))

//     validatePractical(updatedPracticals[index], index)
//   }

//   const validatePractical = (practical: any, index: number) => {
//     const errors: string[] = []
//     const warnings: string[] = []

//     // Add validation logic here if needed

//     setValidationErrors(errors)
//     setValidationWarnings(warnings)
//   }

//   const validateAllPracticals = () => {
//     const errors: string[] = []
//     const warnings: string[] = []
//     const currentPracticals = lessonPlan.practicals || []

//     // Add validation logic here if needed

//     return { errors, warnings }
//   }

//   const resetFieldErrors = () => {
//     setPracticalAimError("")
//     setAssociatedUnitsError("")
//     setProbableWeekError("")
//     setLabHoursError("")
//     setSoftwareHardwareError("")
//     setPracticalTasksError("")
//     setEvaluationMethodsError("")
//     setPracticalPedagogyError("")
//     setReferenceError("")
//     setCoMappingError("")
//     setBloomsError("")
//     setSkillMappingError("")
//     setSkillObjectivesError("")
//   }

//   const addPractical = () => {
//     const currentPracticals = lessonPlan.practicals || []
//     const newPracticalNumber = currentPracticals.length + 1
//     const newPractical = {
//       id: `practical${newPracticalNumber}`,
//       practical_aim: "",
//       associated_units: [],
//       probable_week: "",
//       lab_hours: 2,
//       software_hardware_requirements: "",
//       practical_tasks: "",
//       evaluation_methods: [],
//       other_evaluation_method: "",
//       practical_pedagogy: "",
//       other_pedagogy: "",
//       reference_material: "",
//       co_mapping: [],
//       pso_mapping: [],
//       peo_mapping: [],
//       blooms_taxonomy: [],
//       skill_mapping: [],
//       skill_objectives: "",
//       assigned_faculty_id: userData?.id, // Assign current user by default
//     }

//     setLessonPlan((prev: any) => ({
//       ...prev,
//       practicals: [...currentPracticals, newPractical],
//     }))

//     setActivePractical(currentPracticals.length)
//   }

//   const removePractical = (index: number) => {
//     const currentPracticals = lessonPlan.practicals || []
//     if (currentPracticals.length <= 1) {
//       toast.error("At least one practical is required")
//       return
//     }

//     const updatedPracticals = currentPracticals.filter((_: any, i: number) => i !== index)
//     setLessonPlan((prev: any) => ({
//       ...prev,
//       practicals: updatedPracticals,
//     }))

//     if (activePractical >= index && activePractical > 0) {
//       setActivePractical(activePractical - 1)
//     }
//   }

//   const handleSaveDraft = async () => {
//     setIsSavingDraft(true)

//     try {
//       // Ensure we have valid practical data structure
//       const validPracticals = (lessonPlan.practicals || []).map((practical: any) => ({
//         ...practical,
//         // Ensure all required fields have default values
//         id: practical.id || `practical${Date.now()}`,
//         practical_aim: practical.practical_aim || "",
//         associated_units: practical.associated_units || [],
//         probable_week: practical.probable_week || "",
//         lab_hours: practical.lab_hours || 2,
//         software_hardware_requirements: practical.software_hardware_requirements || "",
//         practical_tasks: practical.practical_tasks || "",
//         evaluation_methods: practical.evaluation_methods || [],
//         other_evaluation_method: practical.other_evaluation_method || "",
//         practical_pedagogy: practical.practical_pedagogy || "",
//         other_pedagogy: practical.other_pedagogy || "",
//         reference_material: practical.reference_material || "",
//         co_mapping: practical.co_mapping || [],
//         pso_mapping: practical.pso_mapping || [],
//         peo_mapping: practical.peo_mapping || [],
//         blooms_taxonomy: practical.blooms_taxonomy || [],
//         skill_mapping: practical.skill_mapping || [],
//         skill_objectives: practical.skill_objectives || "",
//         assigned_faculty_id: practical.assigned_faculty_id || userData?.id, // Ensure faculty assignment
//       }))

//       const formData = {
//         practicals: validPracticals,
//         remarks: lessonPlan.practical_remarks || "",
//       }

//       console.log("Saving practical draft data:", formData) // Debug log

//       const result = await saveFormDraft(
//         lessonPlan?.faculty?.id || userData?.id || "",
//         lessonPlan?.subject?.id || "",
//         "practical_planning",
//         formData,
//       )

//       if (result.success) {
//         setLastSaved(new Date())
//         toast.success("Draft saved successfully")
//       } else {
//         console.error("Draft save failed:", result.error)
//         toast.error(`Failed to save draft: ${result.error}`)
//       }
//     } catch (error) {
//       console.error("Error saving draft:", error)
//       toast.error("Failed to save draft")
//     } finally {
//       setIsSavingDraft(false)
//     }
//   }

//   const clearDraft = async () => {
//     try {
//       const result = await deleteFormDraft(
//         lessonPlan?.faculty?.id || userData?.id || "",
//         lessonPlan?.subject?.id || "",
//         "practical_planning",
//       )

//       if (result.success) {
//         console.log("Practical draft cleared after successful submission")
//       }
//     } catch (error) {
//       console.error("Error clearing practical draft:", error)
//     }
//   }

//   const handleSave = async () => {
//     setSaving(true)
//     resetFieldErrors()

//     // Validate current practical fields
//     let hasFieldErrors = false

//     if (!currentPractical.practical_aim) {
//       setPracticalAimError("Practical aim is required")
//       hasFieldErrors = true
//     }

//     // FIXED: Only validate associated units for non-practical-only subjects
//     if (!isPracticalOnly && (!currentPractical.associated_units || currentPractical.associated_units.length === 0)) {
//       setAssociatedUnitsError("Associated units are required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.probable_week) {
//       setProbableWeekError("Probable week is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.lab_hours || currentPractical.lab_hours < 1) {
//       setLabHoursError("Lab hours must be at least 1")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.software_hardware_requirements) {
//       setSoftwareHardwareError("Software/hardware requirements are required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.practical_tasks) {
//       setPracticalTasksError("Practical tasks are required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.evaluation_methods || currentPractical.evaluation_methods.length === 0) {
//       setEvaluationMethodsError("At least one evaluation method is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.practical_pedagogy) {
//       setPracticalPedagogyError("Practical pedagogy is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.reference_material) {
//       setReferenceError("Reference material is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.co_mapping || currentPractical.co_mapping.length === 0) {
//       setCoMappingError("CO mapping is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.blooms_taxonomy || currentPractical.blooms_taxonomy.length === 0) {
//       setBloomsError("At least one Bloom's taxonomy level is required")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.skill_mapping || currentPractical.skill_mapping.length === 0) {
//       setSkillMappingError("At least one skill must be mapped")
//       hasFieldErrors = true
//     }

//     if (!currentPractical.skill_objectives) {
//       setSkillObjectivesError("Skill objectives are required")
//       hasFieldErrors = true
//     }

//     const { errors, warnings } = validateAllPracticals()

//     if (errors.length > 0 || hasFieldErrors) {
//       setValidationErrors(errors)
//       setValidationWarnings(warnings)
//       toast.error("Please fix validation errors before saving")
//       setSaving(false)
//       return
//     }

//     if (warnings.length > 0) {
//       setValidationWarnings(warnings)
//     }

//     try {
//       const result = await savePracticalPlanningForm({
//         faculty_id: lessonPlan.faculty?.id || userData?.id || "",
//         subject_id: lessonPlan.subject?.id || "",
//         practicals: lessonPlan.practicals,
//         remarks: lessonPlan.practical_remarks,
//       })

//       if (result.success) {
//         toast.success("Practical details saved successfully")
//         setValidationErrors([])
//         setValidationWarnings([])

//         setLessonPlan((prev: any) => ({
//           ...prev,
//           practical_planning_completed: true,
//         }))

//         // Clear the draft after successful submission
//         await clearDraft()
//       } else {
//         toast.error(result.error || "Failed to save practical details")
//       }
//     } catch (error) {
//       console.error("Error saving practical details:", error)
//       toast.error("An unexpected error occurred")
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Generate week options based on term dates from metadata
//   const generateWeekOptions = (startDateStr: string, endDateStr: string) => {
//     if (!startDateStr || !endDateStr) {
//       console.log("Missing term dates, cannot generate week options")
//       return []
//     }

//     try {
//       // Parse dates from DD-MM-YYYY format
//       const parseDate = (dateStr: string) => {
//         const [day, month, year] = dateStr.split("-").map(Number)
//         return new Date(year, month - 1, day) // Month is 0-indexed in JS Date
//       }

//       const startDate = parseDate(startDateStr)
//       const endDate = parseDate(endDateStr)

//       // Calculate number of weeks
//       const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//       const numWeeks = Math.ceil(diffDays / 7)

//       // Format date as DD-MM-YYYY
//       const formatDate = (date: Date) => {
//         const day = date.getDate().toString().padStart(2, "0")
//         const month = (date.getMonth() + 1).toString().padStart(2, "0")
//         const year = date.getFullYear()
//         return `${day}-${month}-${year}`
//       }

//       // Generate week options
//       return Array.from({ length: numWeeks }, (_, i) => {
//         const weekStartDate = new Date(startDate)
//         weekStartDate.setDate(startDate.getDate() + i * 7)

//         const weekEndDate = new Date(weekStartDate)
//         weekEndDate.setDate(weekStartDate.getDate() + 6)

//         // If the end date exceeds the term end date, use the term end date
//         if (weekEndDate > endDate) {
//           return `Week ${i + 1} (${formatDate(weekStartDate)} - ${formatDate(endDate)})`
//         }

//         return `Week ${i + 1} (${formatDate(weekStartDate)} - ${formatDate(weekEndDate)})`
//       })
//     } catch (error) {
//       console.error("Error generating week options:", error)
//       return []
//     }
//   }

//   const currentPracticals = lessonPlan.practicals || []
//   const currentPractical = currentPracticals[activePractical]

//   if (!currentPractical) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="p-6">
//       {/* Shared Subject Detected Banner */}
//       {isSharing && (
//         <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="bg-blue-100 p-2 rounded-full">
//                 <Users className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <h4 className="font-bold text-blue-800">Shared Subject Detected</h4>
//                 <p className="text-sm text-blue-600">
//                   This subject is shared among multiple faculty members. Please assign each practical to the appropriate
//                   faculty.
//                 </p>
//               </div>
//             </div>
//             <Badge variant="default" className="bg-blue-600 text-white px-3 py-1">
//               {allFaculty.length} Faculty Sharing
//             </Badge>
//           </div>

//           <div className="mt-3 grid grid-cols-2 gap-4">
//             <div className="bg-white rounded p-3 border border-blue-200">
//               <span className="text-sm font-medium text-gray-700">Primary Faculty:</span>
//               <p className="font-semibold text-blue-800">{primaryFaculty?.name || "Not assigned"}</p>
//             </div>
//             <div className="bg-white rounded p-3 border border-blue-200">
//               <span className="text-sm font-medium text-gray-700">Secondary Faculty:</span>
//               <p className="font-semibold text-blue-800">{secondaryFaculty?.[0]?.name || "Not assigned"}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Auto-loading indicator */}
//       {(lessonPlan.practicals?.length === 0 || !lessonPlan.practicals) && (
//         <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md flex items-center">
//           <Info className="h-4 w-4 mr-2" />
//           <span>Loading saved drafts...</span>
//         </div>
//       )}

//       {/* Validation Errors */}
//       {validationErrors.length > 0 && (
//         <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
//           <div className="flex items-start">
//             <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
//             <div className="text-red-800">
//               <ul className="list-disc list-inside space-y-1">
//                 {validationErrors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Validation Warnings */}
//       {validationWarnings.length > 0 && (
//         <div className="mb-6 border border-amber-200 bg-amber-50 rounded-lg p-4">
//           <div className="flex items-start">
//             <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
//             <div className="text-amber-800">
//               <ul className="list-disc list-inside space-y-1">
//                 {validationWarnings.map((warning, index) => (
//                   <li key={index}>{warning}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Practical Navigation */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex space-x-2 flex-wrap">
//           {currentPracticals.map((practical: any, index: number) => (
//             <Button
//               key={practical.id}
//               variant={activePractical === index ? "default" : "outline"}
//               className={activePractical === index ? "bg-[#1A5CA1] hover:bg-[#154A80]" : ""}
//               onClick={() => setActivePractical(index)}
//             >
//               Practical {index + 1}
//               {practical.practical_aim && (
//                 <Badge variant="secondary" className="ml-2 text-xs">
//                   {practical.practical_aim.substring(0, 10)}
//                   {practical.practical_aim.length > 10 ? "..." : ""}
//                 </Badge>
//               )}
//             </Button>
//           ))}
//           <Button variant="outline" onClick={addPractical}>
//             <Plus className="h-4 w-4 mr-1" />
//             Add Practical
//           </Button>
//         </div>
//         {currentPracticals.length > 1 && (
//           <Button
//             variant="ghost"
//             className="text-red-500 hover:text-red-700 hover:bg-red-50"
//             onClick={() => removePractical(activePractical)}
//           >
//             <Trash2 className="h-4 w-4 mr-1" />
//             Remove Practical
//           </Button>
//         )}
//       </div>

//       {/* Faculty Assignment Summary - Only visible when sharing is enabled */}
//       {isSharing && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//           <h4 className="font-semibold text-green-800 mb-2 flex items-center text-sm">
//             <Users className="h-4 w-4 mr-2" />
//             Faculty Assignment Summary
//           </h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
//             {currentPracticals.map((practical: any, index: number) => {
//               const assignedFacultyId = practical.assigned_faculty_id
//               const facultyName = allFaculty.find((f) => f.id === assignedFacultyId)?.name || "Unassigned"
//               return (
//                 <div
//                   key={practical.id}
//                   className="flex items-center justify-between bg-white rounded p-1.5 border text-sm"
//                 >
//                   <span className="font-medium">Practical {index + 1}</span>
//                   <Badge variant={assignedFacultyId ? "default" : "secondary"} className="text-xs">
//                     {facultyName}
//                   </Badge>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       )}

//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h3 className="text-xl font-semibold">Practical {activePractical + 1}</h3>
//         </div>

//         {/* Faculty Assignment Dropdown - Only show when sharing is enabled */}
//         {isSharing && (
//           <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//             <Users className="h-5 w-5 text-blue-600" />
//             <span className="text-sm font-semibold text-blue-800">Faculty Assignment:</span>
//             <Select
//               value={currentPractical.assigned_faculty_id || ""}
//               onValueChange={(value) => handlePracticalChange(activePractical, "assigned_faculty_id", value)}
//             >
//               <SelectTrigger className="w-[200px] bg-white border-blue-300">
//                 <SelectValue placeholder="Select Faculty" />
//               </SelectTrigger>
//               <SelectContent>
//                 {allFaculty.map((faculty) => (
//                   <SelectItem key={faculty.id} value={faculty.id}>
//                     {faculty.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Badge variant="outline" className="bg-green-100 text-green-800">
//               Shared Subject
//             </Badge>
//           </div>
//         )}

//         {/* Practical Aim */}
//         <div>
//           <Label htmlFor="practical-aim">
//             Practical Aim <span className="text-red-500">*</span>
//           </Label>
//           <Input
//             id="practical-aim"
//             value={currentPractical.practical_aim || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "practical_aim", e.target.value)}
//             placeholder="Enter practical aim"
//             className="mt-1"
//           />
//           {practicalAimError && <p className="text-red-500 text-xs mt-1">{practicalAimError}</p>}
//         </div>

//         {/* FIXED: Only show Associated Units for non-practical-only subjects */}
//         {!isPracticalOnly && (
//           <div>
//             <Label htmlFor="associated-units">
//               Associated Units <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value=""
//               onValueChange={(value) => {
//                 const currentUnits = currentPractical.associated_units || []
//                 if (!currentUnits.includes(value)) {
//                   handlePracticalChange(activePractical, "associated_units", [...currentUnits, value])
//                 }
//               }}
//             >
//               <SelectTrigger id="associated-units" className="mt-1">
//                 <SelectValue placeholder={`${(currentPractical.associated_units || []).length} unit(s) selected`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {(lessonPlan.units || []).map((unit: any, index: number) => (
//                   <SelectItem key={unit.id || `unit-${index}`} value={unit.id || `unit-${index}`}>
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="checkbox"
//                         checked={(currentPractical.associated_units || []).includes(unit.id || `unit-${index}`)}
//                         onChange={() => {}}
//                         className="mr-2"
//                       />
//                       Unit {index + 1}: {unit.unit_name || "No name specified"}
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {associatedUnitsError && <p className="text-red-500 text-xs mt-1">{associatedUnitsError}</p>}

//             {/* Display selected units */}
//             {currentPractical.associated_units && currentPractical.associated_units.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {currentPractical.associated_units.map((unitId: string) => {
//                   const unit = (lessonPlan.units || []).find((u: any) => u.id === unitId)
//                   const unitIndex = (lessonPlan.units || []).findIndex((u: any) => u.id === unitId)
//                   return (
//                     <Badge key={unitId} variant="secondary" className="text-xs">
//                       Unit {(unitIndex || 0) + 1}: {unit?.unit_name || "Unknown"}
//                       <button
//                         onClick={() => {
//                           const updated = (currentPractical.associated_units || []).filter(
//                             (id: string) => id !== unitId,
//                           )
//                           handlePracticalChange(activePractical, "associated_units", updated)
//                         }}
//                         className="ml-1 text-red-500 hover:text-red-700"
//                       >
//                         ×
//                       </button>
//                     </Badge>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Probable Week and Lab Hours */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Label htmlFor="probable-week">
//               Probable Week <span className="text-red-500">*</span>
//             </Label>
//             {/* Update the Select component to use week options from metadata */}
//             <Select
//               value={currentPractical.probable_week || ""}
//               onValueChange={(value) => handlePracticalChange(activePractical, "probable_week", value)}
//             >
//               <SelectTrigger id="probable-week" className="mt-1">
//                 <SelectValue placeholder="Select probable week" />
//               </SelectTrigger>
//               <SelectContent>
//                 {weekOptions.length > 0 ? (
//                   weekOptions.map((week) => (
//                     <SelectItem key={week} value={week}>
//                       {week}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="no-weeks">No weeks available</SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//             {probableWeekError && <p className="text-red-500 text-xs mt-1">{probableWeekError}</p>}
//           </div>

//           <div>
//             <Label htmlFor="lab-hours">
//               Lab Hours <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="lab-hours"
//               type="number"
//               min="1"
//               value={currentPractical.lab_hours || ""}
//               onChange={(e) => handlePracticalChange(activePractical, "lab_hours", Number(e.target.value))}
//               className="mt-1"
//             />
//             {labHoursError && <p className="text-red-500 text-xs mt-1">{labHoursError}</p>}
//           </div>
//         </div>

//         {/* Software/Hardware Requirements */}
//         <div>
//           <Label htmlFor="software-hardware">
//             Software/Hardware Requirements <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="software-hardware"
//             value={currentPractical.software_hardware_requirements || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "software_hardware_requirements", e.target.value)}
//             placeholder="Enter software/hardware requirements"
//             className="mt-1"
//             rows={3}
//           />
//           {softwareHardwareError && <p className="text-red-500 text-xs mt-1">{softwareHardwareError}</p>}
//         </div>

//         {/* Practical Tasks */}
//         <div>
//           <Label htmlFor="practical-tasks">
//             Practical Tasks/Problem Statement <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="practical-tasks"
//             value={currentPractical.practical_tasks || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "practical_tasks", e.target.value)}
//             placeholder="Enter practical tasks or problem statement"
//             className="mt-1"
//             rows={4}
//           />
//           {practicalTasksError && <p className="text-red-500 text-xs mt-1">{practicalTasksError}</p>}
//         </div>

//         {/* Evaluation Methods */}
//         <div>
//           <Label className="mb-2 block">
//             Evaluation Methods <span className="text-red-500">*</span>
//           </Label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {evaluationMethodOptions
//               .filter((method) => method !== "Other")
//               .map((method) => (
//                 <div key={method} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`evaluation-${method}`}
//                     checked={(currentPractical.evaluation_methods || []).includes(method)}
//                     onCheckedChange={(checked) => {
//                       const current = currentPractical.evaluation_methods || []
//                       if (checked) {
//                         handlePracticalChange(activePractical, "evaluation_methods", [...current, method])
//                       } else {
//                         handlePracticalChange(
//                           activePractical,
//                           "evaluation_methods",
//                           current.filter((m: string) => m !== method),
//                         )
//                       }
//                     }}
//                   />
//                   <Label
//                     htmlFor={`evaluation-${method}`}
//                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                   >
//                     {method}
//                   </Label>
//                 </div>
//               ))}

//             {/* Other option */}
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="evaluation-other"
//                 checked={
//                   showOtherEvaluationInput ||
//                   (currentPractical.evaluation_methods || []).some((m) => m.startsWith("Other:"))
//                 }
//                 onCheckedChange={(checked) => {
//                   setShowOtherEvaluationInput(!!checked)
//                   if (!checked) {
//                     // Remove any "Other:" entries when unchecked
//                     const current = currentPractical.evaluation_methods || []
//                     handlePracticalChange(
//                       activePractical,
//                       "evaluation_methods",
//                       current.filter((m: string) => !m.startsWith("Other:")),
//                     )
//                   }
//                 }}
//               />
//               <Label
//                 htmlFor="evaluation-other"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Other
//               </Label>
//             </div>
//           </div>

//           {/* Other Evaluation Method Input */}
//           {showOtherEvaluationInput && (
//             <div className="mt-3 flex gap-2">
//               <Input
//                 placeholder="Enter other evaluation method"
//                 value={otherEvaluationValue}
//                 onChange={(e) => setOtherEvaluationValue(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   if (otherEvaluationValue.trim()) {
//                     const current = currentPractical.evaluation_methods || []
//                     handlePracticalChange(activePractical, "evaluation_methods", [
//                       ...current,
//                       `Other: ${otherEvaluationValue.trim()}`,
//                     ])
//                     setOtherEvaluationValue("")
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//             </div>
//           )}

//           {/* Display selected evaluation methods */}
//           {(currentPractical.evaluation_methods || []).length > 0 && (
//             <div className="mt-2">
//               <Label className="text-sm text-gray-500">Selected Methods:</Label>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {(currentPractical.evaluation_methods || []).map((method: string, idx: number) => (
//                   <Badge key={`${method}-${idx}`} variant="secondary" className="text-xs">
//                     {method}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.evaluation_methods || []).filter(
//                           (m: string, i: number) => i !== idx,
//                         )
//                         handlePracticalChange(activePractical, "evaluation_methods", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {evaluationMethodsError && <p className="text-red-500 text-xs mt-1">{evaluationMethodsError}</p>}
//         </div>

//         {/* Practical Pedagogy */}
//         <div>
//           <Label htmlFor="practical-pedagogy">
//             Practical Pedagogy <span className="text-red-500">*</span>
//           </Label>
//           <Select
//             value={currentPractical.practical_pedagogy || ""}
//             onValueChange={(value) => {
//               if (value === "Other") {
//                 setShowOtherPedagogyInput(true)
//               } else {
//                 handlePracticalChange(activePractical, "practical_pedagogy", value)
//                 setShowOtherPedagogyInput(false)
//               }
//             }}
//           >
//             <SelectTrigger id="practical-pedagogy" className="mt-1">
//               <SelectValue placeholder="Select practical pedagogy" />
//             </SelectTrigger>
//             <SelectContent>
//               {practicalPedagogyOptions
//                 .filter((option) => option !== "Other")
//                 .map((pedagogy) => (
//                   <SelectItem key={pedagogy} value={pedagogy}>
//                     {pedagogy}
//                   </SelectItem>
//                 ))}
//               <SelectItem value="Other">Other</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Other Pedagogy Input */}
//           {showOtherPedagogyInput && (
//             <div className="mt-3 flex gap-2">
//               <Input
//                 placeholder="Enter other pedagogy"
//                 value={otherPedagogyValue}
//                 onChange={(e) => setOtherPedagogyValue(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   if (otherPedagogyValue.trim()) {
//                     handlePracticalChange(activePractical, "practical_pedagogy", otherPedagogyValue.trim())
//                     setShowOtherPedagogyInput(false)
//                     setOtherPedagogyValue("")
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//             </div>
//           )}

//           {practicalPedagogyError && <p className="text-red-500 text-xs mt-1">{practicalPedagogyError}</p>}
//         </div>

//         {/* Reference Material */}
//         <div>
//           <Label htmlFor="reference-material">
//             Reference Material <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="reference-material"
//             value={currentPractical.reference_material || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "reference_material", e.target.value)}
//             placeholder="Enter reference material"
//             className="mt-1"
//             rows={3}
//           />
//           {referenceError && <p className="text-red-500 text-xs mt-1">{referenceError}</p>}
//         </div>

//         {/* CO Mapping */}
//         <div>
//           <Label htmlFor="co-mapping">
//             CO Mapping <span className="text-red-500">*</span>
//           </Label>
//           <Select
//             value=""
//             onValueChange={(value) => {
//               const currentCOs = currentPractical.co_mapping || []
//               if (!currentCOs.includes(value)) {
//                 handlePracticalChange(activePractical, "co_mapping", [...currentCOs, value])
//               }
//             }}
//           >
//             <SelectTrigger id="co-mapping" className="mt-1">
//               <SelectValue placeholder={`${(currentPractical.co_mapping || []).length} CO(s) selected`} />
//             </SelectTrigger>
//             <SelectContent>
//               {(lessonPlan.course_outcomes || []).map((co: any, index: number) => (
//                 <SelectItem key={co.id || `co-${index}`} value={co.id || `co-${index}`}>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={(currentPractical.co_mapping || []).includes(co.id || `co-${index}`)}
//                       onChange={() => {}}
//                       className="mr-2"
//                     />
//                     CO {index + 1}: {co.description || "No description specified"}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {coMappingError && <p className="text-red-500 text-xs mt-1">{coMappingError}</p>}

//           {/* Display selected COs */}
//           {currentPractical.co_mapping && currentPractical.co_mapping.length > 0 && (
//             <div className="mt-2 flex flex-wrap gap-2">
//               {currentPractical.co_mapping.map((coId: string) => {
//                 const co = (lessonPlan.course_outcomes || []).find((c: any) => c.id === coId)
//                 const coIndex = (lessonPlan.course_outcomes || []).findIndex((c: any) => c.id === coId)
//                 return (
//                   <Badge key={coId} variant="secondary" className="text-xs">
//                     CO {(coIndex || 0) + 1}: {co?.description || "Unknown"}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.co_mapping || []).filter((id: string) => id !== coId)
//                         handlePracticalChange(activePractical, "co_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* PSO Mapping */}
//         <div>
//           <Label htmlFor="pso-mapping">PSO Mapping</Label>
//           <Select
//             value=""
//             onValueChange={(value) => {
//               const currentPSOs = currentPractical.pso_mapping || []
//               if (!currentPSOs.includes(value)) {
//                 handlePracticalChange(activePractical, "pso_mapping", [...currentPSOs, value])
//               }
//             }}
//           >
//             <SelectTrigger id="pso-mapping" className="mt-1">
//               <SelectValue placeholder={`${(currentPractical.pso_mapping || []).length} PSO(s) selected`} />
//             </SelectTrigger>
//             <SelectContent>
//               {departmentPsoPeo.pso_data.map((pso) => (
//                 <SelectItem key={pso.id} value={pso.id}>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={(currentPractical.pso_mapping || []).includes(pso.id)}
//                       onChange={() => {}}
//                       className="mr-2"
//                     />
//                     {pso.label}: {pso.description}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Display selected PSOs */}
//           {currentPractical.pso_mapping && currentPractical.pso_mapping.length > 0 && (
//             <div className="mt-2 flex flex-wrap gap-2">
//               {currentPractical.pso_mapping.map((psoId: string) => {
//                 const pso = departmentPsoPeo.pso_data.find((p: any) => p.id === psoId)
//                 return (
//                   <Badge key={psoId} variant="secondary" className="text-xs">
//                     {pso?.label || "Unknown"}: {pso?.description || "No description"}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.pso_mapping || []).filter((id: string) => id !== psoId)
//                         handlePracticalChange(activePractical, "pso_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* PEO Mapping */}
//         <div>
//           <Label htmlFor="peo-mapping">PEO Mapping</Label>
//           <Select
//             value=""
//             onValueChange={(value) => {
//               const currentPEOs = currentPractical.peo_mapping || []
//               if (!currentPEOs.includes(value)) {
//                 handlePracticalChange(activePractical, "peo_mapping", [...currentPEOs, value])
//               }
//             }}
//           >
//             <SelectTrigger id="peo-mapping" className="mt-1">
//               <SelectValue placeholder={`${(currentPractical.peo_mapping || []).length} PEO(s) selected`} />
//             </SelectTrigger>
//             <SelectContent>
//               {departmentPsoPeo.peo_data.map((peo) => (
//                 <SelectItem key={peo.id} value={peo.id}>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={(currentPractical.peo_mapping || []).includes(peo.id)}
//                       onChange={() => {}}
//                       className="mr-2"
//                     />
//                     {peo.label}: {peo.description}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Display selected PEOs */}
//           {currentPractical.peo_mapping && currentPractical.peo_mapping.length > 0 && (
//             <div className="mt-2 flex flex-wrap gap-2">
//               {currentPractical.peo_mapping.map((peoId: string) => {
//                 const peo = departmentPsoPeo.peo_data.find((p: any) => p.id === peoId)
//                 return (
//                   <Badge key={peoId} variant="secondary" className="text-xs">
//                     {peo?.label || "Unknown"}: {peo?.description || "No description"}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.peo_mapping || []).filter((id: string) => id !== peoId)
//                         handlePracticalChange(activePractical, "peo_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* Bloom's Taxonomy */}
//         <div>
//           <Label className="mb-2 block">
//             Bloom's Taxonomy <span className="text-red-500">*</span>
//           </Label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {bloomsTaxonomyOptions.map((level) => (
//               <div key={level} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`blooms-${level}`}
//                   checked={(currentPractical.blooms_taxonomy || []).includes(level)}
//                   onCheckedChange={(checked) => {
//                     const current = currentPractical.blooms_taxonomy || []
//                     if (checked) {
//                       handlePracticalChange(activePractical, "blooms_taxonomy", [...current, level])
//                     } else {
//                       handlePracticalChange(
//                         activePractical,
//                         "blooms_taxonomy",
//                         current.filter((l: string) => l !== level),
//                       )
//                     }
//                   }}
//                 />
//                 <Label
//                   htmlFor={`blooms-${level}`}
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   {level}
//                 </Label>
//               </div>
//             ))}
//           </div>
//           {bloomsError && <p className="text-red-500 text-xs mt-1">{bloomsError}</p>}
//         </div>

//         {/* Skill Mapping */}
//         <div>
//           <Label className="mb-2 block">
//             Skill Mapping <span className="text-red-500">*</span>
//           </Label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {skillMappingOptions
//               .filter((skill) => skill !== "Other")
//               .map((skill) => (
//                 <div key={skill} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`skill-${skill}`}
//                     checked={(currentPractical.skill_mapping || []).includes(skill)}
//                     onCheckedChange={(checked) => {
//                       const current = currentPractical.skill_mapping || []
//                       if (checked) {
//                         handlePracticalChange(activePractical, "skill_mapping", [...current, skill])
//                       } else {
//                         handlePracticalChange(
//                           activePractical,
//                           "skill_mapping",
//                           current.filter((s: string) => s !== skill),
//                         )
//                       }
//                     }}
//                   />
//                   <Label
//                     htmlFor={`skill-${skill}`}
//                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                   >
//                     {skill}
//                   </Label>
//                 </div>
//               ))}

//             {/* Other option */}
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="skill-other"
//                 checked={
//                   showOtherSkillInput || (currentPractical.skill_mapping || []).some((s) => s.startsWith("Other:"))
//                 }
//                 onCheckedChange={(checked) => {
//                   setShowOtherSkillInput(!!checked)
//                   if (!checked) {
//                     // Remove any "Other:" entries when unchecked
//                     const current = currentPractical.skill_mapping || []
//                     handlePracticalChange(
//                       activePractical,
//                       "skill_mapping",
//                       current.filter((s: string) => !s.startsWith("Other:")),
//                     )
//                   }
//                 }}
//               />
//               <Label
//                 htmlFor="skill-other"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Other
//               </Label>
//             </div>
//           </div>

//           {/* Other Skill Input */}
//           {showOtherSkillInput && (
//             <div className="mt-3 flex gap-2">
//               <Input
//                 placeholder="Enter other skill"
//                 value={otherSkillValue}
//                 onChange={(e) => setOtherSkillValue(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   if (otherSkillValue.trim()) {
//                     const current = currentPractical.skill_mapping || []
//                     handlePracticalChange(activePractical, "skill_mapping", [
//                       ...current,
//                       `Other: ${otherSkillValue.trim()}`,
//                     ])
//                     setOtherSkillValue("")
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//             </div>
//           )}

//           {/* Display selected skills */}
//           {(currentPractical.skill_mapping || []).length > 0 && (
//             <div className="mt-2">
//               <Label className="text-sm text-gray-500">Selected Skills:</Label>
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {(currentPractical.skill_mapping || []).map((skill: string, idx: number) => (
//                   <Badge key={`${skill}-${idx}`} variant="secondary" className="text-xs">
//                     {skill}
//                     <button
//                       onClick={() => {
//                         const updated = (currentPractical.skill_mapping || []).filter(
//                           (s: string, i: number) => i !== idx,
//                         )
//                         handlePracticalChange(activePractical, "skill_mapping", updated)
//                       }}
//                       className="ml-1 text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {skillMappingError && <p className="text-red-500 text-xs mt-1">{skillMappingError}</p>}
//         </div>

//         {/* Skill Objectives */}
//         <div>
//           <Label htmlFor="skill-objectives">
//             Skill Objectives <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="skill-objectives"
//             value={currentPractical.skill_objectives || ""}
//             onChange={(e) => handlePracticalChange(activePractical, "skill_objectives", e.target.value)}
//             placeholder="Enter skill objectives"
//             className="mt-1"
//             rows={3}
//           />
//           {skillObjectivesError && <p className="text-red-500 text-xs mt-1">{skillObjectivesError}</p>}
//         </div>
//       </div>

//       {/* Save Buttons */}
//       <div className="mt-8 flex justify-end space-x-4">
//         <Button variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
//           {isSavingDraft ? "Saving Draft..." : "Save Draft"}
//         </Button>
//         <Button onClick={handleSave} disabled={saving}>
//           {saving ? "Saving..." : "Save"}
//         </Button>
//       </div>

//       {/* Warning Dialog */}
//       <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Warning</DialogTitle>
//             <DialogDescription>{currentWarning}</DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button onClick={() => setWarningDialogOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Debug Info */}
//       {/* <div className="mt-8 p-4 border rounded-md bg-gray-50">
//         <h4 className="text-lg font-semibold mb-2">Debug Information</h4>
//         <p>
//           <strong>Term Start Date:</strong> {debugInfo.termStartDate}
//         </p>
//         <p>
//           <strong>Term End Date:</strong> {debugInfo.termEndDate}
//         </p>
//         <p>
//           <strong>Lesson Plan Start Date:</strong> {debugInfo.lessonPlanDates.start}
//         </p>
//         <p>
//           <strong>Lesson Plan End Date:</strong> {debugInfo.lessonPlanDates.end}
//         </p>
//         <p>
//           <strong>Metadata Start Date:</strong> {debugInfo.metadataDates.start}
//         </p>
//         <p>
//           <strong>Metadata End Date:</strong> {debugInfo.metadataDates.end}
//         </p>
//       </div> */}
//     </div>
//   )
// }
