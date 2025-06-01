// //@ts-nocheck
// "use client"

// import { DialogTrigger } from "@/components/ui/dialog"
// import { useState, useEffect, useMemo } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableHead, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { BookOpen, Edit, Plus, Trash, Users } from "lucide-react"
// import { fetchFaculty } from "@/app/dashboard/actions/fetchFaculty"
// import { fetchSubjects } from "@/app/dashboard/actions/fetchSubjects"
// import { Button } from "./ui/button"
// import type { User_Role, Subjects } from "@/types/types"
// import { HODDashboardSkeleton } from "./HODDashboardSkeleton"
// import { addFaculty, editFaculty, deleteFaculty } from "@/app/dashboard/actions/addFaculty"
// import { addSubject, deleteSubject } from "@/app/dashboard/actions/addSubject"
// import { fetchUsers } from "@/app/dashboard/actions/fetchUser"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
// import { toast } from "sonner"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import {type RoleDataItem} from "@/context/DashboardContext"

// type User = {
//   id: string
//   auth_id: string
//   name: string
//   email: string
//   profile_photo?: string
// }

// type PSOPEOItem = {
//   id: string
//   label: string
//   value: string
//   type: "PSO" | "PEO"
// }

// // Form schemas
// const addFacultySchema = z.object({
//   userId: z.string().uuid("Please select a valid faculty"),
//   departId: z.string(),
//   subjectId: z.string().optional(),
//   academicYear: z.string().min(4, "Please enter a valid academic year"),
//   division: z.enum(["Division 1", "Division 2", "Division 1 & Division 2"], {
//     required_error: "Please select a division",
//   }),
// })

// const editFacultySchema = z.object({
//   id: z.string().uuid(),
//   userId: z.string().uuid("Please select a valid faculty"),
//   departId: z.string(),
//   subjectId: z.string().optional(),
//   academicYear: z.string().min(4, "Please enter a valid academic year"),
//   division: z.enum(["Division 1", "Division 2", "Division 1 & Division 2"], {
//     required_error: "Please select a division",
//   }),
// })

// const addSubjectSchema = z.object({
//   code: z.string().min(3, "Code must be at least 3 characters"),
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   semester: z.coerce.number().int().min(1).max(8),
//   lectureHours: z.coerce.number().int().min(0),
//   labHours: z.coerce.number().int().min(0),
//   abbreviationName: z.string().min(2, "Abbreviation must be at least 2 characters"),
//   credits: z.coerce.number().int().min(1),
//   departmentId: z.string(),
//   isPractical: z.boolean(),
//   isTheory: z.boolean(),
// })

// export default function HODDashboard() {
//   const { roleData, currentRole, setCurrentRole } = useDashboardContext()
//   const [role, setRole] = useState<RoleDataItem>()
//   const [faculty, setFaculty] = useState<User_Role[]>([])
//   const [subjects, setSubjects] = useState<Subjects[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [facultyDialogOpen, setFacultyDialogOpen] = useState(false)
//   const [editFacultyDialogOpen, setEditFacultyDialogOpen] = useState(false)
//   const [subjectDialogOpen, setSubjectDialogOpen] = useState(false)
//   const [users, setUsers] = useState<User[]>([])
//   const [isAddingFaculty, setIsAddingFaculty] = useState(false)
//   const [isEditingFaculty, setIsEditingFaculty] = useState(false)
//   const [isAddingSubject, setIsAddingSubject] = useState(false)
//   const [selectedFaculty, setSelectedFaculty] = useState<User_Role | null>(null)
//   const [deleteFacultyDialogOpen, setDeleteFacultyDialogOpen] = useState(false)
//   const [deleteSubjectDialogOpen, setDeleteSubjectDialogOpen] = useState(false)
//   const [selectedSubject, setSelectedSubject] = useState<Subjects | null>(null)
//   const [isDeletingFaculty, setIsDeletingFaculty] = useState(false)
//   const [isDeletingSubject, setIsDeletingSubject] = useState(false)
//   const [showPsoPeoInDialog, setShowPsoPeoInDialog] = useState(false)
//   const [psoPeoDialogOpen, setPsoPeoDialogOpen] = useState(false)
//   const [psoItems, setPsoItems] = useState<PSOPEOItem[]>([
//     { id: "1", label: "PSO1", value: "", type: "PSO" },
//     { id: "2", label: "PSO2", value: "", type: "PSO" },
//   ])
//   const [peoItems, setPeoItems] = useState<PSOPEOItem[]>([
//     { id: "1", label: "PEO1", value: "", type: "PEO" },
//     { id: "2", label: "PEO2", value: "", type: "PEO" },
//   ])
//   const [middleString, setMiddleString] = useState("")

//   const facultyForm = useForm<z.infer<typeof addFacultySchema>>({
//     resolver: zodResolver(addFacultySchema),
//     defaultValues: {
//       departId: currentRole?.depart_id || "",
//       academicYear: new Date().getFullYear().toString(),
//       division: "Division 1 & Division 2",
//     },
//   })

//   const editFacultyForm = useForm<z.infer<typeof editFacultySchema>>({
//     resolver: zodResolver(editFacultySchema),
//     defaultValues: {
//       id: "",
//       departId: currentRole?.depart_id || "",
//       academicYear: new Date().getFullYear().toString(),
//       division: "Division 1 & Division 2",
//     },
//   })

//   const subjectForm = useForm<z.infer<typeof addSubjectSchema>>({
//     resolver: zodResolver(addSubjectSchema),
//     defaultValues: {
//       departmentId: currentRole?.depart_id || "",
//       semester: 1,
//       lectureHours: 0,
//       labHours: 0,
//       credits: 0,
//       isPractical: false,
//       isTheory: true,
//     },
//   })

//   const uniqueRoles = useMemo(() => {
//     const unique = new Map<string, RoleDataItem>()
//     roleData.forEach((role) => {
//       if (!unique.has(role.role_name)) {
//         unique.set(role.role_name, role)
//       }
//     })
//     return Array.from(unique.values())
//   }, [roleData])

//   const uniqueFaculty = useMemo(() => {
//     const facultyMap = new Map<string, User_Role & { subjectAbbreviations: string[] }>()

//     faculty.forEach((facultyMember) => {
//       const email = facultyMember.users?.email
//       if (email && !facultyMap.has(email)) {
//         facultyMap.set(email, {
//           ...facultyMember,
//           subjectAbbreviations: [] as string[],
//         })
//       }
//       const current = facultyMap.get(email || "")
//       if (current && facultyMember.subjects?.abbreviation_name) {
//         current.subjectAbbreviations.push(facultyMember.subjects.abbreviation_name)
//       }
//     })

//     return Array.from(facultyMap.values())
//   }, [faculty])
//   const { roleData, currentRole, setCurrentRole } = useDashboardContext()
//   const [role, setRole] = useState<RoleDataItem>()
//   const [faculty, setFaculty] = useState<User_Role[]>([])
//   const [subjects, setSubjects] = useState<Subjects[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [facultyDialogOpen, setFacultyDialogOpen] = useState(false)
//   const [editFacultyDialogOpen, setEditFacultyDialogOpen] = useState(false)
//   const [subjectDialogOpen, setSubjectDialogOpen] = useState(false)
//   const [users, setUsers] = useState<User[]>([])
//   const [isAddingFaculty, setIsAddingFaculty] = useState(false)
//   const [isEditingFaculty, setIsEditingFaculty] = useState(false)
//   const [isAddingSubject, setIsAddingSubject] = useState(false)
//   const [selectedFaculty, setSelectedFaculty] = useState<User_Role | null>(null)
//   const [deleteFacultyDialogOpen, setDeleteFacultyDialogOpen] = useState(false)
//   const [deleteSubjectDialogOpen, setDeleteSubjectDialogOpen] = useState(false)
//   const [selectedSubject, setSelectedSubject] = useState<Subjects | null>(null)
//   const [isDeletingFaculty, setIsDeletingFaculty] = useState(false)
//   const [isDeletingSubject, setIsDeletingSubject] = useState(false)
//   const [showPsoPeoInDialog, setShowPsoPeoInDialog] = useState(false)
//   const [psoPeoDialogOpen, setPsoPeoDialogOpen] = useState(false)
//   const [psoItems, setPsoItems] = useState<PSOPEOItem[]>([
//     { id: "1", label: "PSO1", value: "", type: "PSO" },
//     { id: "2", label: "PSO2", value: "", type: "PSO" },
//   ])
//   const [peoItems, setPeoItems] = useState<PSOPEOItem[]>([
//     { id: "1", label: "PEO1", value: "", type: "PEO" },
//     { id: "2", label: "PEO2", value: "", type: "PEO" },
//   ])
//   const [middleString, setMiddleString] = useState("")

//   const facultyForm = useForm<z.infer<typeof addFacultySchema>>({
//     resolver: zodResolver(addFacultySchema),
//     defaultValues: {
//       departId: currentRole?.depart_id || "",
//       academicYear: new Date().getFullYear().toString(),
//       division: "Division 1 & Division 2",
//     },
//   })

//   const editFacultyForm = useForm<z.infer<typeof editFacultySchema>>({
//     resolver: zodResolver(editFacultySchema),
//     defaultValues: {
//       id: "",
//       departId: currentRole?.depart_id || "",
//       academicYear: new Date().getFullYear().toString(),
//       division: "Division 1 & Division 2",
//     },
//   })

//   const subjectForm = useForm<z.infer<typeof addSubjectSchema>>({
//     resolver: zodResolver(addSubjectSchema),
//     defaultValues: {
//       departmentId: currentRole?.depart_id || "",
//       semester: 1,
//       lectureHours: 0,
//       labHours: 0,
//       credits: 0,
//       isPractical: false,
//       isTheory: true,
//     },
//   })

//   const uniqueRoles = useMemo(() => {
//     const unique = new Map<string, RoleDataItem>()
//     roleData.forEach((role) => {
//       if (!unique.has(role.role_name)) {
//         unique.set(role.role_name, role)
//       }
//     })
//     return Array.from(unique.values())
//   }, [roleData])

//   const uniqueFaculty = useMemo(() => {
//     const facultyMap = new Map<string, User_Role & { subjectAbbreviations: string[] }>()

//     faculty.forEach((facultyMember) => {
//       const email = facultyMember.users?.email
//       if (email && !facultyMap.has(email)) {
//         facultyMap.set(email, {
//           ...facultyMember,
//           subjectAbbreviations: [] as string[],
//         })
//       }
//       const current = facultyMap.get(email || "")
//       if (current && facultyMember.subjects?.abbreviation_name) {
//         current.subjectAbbreviations.push(facultyMember.subjects.abbreviation_name)
//       }
//     })

//     return Array.from(facultyMap.values())
//   }, [faculty])

//   const handleRoleChange = (roleName: string) => {
//     const selectedRole = roleData.find((role) => role.role_name === roleName)
//     const selectedRole = roleData.find((role) => role.role_name === roleName)
//     if (selectedRole) {
//       setCurrentRole(selectedRole)
//       setCurrentRole(selectedRole)
//     }
//   }
//   }

//   // PSO/PEO Management Functions
//   const addPsoItem = () => {
//     const newId = (psoItems.length + 1).toString()
//     const newLabel = `PSO${psoItems.length + 1}`
//     setPsoItems([...psoItems, { id: newId, label: newLabel, value: "", type: "PSO" }])
//   }

//   const addPeoItem = () => {
//     const newId = (peoItems.length + 1).toString()
//     const newLabel = `PEO${peoItems.length + 1}`
//     setPeoItems([...peoItems, { id: newId, label: newLabel, value: "", type: "PEO" }])
//   }

//   const updatePsoItem = (id: string, field: "label" | "value", newValue: string) => {
//     setPsoItems(psoItems.map((item) => (item.id === id ? { ...item, [field]: newValue } : item)))
//   }

//   const updatePeoItem = (id: string, field: "label" | "value", newValue: string) => {
//     setPeoItems(peoItems.map((item) => (item.id === id ? { ...item, [field]: newValue } : item)))
//   }

//   const deletePsoItem = (id: string) => {
//     if (psoItems.length > 1) {
//       setPsoItems(psoItems.filter((item) => item.id !== id))
//     }
//   }

//   const deletePeoItem = (id: string) => {
//     if (peoItems.length > 1) {
//       setPeoItems(peoItems.filter((item) => item.id !== id))
//     }
//   }

//   const handlePsoPeoSubmit = () => {
//     console.log("PSO Items:", psoItems)
//     console.log("PEO Items:", peoItems)
//     console.log("Middle String:", middleString)

//     toast("PSO/PEO data saved successfully")
//     setPsoPeoDialogOpen(false)
//     setShowPsoPeoInDialog(false)
//     setSubjectDialogOpen(false)

//     // Reset the form data
//     setPsoItems([
//       { id: "1", label: "PSO1", value: "", type: "PSO" },
//       { id: "2", label: "PSO2", value: "", type: "PSO" },
//     ])
//     setPeoItems([
//       { id: "1", label: "PEO1", value: "", type: "PEO" },
//       { id: "2", label: "PEO2", value: "", type: "PEO" },
//     ])
//     setMiddleString("")
//   }
//   // PSO/PEO Management Functions
//   const addPsoItem = () => {
//     const newId = (psoItems.length + 1).toString()
//     const newLabel = `PSO${psoItems.length + 1}`
//     setPsoItems([...psoItems, { id: newId, label: newLabel, value: "", type: "PSO" }])
//   }

//   const addPeoItem = () => {
//     const newId = (peoItems.length + 1).toString()
//     const newLabel = `PEO${peoItems.length + 1}`
//     setPeoItems([...peoItems, { id: newId, label: newLabel, value: "", type: "PEO" }])
//   }

//   const updatePsoItem = (id: string, field: "label" | "value", newValue: string) => {
//     setPsoItems(psoItems.map((item) => (item.id === id ? { ...item, [field]: newValue } : item)))
//   }

//   const updatePeoItem = (id: string, field: "label" | "value", newValue: string) => {
//     setPeoItems(peoItems.map((item) => (item.id === id ? { ...item, [field]: newValue } : item)))
//   }

//   const deletePsoItem = (id: string) => {
//     if (psoItems.length > 1) {
//       setPsoItems(psoItems.filter((item) => item.id !== id))
//     }
//   }

//   const deletePeoItem = (id: string) => {
//     if (peoItems.length > 1) {
//       setPeoItems(peoItems.filter((item) => item.id !== id))
//     }
//   }

//   const handlePsoPeoSubmit = () => {
//     console.log("PSO Items:", psoItems)
//     console.log("PEO Items:", peoItems)
//     console.log("Middle String:", middleString)

//     toast("PSO/PEO data saved successfully")
//     setPsoPeoDialogOpen(false)
//     setShowPsoPeoInDialog(false)
//     setSubjectDialogOpen(false)

//     // Reset the form data
//     setPsoItems([
//       { id: "1", label: "PSO1", value: "", type: "PSO" },
//       { id: "2", label: "PSO2", value: "", type: "PSO" },
//     ])
//     setPeoItems([
//       { id: "1", label: "PEO1", value: "", type: "PEO" },
//       { id: "2", label: "PEO2", value: "", type: "PEO" },
//     ])
//     setMiddleString("")
//   }

//   useEffect(() => {
//     const fetchUsersData = async () => {
//     const fetchUsersData = async () => {
//       try {
//         const result = await fetchUsers()
//         console.log("Fetched users result:", result)
//         // Fix: Extract userData from the result object
//         if (result && result.userData) {
//           setUsers(result.userData)
//         } else {
//           setUsers([])
//         }
//         const result = await fetchUsers()
//         console.log("Fetched users result:", result)
//         // Fix: Extract userData from the result object
//         if (result && result.userData) {
//           setUsers(result.userData)
//         } else {
//           setUsers([])
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error)
//         setUsers([])
//       }
//     }

//     if (facultyDialogOpen || editFacultyDialogOpen) {
//       fetchUsersData()
//     }
//   }, [facultyDialogOpen, editFacultyDialogOpen])

//   const onAddFacultySubmit = async (values: z.infer<typeof addFacultySchema>) => {
//     if (!currentRole?.depart_id) {
//       toast("Department ID is missing")
//       return
//     }

//     setIsAddingFaculty(true)
//     values.departId = currentRole.depart_id

//     const formData = new FormData()
//     Object.entries(values).forEach(([key, value]) => {
//       if (value !== undefined) {
//         formData.append(key, value.toString())
//       }
//     })

//     try {
//       const result = await addFaculty(formData)
//       if (result.success) {
//         toast("Faculty added successfully")
//         setFacultyDialogOpen(false)
//         facultyForm.reset({
//           departId: currentRole.depart_id,
//           academicYear: new Date().getFullYear().toString(),
//           division: "Division 1 & Division 2",
//         })

//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to add faculty")
//       }
//     } catch (error) {
//       console.error("Error adding faculty:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsAddingFaculty(false)
//     }
//   }

//   const onEditFacultySubmit = async (values: z.infer<typeof editFacultySchema>) => {
//     if (!currentRole?.depart_id) {
//       toast("Department ID is missing")
//       return
//     }

//     setIsEditingFaculty(true)
//     values.departId = currentRole.depart_id

//     const formData = new FormData()
//     Object.entries(values).forEach(([key, value]) => {
//       if (value !== undefined) {
//         formData.append(key, value.toString())
//       }
//     })

//     try {
//       const result = await editFaculty(formData)
//       if (result.success) {
//         toast("Faculty updated successfully")
//         setEditFacultyDialogOpen(false)
//         editFacultyForm.reset()

//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to update faculty")
//       }
//     } catch (error) {
//       console.error("Error updating faculty:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsEditingFaculty(false)
//     }
//   }

//   const handleEditFaculty = (faculty: User_Role) => {
//     console.log("Editing faculty:", faculty)
//     setSelectedFaculty(faculty)
//     editFacultyForm.reset({
//       id: faculty.id,
//       userId: faculty.users?.auth_id || "",
//       departId: faculty.depart_id,
//       subjectId: faculty.subjects?.id || "",
//       academicYear: faculty.academic_year || new Date().getFullYear().toString(),
//       division:
//         (faculty.division as "Division 1" | "Division 2" | "Division 1 & Division 2") || "Division 1 & Division 2",
//     })
//     setEditFacultyDialogOpen(true)
//   }

//   const handleDeleteFaculty = (faculty: User_Role) => {
//     setSelectedFaculty(faculty)
//     setDeleteFacultyDialogOpen(true)
//   }

//   const confirmDeleteFaculty = async () => {
//     if (!selectedFaculty) {
//       return
//     }

//     setIsDeletingFaculty(true)
//     try {
//       const result = await deleteFaculty(selectedFaculty.id)
//       if (result.success) {
//         toast("Faculty deleted successfully")
//         setDeleteFacultyDialogOpen(false)

//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to delete faculty")
//       }
//     } catch (error) {
//       console.error("Error deleting faculty:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsDeletingFaculty(false)
//     }
//   }

//   const handleDeleteSubject = (subject: Subjects) => {
//     setSelectedSubject(subject)
//     setDeleteSubjectDialogOpen(true)
//   }

//   const confirmDeleteSubject = async () => {
//     if (!selectedSubject) return

//     setIsDeletingSubject(true)
//     try {
//       const result = await deleteSubject(selectedSubject.id)
//       if (result.success) {
//         toast("Subject deleted successfully")
//         setDeleteSubjectDialogOpen(false)

//         // Refresh both subjects and faculty data since faculty assignments may have changed
//         const [subjectData, facultyData] = await Promise.all([fetchSubjects(), fetchFaculty()])

//         const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
//         setSubjects(departSubjects)

//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to delete subject")
//       }
//     } catch (error) {
//       console.error("Error deleting subject:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsDeletingSubject(false)
//     }
//   }

//   const onAddSubjectSubmit = async (values: z.infer<typeof addSubjectSchema>) => {
//     if (!currentRole?.depart_id) {
//       toast("Department ID is missing")
//       return
//     }

//     setIsAddingSubject(true)
//     values.departmentId = currentRole.depart_id

//     const formData = new FormData()
//     Object.entries(values).forEach(([key, value]) => {
//       formData.append(key, value.toString())
//     })

//     try {
//       const result = await addSubject(formData)
//       if (result.success) {
//         toast("Subject added successfully")
//         subjectForm.reset({
//           departmentId: currentRole.depart_id,
//           semester: 1,
//           lectureHours: 0,
//           labHours: 0,
//           credits: 0,
//           isPractical: false,
//           isTheory: true,
//         })

//         const subjectData = await fetchSubjects()
//         const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
//         setSubjects(departSubjects)

//         // Show PSO/PEO button in dialog after successful subject addition
//         setShowPsoPeoInDialog(true)
//       } else {
//         toast("Failed to add subject")
//       }
//     } catch (error) {
//       console.error("Error adding subject:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsAddingSubject(false)
//     }
//   }

//   useEffect(() => {
//     const foundRole = roleData.find((x) => x.role_name === currentRole?.role_name)
//     setRole(foundRole)
//   }, [roleData, currentRole])

//   useEffect(() => {
//     const loadData = async () => {
//       if (!currentRole?.depart_id) {
//         setIsLoading(false)
//         return
//       }

//       setIsLoading(true)
//       try {
//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)

//         const subjectData = await fetchSubjects()
//         const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
//         setSubjects(departSubjects)
//         console.error("Error fetching users:", error)
//         setUsers([])
//       }
//     }

//     if (facultyDialogOpen || editFacultyDialogOpen) {
//       fetchUsersData()
//     }
//   }, [facultyDialogOpen, editFacultyDialogOpen])

//   const onAddFacultySubmit = async (values: z.infer<typeof addFacultySchema>) => {
//     if (!currentRole?.depart_id) {
//       toast("Department ID is missing")
//       return
//     }

//     setIsAddingFaculty(true)
//     values.departId = currentRole.depart_id

//     const formData = new FormData()
//     Object.entries(values).forEach(([key, value]) => {
//       if (value !== undefined) {
//         formData.append(key, value.toString())
//       }
//     })

//     try {
//       const result = await addFaculty(formData)
//       if (result.success) {
//         toast("Faculty added successfully")
//         setFacultyDialogOpen(false)
//         facultyForm.reset({
//           departId: currentRole.depart_id,
//           academicYear: new Date().getFullYear().toString(),
//           division: "Division 1 & Division 2",
//         })

//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to add faculty")
//       }
//     } catch (error) {
//       console.error("Error adding faculty:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsAddingFaculty(false)
//     }
//   }

//   const onEditFacultySubmit = async (values: z.infer<typeof editFacultySchema>) => {
//     if (!currentRole?.depart_id) {
//       toast("Department ID is missing")
//       return
//     }

//     setIsEditingFaculty(true)
//     values.departId = currentRole.depart_id

//     const formData = new FormData()
//     Object.entries(values).forEach(([key, value]) => {
//       if (value !== undefined) {
//         formData.append(key, value.toString())
//       }
//     })

//     try {
//       const result = await editFaculty(formData)
//       if (result.success) {
//         toast("Faculty updated successfully")
//         setEditFacultyDialogOpen(false)
//         editFacultyForm.reset()

//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to update faculty")
//       }
//     } catch (error) {
//       console.error("Error updating faculty:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsEditingFaculty(false)
//     }
//   }

//   const handleEditFaculty = (faculty: User_Role) => {
//     console.log("Editing faculty:", faculty)
//     setSelectedFaculty(faculty)
//     editFacultyForm.reset({
//       id: faculty.id,
//       userId: faculty.users?.auth_id || "",
//       departId: faculty.depart_id,
//       subjectId: faculty.subjects?.id || "",
//       academicYear: faculty.academic_year || new Date().getFullYear().toString(),
//       division:
//         (faculty.division as "Division 1" | "Division 2" | "Division 1 & Division 2") || "Division 1 & Division 2",
//     })
//     setEditFacultyDialogOpen(true)
//   }

//   const handleDeleteFaculty = (faculty: User_Role) => {
//     setSelectedFaculty(faculty)
//     setDeleteFacultyDialogOpen(true)
//   }

//   const confirmDeleteFaculty = async () => {
//     if (!selectedFaculty) {
//       return
//     }

//     setIsDeletingFaculty(true)
//     try {
//       const result = await deleteFaculty(selectedFaculty.id)
//       if (result.success) {
//         toast("Faculty deleted successfully")
//         setDeleteFacultyDialogOpen(false)

//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to delete faculty")
//       }
//     } catch (error) {
//       console.error("Error deleting faculty:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsDeletingFaculty(false)
//     }
//   }

//   const handleDeleteSubject = (subject: Subjects) => {
//     setSelectedSubject(subject)
//     setDeleteSubjectDialogOpen(true)
//   }

//   const confirmDeleteSubject = async () => {
//     if (!selectedSubject) return

//     setIsDeletingSubject(true)
//     try {
//       const result = await deleteSubject(selectedSubject.id)
//       if (result.success) {
//         toast("Subject deleted successfully")
//         setDeleteSubjectDialogOpen(false)

//         // Refresh both subjects and faculty data since faculty assignments may have changed
//         const [subjectData, facultyData] = await Promise.all([fetchSubjects(), fetchFaculty()])

//         const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
//         setSubjects(departSubjects)

//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)
//       } else {
//         toast("Failed to delete subject")
//       }
//     } catch (error) {
//       console.error("Error deleting subject:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsDeletingSubject(false)
//     }
//   }

//   const onAddSubjectSubmit = async (values: z.infer<typeof addSubjectSchema>) => {
//     if (!currentRole?.depart_id) {
//       toast("Department ID is missing")
//       return
//     }

//     setIsAddingSubject(true)
//     values.departmentId = currentRole.depart_id

//     const formData = new FormData()
//     Object.entries(values).forEach(([key, value]) => {
//       formData.append(key, value.toString())
//     })

//     try {
//       const result = await addSubject(formData)
//       if (result.success) {
//         toast("Subject added successfully")
//         subjectForm.reset({
//           departmentId: currentRole.depart_id,
//           semester: 1,
//           lectureHours: 0,
//           labHours: 0,
//           credits: 0,
//           isPractical: false,
//           isTheory: true,
//         })

//         const subjectData = await fetchSubjects()
//         const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
//         setSubjects(departSubjects)

//         // Show PSO/PEO button in dialog after successful subject addition
//         setShowPsoPeoInDialog(true)
//       } else {
//         toast("Failed to add subject")
//       }
//     } catch (error) {
//       console.error("Error adding subject:", error)
//       toast("An unexpected error occurred")
//     } finally {
//       setIsAddingSubject(false)
//     }
//   }

//   useEffect(() => {
//     const foundRole = roleData.find((x) => x.role_name === currentRole?.role_name)
//     setRole(foundRole)
//   }, [roleData, currentRole])

//   useEffect(() => {
//     const loadData = async () => {
//       if (!currentRole?.depart_id) {
//         setIsLoading(false)
//         return
//       }

//       setIsLoading(true)
//       try {
//         const facultyData = await fetchFaculty()
//         const departFaculty = facultyData.filter(
//           (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
//         )
//         setFaculty(departFaculty)

//         const subjectData = await fetchSubjects()
//         const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
//         setSubjects(departSubjects)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadData()
//   }, [currentRole?.depart_id])

//   // Update form defaults when currentRole changes
//   useEffect(() => {
//     if (currentRole?.depart_id) {
//       facultyForm.setValue("departId", currentRole.depart_id)
//       editFacultyForm.setValue("departId", currentRole.depart_id)
//       subjectForm.setValue("departmentId", currentRole.depart_id)
//     }
//   }, [currentRole?.depart_id, facultyForm, editFacultyForm, subjectForm])

//   if (isLoading) {
//     return <HODDashboardSkeleton />
//   }

//   if (!currentRole) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-lg text-gray-500">No role selected</p>
//       </div>
//     )
//   } else {
//   }
//         console.error("Error fetching data:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadData()
//   }, [currentRole?.depart_id])

//   // Update form defaults when currentRole changes
//   useEffect(() => {
//     if (currentRole?.depart_id) {
//       facultyForm.setValue("departId", currentRole.depart_id)
//       editFacultyForm.setValue("departId", currentRole.depart_id)
//       subjectForm.setValue("departmentId", currentRole.depart_id)
//     }
//   }, [currentRole?.depart_id, facultyForm, editFacultyForm, subjectForm])

//   if (isLoading) {
//     return <HODDashboardSkeleton />
//   }

//   if (!currentRole) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-lg text-gray-500">No role selected</p>
//       </div>
//     )
//   } else {
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
//           {currentRole.role_name} Dashboard
//         </p>
//         <div>
//           <Select onValueChange={handleRoleChange} value={currentRole.role_name}>
//           <Select onValueChange={handleRoleChange} value={currentRole.role_name}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder={currentRole.role_name} />
//             </SelectTrigger>
//             <SelectContent>
//               {uniqueRoles.map((role, idx) => (
//               {uniqueRoles.map((role, idx) => (
//                 <SelectItem value={role.role_name} key={idx}>
//                   {role.role_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div>
//         {currentRole.role_name === "HOD" ? (
//           <div>
//             <div className="flex flex-col justify-around pl-5 py-2 bg-[#EBF5FF] h-[77px] rounded-[10px] border border-gray-400 mt-3">
//               <p className="text-[#1A5CA1] font-manrope font-bold text-[20px] leading-[100%] tracking-[0em]">
//                 {currentRole.departments?.institutes?.name || "Institute Name"}
//               </p>
//               <p className="text-[#1A5CA1] font-manrope font-bold text-[20px] leading-[100%] tracking-[0em]">
//                 {currentRole.departments?.institutes?.name || "Institute Name"}
//               </p>
//               <h2 className="font-manrope font-medium text-[18px] leading-[100%] tracking-[0em]">
//                 {currentRole.departments?.name || "Department Name"}
//                 {currentRole.departments?.name || "Department Name"}
//               </h2>
//             </div>

//             <div className="grid grid-cols-5 gap-5 mt-3">
//               <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
//                 <div className="flex flex-col justify-between h-14">
//                   <h3 className="font-manrope font-semibold text-[17px] leading-[100%] tracking-[0em]">
//                     Total Faculty
//                   </h3>
//                   <p className="font-manrope font-bold text-[30px] leading-[100%] tracking-[0em] text-[#1A5CA1]">
//                     {uniqueFaculty.length}
//                     {uniqueFaculty.length}
//                   </p>
//                 </div>
//                 <Users className="size-11" />
//               </div>
//               <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
//                 <div className="flex flex-col justify-between h-14">
//                   <h3 className="font-manrope font-semibold text-[16px] leading-[100%] tracking-[0em]">
//                     Total Subjects
//                   </h3>
//                   <p className="font-manrope font-bold text-[30px] leading-[100%] tracking-[0em] text-[#1A5CA1]">
//                     {subjects.length}
//                   </p>
//                 </div>
//                 <BookOpen className="size-11" />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mt-3">
//               <div className="border rounded-lg border-black p-3">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">
//                     Faculty Management
//                   </h2>
//                   <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
//                     <DialogTrigger asChild>
//                       <Button>
//                         <div className="flex items-center gap-2">
//                           <Plus />
//                           <p>Add Faculty</p>
//                         </div>
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="sm:max-w-[500px]">
//                       <DialogHeader>
//                         <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//                           Add New Faculty
//                         </DialogTitle>
//                       </DialogHeader>
//                       <Form {...facultyForm}>
//                         <form onSubmit={facultyForm.handleSubmit(onAddFacultySubmit)} className="space-y-4">
//                           <div className="flex gap-x-4">
//                             <FormField
//                               control={facultyForm.control}
//                               name="userId"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Faculty</FormLabel>
//                                   <Select onValueChange={field.onChange} value={field.value}>
//                                     <FormControl>
//                                       <SelectTrigger className="w-[200px]">
//                                         <SelectValue placeholder="Select Faculty" />
//                                       </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                       {users.map((user) => (
//                                         <SelectItem className="cursor-pointer" key={user.auth_id} value={user.auth_id}>
//                                           {user.name}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={facultyForm.control}
//                               name="subjectId"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Subject</FormLabel>
//                                   <Select onValueChange={field.onChange} value={field.value}>
//                                     <FormControl>
//                                       <SelectTrigger className="w-[230px]">
//                                         <SelectValue placeholder="Select Subject" />
//                                       </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                       {subjects.map((subject) => (
//                                         <SelectItem className="cursor-pointer" key={subject.id} value={subject.id}>
//                                           {subject.name} ({subject.abbreviation_name})
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>

//                           <FormField
//                             control={facultyForm.control}
//                             name="academicYear"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Academic Year</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={facultyForm.control}
//                             name="division"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Division</FormLabel>
//                                 <Select onValueChange={field.onChange} value={field.value}>
//                                   <FormControl>
//                                     <SelectTrigger className="w-[230px]">
//                                       <SelectValue placeholder="Select division" />
//                                     </SelectTrigger>
//                                   </FormControl>
//                                   <SelectContent>
//                                     <SelectItem className="cursor-pointer" value="Division 1">
//                                       Division 1
//                                     </SelectItem>
//                                     <SelectItem className="cursor-pointer" value="Division 2">
//                                       Division 2
//                                     </SelectItem>
//                                     <SelectItem className="cursor-pointer" value="Division 1 & Division 2">
//                                       Division 1 & Division 2
//                                     </SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <DialogFooter>
//                             <div className="flex justify-between w-full">
//                               <Button type="button" variant="outline" onClick={() => setFacultyDialogOpen(false)}>
//                                 Cancel
//                               </Button>
//                               <Button type="submit" disabled={isAddingFaculty}>
//                                 {isAddingFaculty ? "Adding..." : "Add Faculty"}
//                               </Button>
//                             </div>
//                           </DialogFooter>
//                         </form>
//                       </Form>
//                     </DialogContent>
//                   </Dialog>
//                   <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
//                     <DialogTrigger asChild>
//                       <Button>
//                         <div className="flex items-center gap-2">
//                           <Plus />
//                           <p>Add Faculty</p>
//                         </div>
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="sm:max-w-[500px]">
//                       <DialogHeader>
//                         <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//                           Add New Faculty
//                         </DialogTitle>
//                       </DialogHeader>
//                       <Form {...facultyForm}>
//                         <form onSubmit={facultyForm.handleSubmit(onAddFacultySubmit)} className="space-y-4">
//                           <div className="flex gap-x-4">
//                             <FormField
//                               control={facultyForm.control}
//                               name="userId"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Faculty</FormLabel>
//                                   <Select onValueChange={field.onChange} value={field.value}>
//                                     <FormControl>
//                                       <SelectTrigger className="w-[200px]">
//                                         <SelectValue placeholder="Select Faculty" />
//                                       </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                       {users.map((user) => (
//                                         <SelectItem className="cursor-pointer" key={user.auth_id} value={user.auth_id}>
//                                           {user.name}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={facultyForm.control}
//                               name="subjectId"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Subject</FormLabel>
//                                   <Select onValueChange={field.onChange} value={field.value}>
//                                     <FormControl>
//                                       <SelectTrigger className="w-[230px]">
//                                         <SelectValue placeholder="Select Subject" />
//                                       </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                       {subjects.map((subject) => (
//                                         <SelectItem className="cursor-pointer" key={subject.id} value={subject.id}>
//                                           {subject.name} ({subject.abbreviation_name})
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>

//                           <FormField
//                             control={facultyForm.control}
//                             name="academicYear"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Academic Year</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={facultyForm.control}
//                             name="division"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Division</FormLabel>
//                                 <Select onValueChange={field.onChange} value={field.value}>
//                                   <FormControl>
//                                     <SelectTrigger className="w-[230px]">
//                                       <SelectValue placeholder="Select division" />
//                                     </SelectTrigger>
//                                   </FormControl>
//                                   <SelectContent>
//                                     <SelectItem className="cursor-pointer" value="Division 1">
//                                       Division 1
//                                     </SelectItem>
//                                     <SelectItem className="cursor-pointer" value="Division 2">
//                                       Division 2
//                                     </SelectItem>
//                                     <SelectItem className="cursor-pointer" value="Division 1 & Division 2">
//                                       Division 1 & Division 2
//                                     </SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <DialogFooter>
//                             <div className="flex justify-between w-full">
//                               <Button type="button" variant="outline" onClick={() => setFacultyDialogOpen(false)}>
//                                 Cancel
//                               </Button>
//                               <Button type="submit" disabled={isAddingFaculty}>
//                                 {isAddingFaculty ? "Adding..." : "Add Faculty"}
//                               </Button>
//                             </div>
//                           </DialogFooter>
//                         </form>
//                       </Form>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//                 <hr className="border-1 border-black mt-3" />
//                 <div className="mt-3">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="w-[28%]">Name</TableHead>
//                         <TableHead className="w-[45%]">Email</TableHead>
//                         <TableHead className="w-[19%]">Subjects</TableHead>
//                         <TableHead className="w-[10%]">Action</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {uniqueFaculty.length > 0 ? (
//                         uniqueFaculty.map((facultyMember) => (
//                           <TableRow key={facultyMember.id}>
//                             <TableCell className="font-medium">{facultyMember.users?.name || "N/A"}</TableCell>
//                             <TableCell>{facultyMember.users?.email || "N/A"}</TableCell>
//                             <TableCell>{facultyMember.subjectAbbreviations.join(", ") || "No subjects"}</TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-2">
//                                 <Button
//                                   className="bg-green-600 hover:bg-green-700"
//                                   onClick={() => handleEditFaculty(facultyMember)}
//                                 >
//                                   <Edit />
//                                 </Button>
//                                 <Button
//                                   className="bg-red-600 hover:bg-red-700"
//                                   onClick={() => handleDeleteFaculty(facultyMember)}
//                                 >
//                                   <Trash />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={4} className="text-center py-4">
//                             No faculty members found
//                       {uniqueFaculty.length > 0 ? (
//                         uniqueFaculty.map((facultyMember) => (
//                           <TableRow key={facultyMember.id}>
//                             <TableCell className="font-medium">{facultyMember.users?.name || "N/A"}</TableCell>
//                             <TableCell>{facultyMember.users?.email || "N/A"}</TableCell>
//                             <TableCell>{facultyMember.subjectAbbreviations.join(", ") || "No subjects"}</TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-2">
//                                 <Button
//                                   className="bg-green-600 hover:bg-green-700"
//                                   onClick={() => handleEditFaculty(facultyMember)}
//                                 >
//                                   <Edit />
//                                 </Button>
//                                 <Button
//                                   className="bg-red-600 hover:bg-red-700"
//                                   onClick={() => handleDeleteFaculty(facultyMember)}
//                                 >
//                                   <Trash />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={4} className="text-center py-4">
//                             No faculty members found
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>

//               <div className="border rounded-lg border-black p-3">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">
//                     Subject Details
//                   </h2>
//                   <div className="flex gap-2">
//                     <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
//                       <DialogTrigger asChild>
//                         <Button>
//                           <div className="flex items-center gap-2">
//                             <Plus />
//                             <p>Add Subject</p>
//                           </div>
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-[500px]">
//                         <DialogHeader>
//                           <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//                             Add New Subject
//                           </DialogTitle>
//                         </DialogHeader>
//                         <Form {...subjectForm}>
//                           <form onSubmit={subjectForm.handleSubmit(onAddSubjectSubmit)} className="space-y-4">
//                             <FormField
//                               control={subjectForm.control}
//                               name="code"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Subject Code</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} placeholder="CSE401" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={subjectForm.control}
//                               name="name"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Subject Name</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} placeholder="Data Communication and Networking" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={subjectForm.control}
//                               name="abbreviationName"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Abbreviation</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} placeholder="DCN" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <div className="grid grid-cols-2 gap-4">
//                               <FormField
//                                 control={subjectForm.control}
//                                 name="semester"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Semester</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={1} max={8} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={subjectForm.control}
//                                 name="credits"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Credits</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={1} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                               <FormField
//                                 control={subjectForm.control}
//                                 name="lectureHours"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Lecture Hours</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={0} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={subjectForm.control}
//                                 name="labHours"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Lab Hours</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={0} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="flex space-x-4 pt-1 pb-3">
//                               <FormField
//                                 control={subjectForm.control}
//                                 name="isTheory"
//                                 render={({ field }) => (
//                                   <FormItem className="flex flex-row items-start">
//                                     <FormControl>
//                                       <Checkbox
//                                         className="cursor-pointer"
//                                         checked={field.value}
//                                         onCheckedChange={field.onChange}
//                                       />
//                                     </FormControl>
//                                     <div className="space-y-1 leading-none cursor-pointer">
//                                       <FormLabel className="cursor-pointer">Theory Subject</FormLabel>
//                                     </div>
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={subjectForm.control}
//                                 name="isPractical"
//                                 render={({ field }) => (
//                                   <FormItem className="flex flex-row items-start">
//                                     <FormControl>
//                                       <Checkbox
//                                         className="cursor-pointer"
//                                         checked={field.value}
//                                         onCheckedChange={field.onChange}
//                                       />
//                                     </FormControl>
//                                     <div className="space-y-1 leading-none cursor-pointer">
//                                       <FormLabel className="cursor-pointer">Practical Subject</FormLabel>
//                                     </div>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <DialogFooter>
//                               <div className="flex justify-between w-full">
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   onClick={() => {
//                                     setSubjectDialogOpen(false)
//                                     setShowPsoPeoInDialog(false)
//                                   }}
//                                 >
//                                   Cancel
//                                 </Button>
//                                 {!showPsoPeoInDialog ? (
//                                   <Button type="submit" disabled={isAddingSubject}>
//                                     {isAddingSubject ? "Adding..." : "Add Subject"}
//                                   </Button>
//                                 ) : (
//                                   <Button type="button" onClick={() => setPsoPeoDialogOpen(true)}>
//                                     Add PSO/PEO
//                                   </Button>
//                                 )}
//                               </div>
//                             </DialogFooter>
//                           </form>
//                         </Form>
//                       </DialogContent>
//                     </Dialog>

//                     {/* PSO/PEO Dialog */}
//                     <Dialog open={psoPeoDialogOpen} onOpenChange={setPsoPeoDialogOpen}>
//                       <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//                         <DialogHeader>
//                           <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//                             Add PSO/PEO
//                           </DialogTitle>
//                         </DialogHeader>

//                         <div className="space-y-6">
//                           {/* PSO Section */}
//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-lg font-semibold">Program Specific Outcome</h3>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={addPsoItem}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Plus className="w-4 h-4" />
//                               </Button>
//                             </div>

//                             {psoItems.map((item) => (
//                               <div key={item.id} className="flex items-center gap-2">
//                                 <Input
//                                   value={item.label}
//                                   onChange={(e) => updatePsoItem(item.id, "label", e.target.value)}
//                                   className="w-20"
//                                   placeholder="PSO1"
//                                 />
//                                 <Input
//                                   value={item.value}
//                                   onChange={(e) => updatePsoItem(item.id, "value", e.target.value)}
//                                   className="flex-1"
//                                   placeholder="Enter PSO description"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => deletePsoItem(item.id)}
//                                   disabled={psoItems.length <= 1}
//                                   className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
//                                 >
//                                   <Trash className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>

//                           {/* PEO Section */}
//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-lg font-semibold">Program Educational Objective</h3>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={addPeoItem}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Plus className="w-4 h-4" />
//                               </Button>
//                             </div>

//                             {peoItems.map((item) => (
//                               <div key={item.id} className="flex items-center gap-2">
//                                 <Input
//                                   value={item.label}
//                                   onChange={(e) => updatePeoItem(item.id, "label", e.target.value)}
//                                   className="w-20"
//                                   placeholder="PEO1"
//                                 />
//                                 <Input
//                                   value={item.value}
//                                   onChange={(e) => updatePeoItem(item.id, "value", e.target.value)}
//                                   className="flex-1"
//                                   placeholder="Enter PEO description"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => deletePeoItem(item.id)}
//                                   disabled={peoItems.length <= 1}
//                                   className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
//                                 >
//                                   <Trash className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         <DialogFooter className="mt-6">
//                           <div className="flex justify-between w-full">
//                             <Button type="button" variant="outline" onClick={() => setPsoPeoDialogOpen(false)}>
//                               Back to Subject
//                             </Button>
//                             <Button type="button" onClick={handlePsoPeoSubmit}>
//                               Submit PSO/PEO
//                             </Button>
//                           </div>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </div>
//                 <hr className="border-1 border-black mt-3" />
//                 <div className="mt-3">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="w-[55%]">Name</TableHead>
//                         <TableHead className="w-[15%]">Code</TableHead>
//                         <TableHead className="w-[16%]">Semester</TableHead>
//                         <TableHead className="w-[48%]">Abbreviation</TableHead>
//                         <TableHead className="w-[10%]">Action</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {subjects.length > 0 ? (
//                         subjects.map((subject) => (
//                           <TableRow key={subject.id}>
//                             <TableCell className="font-medium">{subject.name}</TableCell>
//                             <TableCell>{subject.code}</TableCell>
//                             <TableCell>{subject.semester}</TableCell>
//                             <TableCell>{subject.abbreviation_name}</TableCell>
//                             <TableCell>
//                               <Button
//                                 className="bg-red-600 hover:bg-red-700"
//                                 onClick={() => handleDeleteSubject(subject)}
//                               >
//                                 <Trash />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={5} className="text-center py-4">
//                             No subjects found
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>

//               <div className="border rounded-lg border-black p-3">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">
//                     Subject Details
//                   </h2>
//                   <div className="flex gap-2">
//                     <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
//                       <DialogTrigger asChild>
//                         <Button>
//                           <div className="flex items-center gap-2">
//                             <Plus />
//                             <p>Add Subject</p>
//                           </div>
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-[500px]">
//                         <DialogHeader>
//                           <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//                             Add New Subject
//                           </DialogTitle>
//                         </DialogHeader>
//                         <Form {...subjectForm}>
//                           <form onSubmit={subjectForm.handleSubmit(onAddSubjectSubmit)} className="space-y-4">
//                             <FormField
//                               control={subjectForm.control}
//                               name="code"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Subject Code</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} placeholder="CSE401" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={subjectForm.control}
//                               name="name"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Subject Name</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} placeholder="Data Communication and Networking" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={subjectForm.control}
//                               name="abbreviationName"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Abbreviation</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} placeholder="DCN" />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <div className="grid grid-cols-2 gap-4">
//                               <FormField
//                                 control={subjectForm.control}
//                                 name="semester"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Semester</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={1} max={8} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={subjectForm.control}
//                                 name="credits"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Credits</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={1} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                               <FormField
//                                 control={subjectForm.control}
//                                 name="lectureHours"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Lecture Hours</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={0} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={subjectForm.control}
//                                 name="labHours"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Lab Hours</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" {...field} min={0} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="flex space-x-4 pt-1 pb-3">
//                               <FormField
//                                 control={subjectForm.control}
//                                 name="isTheory"
//                                 render={({ field }) => (
//                                   <FormItem className="flex flex-row items-start">
//                                     <FormControl>
//                                       <Checkbox
//                                         className="cursor-pointer"
//                                         checked={field.value}
//                                         onCheckedChange={field.onChange}
//                                       />
//                                     </FormControl>
//                                     <div className="space-y-1 leading-none cursor-pointer">
//                                       <FormLabel className="cursor-pointer">Theory Subject</FormLabel>
//                                     </div>
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={subjectForm.control}
//                                 name="isPractical"
//                                 render={({ field }) => (
//                                   <FormItem className="flex flex-row items-start">
//                                     <FormControl>
//                                       <Checkbox
//                                         className="cursor-pointer"
//                                         checked={field.value}
//                                         onCheckedChange={field.onChange}
//                                       />
//                                     </FormControl>
//                                     <div className="space-y-1 leading-none cursor-pointer">
//                                       <FormLabel className="cursor-pointer">Practical Subject</FormLabel>
//                                     </div>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <DialogFooter>
//                               <div className="flex justify-between w-full">
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   onClick={() => {
//                                     setSubjectDialogOpen(false)
//                                     setShowPsoPeoInDialog(false)
//                                   }}
//                                 >
//                                   Cancel
//                                 </Button>
//                                 {!showPsoPeoInDialog ? (
//                                   <Button type="submit" disabled={isAddingSubject}>
//                                     {isAddingSubject ? "Adding..." : "Add Subject"}
//                                   </Button>
//                                 ) : (
//                                   <Button type="button" onClick={() => setPsoPeoDialogOpen(true)}>
//                                     Add PSO/PEO
//                                   </Button>
//                                 )}
//                               </div>
//                             </DialogFooter>
//                           </form>
//                         </Form>
//                       </DialogContent>
//                     </Dialog>

//                     {/* PSO/PEO Dialog */}
//                     <Dialog open={psoPeoDialogOpen} onOpenChange={setPsoPeoDialogOpen}>
//                       <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//                         <DialogHeader>
//                           <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//                             Add PSO/PEO
//                           </DialogTitle>
//                         </DialogHeader>

//                         <div className="space-y-6">
//                           {/* PSO Section */}
//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-lg font-semibold">Program Specific Outcome</h3>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={addPsoItem}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Plus className="w-4 h-4" />
//                               </Button>
//                             </div>

//                             {psoItems.map((item) => (
//                               <div key={item.id} className="flex items-center gap-2">
//                                 <Input
//                                   value={item.label}
//                                   onChange={(e) => updatePsoItem(item.id, "label", e.target.value)}
//                                   className="w-20"
//                                   placeholder="PSO1"
//                                 />
//                                 <Input
//                                   value={item.value}
//                                   onChange={(e) => updatePsoItem(item.id, "value", e.target.value)}
//                                   className="flex-1"
//                                   placeholder="Enter PSO description"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => deletePsoItem(item.id)}
//                                   disabled={psoItems.length <= 1}
//                                   className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
//                                 >
//                                   <Trash className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>

//                           {/* PEO Section */}
//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-lg font-semibold">Program Educational Objective</h3>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={addPeoItem}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Plus className="w-4 h-4" />
//                               </Button>
//                             </div>

//                             {peoItems.map((item) => (
//                               <div key={item.id} className="flex items-center gap-2">
//                                 <Input
//                                   value={item.label}
//                                   onChange={(e) => updatePeoItem(item.id, "label", e.target.value)}
//                                   className="w-20"
//                                   placeholder="PEO1"
//                                 />
//                                 <Input
//                                   value={item.value}
//                                   onChange={(e) => updatePeoItem(item.id, "value", e.target.value)}
//                                   className="flex-1"
//                                   placeholder="Enter PEO description"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => deletePeoItem(item.id)}
//                                   disabled={peoItems.length <= 1}
//                                   className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
//                                 >
//                                   <Trash className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         <DialogFooter className="mt-6">
//                           <div className="flex justify-between w-full">
//                             <Button type="button" variant="outline" onClick={() => setPsoPeoDialogOpen(false)}>
//                               Back to Subject
//                             </Button>
//                             <Button type="button" onClick={handlePsoPeoSubmit}>
//                               Submit PSO/PEO
//                             </Button>
//                           </div>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </div>
//                 <hr className="border-1 border-black mt-3" />
//                 <div className="mt-3">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="w-[55%]">Name</TableHead>
//                         <TableHead className="w-[15%]">Code</TableHead>
//                         <TableHead className="w-[16%]">Semester</TableHead>
//                         <TableHead className="w-[48%]">Abbreviation</TableHead>
//                         <TableHead className="w-[10%]">Action</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {subjects.length > 0 ? (
//                         subjects.map((subject) => (
//                           <TableRow key={subject.id}>
//                             <TableCell className="font-medium">{subject.name}</TableCell>
//                             <TableCell>{subject.code}</TableCell>
//                             <TableCell>{subject.semester}</TableCell>
//                             <TableCell>{subject.abbreviation_name}</TableCell>
//                             <TableCell>
//                               <Button
//                                 className="bg-red-600 hover:bg-red-700"
//                                 onClick={() => handleDeleteSubject(subject)}
//                               >
//                                 <Trash />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={5} className="text-center py-4">
//                             No subjects found
//                           </TableCell>
//                         </TableRow>
//                       )}
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div>{JSON.stringify(role)}</div>
//         )}
//       </div>

//       {/* Edit Faculty Dialog */}
//       <Dialog open={editFacultyDialogOpen} onOpenChange={setEditFacultyDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//               Edit Faculty
//             </DialogTitle>
//           </DialogHeader>
//           <Form {...editFacultyForm}>
//             <form onSubmit={editFacultyForm.handleSubmit(onEditFacultySubmit)} className="space-y-4">
//               <FormField
//                 control={editFacultyForm.control}
//                 name="id"
//                 render={({ field }) => (
//                   <FormItem className="hidden">
//                     <FormControl>
//                       <Input {...field} type="hidden" />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <div className="flex gap-x-4">
//                 <FormField
//                   control={editFacultyForm.control}
//                   name="userId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Faculty</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-[200px]">
//                             <SelectValue placeholder="Select Faculty" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {users.map((user) => (
//                             <SelectItem className="cursor-pointer" key={user.auth_id} value={user.auth_id}>
//                               {user.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={editFacultyForm.control}
//                   name="subjectId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Subject</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-[230px]">
//                             <SelectValue placeholder="Select Subject" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {subjects.map((subject) => (
//                             <SelectItem className="cursor-pointer" key={subject.id} value={subject.id}>
//                               {subject.name} ({subject.abbreviation_name})
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={editFacultyForm.control}
//                 name="academicYear"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Academic Year</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={editFacultyForm.control}
//                 name="division"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Division</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="w-[230px]">
//                           <SelectValue placeholder="Select division" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="cursor-pointer" value="Division 1">
//                           Division 1
//                         </SelectItem>
//                         <SelectItem className="cursor-pointer" value="Division 2">
//                           Division 2
//                         </SelectItem>
//                         <SelectItem className="cursor-pointer" value="Division 1 & Division 2">
//                           Division 1 & Division 2
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <DialogFooter>
//                 <div className="flex justify-between w-full">
//                   <Button type="button" variant="outline" onClick={() => setEditFacultyDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={isEditingFaculty}>
//                     {isEditingFaculty ? "Updating..." : "Update Faculty"}
//                   </Button>
//                 </div>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Faculty Confirmation Dialog */}
//       <AlertDialog open={deleteFacultyDialogOpen} onOpenChange={setDeleteFacultyDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 font-manrope font-bold text-[23px] leading-[25px]">
//               Delete Faculty
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-black">
//               Are you sure you want to delete <b>{selectedFaculty?.users?.name}</b>? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <div className="flex justify-between w-full">
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={confirmDeleteFaculty}
//                 disabled={isDeletingFaculty}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 {isDeletingFaculty ? "Deleting..." : "Delete"}
//               </AlertDialogAction>
//             </div>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Delete Subject Confirmation Dialog */}
//       <AlertDialog open={deleteSubjectDialogOpen} onOpenChange={setDeleteSubjectDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 font-manrope font-bold text-[23px] leading-[25px]">
//               Delete Subject
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-black">
//               Are you sure you want to delete <b>{selectedSubject?.name}</b>? This action cannot be undone.
//               <br />
//               <br />
//               <strong>Note:</strong> Any faculty assigned to this subject will have their assignment removed.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <div className="flex justify-between w-full">
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={confirmDeleteSubject}
//                 disabled={isDeletingSubject}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 {isDeletingSubject ? "Deleting..." : "Delete"}
//               </AlertDialogAction>
//             </div>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Edit Faculty Dialog */}
//       <Dialog open={editFacultyDialogOpen} onOpenChange={setEditFacultyDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
//               Edit Faculty
//             </DialogTitle>
//           </DialogHeader>
//           <Form {...editFacultyForm}>
//             <form onSubmit={editFacultyForm.handleSubmit(onEditFacultySubmit)} className="space-y-4">
//               <FormField
//                 control={editFacultyForm.control}
//                 name="id"
//                 render={({ field }) => (
//                   <FormItem className="hidden">
//                     <FormControl>
//                       <Input {...field} type="hidden" />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <div className="flex gap-x-4">
//                 <FormField
//                   control={editFacultyForm.control}
//                   name="userId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Faculty</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-[200px]">
//                             <SelectValue placeholder="Select Faculty" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {users.map((user) => (
//                             <SelectItem className="cursor-pointer" key={user.auth_id} value={user.auth_id}>
//                               {user.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={editFacultyForm.control}
//                   name="subjectId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Subject</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-[230px]">
//                             <SelectValue placeholder="Select Subject" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {subjects.map((subject) => (
//                             <SelectItem className="cursor-pointer" key={subject.id} value={subject.id}>
//                               {subject.name} ({subject.abbreviation_name})
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={editFacultyForm.control}
//                 name="academicYear"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Academic Year</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={editFacultyForm.control}
//                 name="division"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Division</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="w-[230px]">
//                           <SelectValue placeholder="Select division" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="cursor-pointer" value="Division 1">
//                           Division 1
//                         </SelectItem>
//                         <SelectItem className="cursor-pointer" value="Division 2">
//                           Division 2
//                         </SelectItem>
//                         <SelectItem className="cursor-pointer" value="Division 1 & Division 2">
//                           Division 1 & Division 2
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <DialogFooter>
//                 <div className="flex justify-between w-full">
//                   <Button type="button" variant="outline" onClick={() => setEditFacultyDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={isEditingFaculty}>
//                     {isEditingFaculty ? "Updating..." : "Update Faculty"}
//                   </Button>
//                 </div>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Faculty Confirmation Dialog */}
//       <AlertDialog open={deleteFacultyDialogOpen} onOpenChange={setDeleteFacultyDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 font-manrope font-bold text-[23px] leading-[25px]">
//               Delete Faculty
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-black">
//               Are you sure you want to delete <b>{selectedFaculty?.users?.name}</b>? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <div className="flex justify-between w-full">
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={confirmDeleteFaculty}
//                 disabled={isDeletingFaculty}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 {isDeletingFaculty ? "Deleting..." : "Delete"}
//               </AlertDialogAction>
//             </div>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Delete Subject Confirmation Dialog */}
//       <AlertDialog open={deleteSubjectDialogOpen} onOpenChange={setDeleteSubjectDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-600 font-manrope font-bold text-[23px] leading-[25px]">
//               Delete Subject
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-black">
//               Are you sure you want to delete <b>{selectedSubject?.name}</b>? This action cannot be undone.
//               <br />
//               <br />
//               <strong>Note:</strong> Any faculty assigned to this subject will have their assignment removed.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <div className="flex justify-between w-full">
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={confirmDeleteSubject}
//                 disabled={isDeletingSubject}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 {isDeletingSubject ? "Deleting..." : "Delete"}
//               </AlertDialogAction>
//             </div>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
//   )
// }
"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHead, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { useDashboardContext } from "@/context/DashboardContext"
import { BookOpen, Edit, Plus, Trash, Users } from "lucide-react"
import { fetchFaculty } from "@/app/dashboard/actions/fetchFaculty"
import { fetchSubjects } from "@/app/dashboard/actions/fetchSubjects"
import { Button } from "./ui/button"
import type { User_Role, Subjects } from "@/types/types"
import { HODDashboardSkeleton } from "./HODDashboardSkeleton"
import { addFaculty, editFaculty, deleteFaculty } from "@/app/dashboard/actions/addFaculty"
import { addSubject, deleteSubject } from "@/app/dashboard/actions/addSubject"
import { fetchUsers } from "@/app/dashboard/actions/fetchUser"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { RoleDataItem } from "@/context/DashboardContext"

type User = {
  id: string
  auth_id: string
  name: string
  email: string
  profile_photo?: string
}

type PSOPEOItem = {
  id: string
  label: string
  value: string
  type: "PSO" | "PEO"
}

// Form schemas
const addFacultySchema = z.object({
  userId: z.string().uuid("Please select a valid faculty"),
  departId: z.string(),
  subjectId: z.string().optional(),
  academicYear: z.string().min(4, "Please enter a valid academic year"),
  division: z.enum(["Division 1", "Division 2", "Division 1 & Division 2"], {
    required_error: "Please select a division",
  }),
})

const editFacultySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid("Please select a valid faculty"),
  departId: z.string(),
  subjectId: z.string().optional(),
  academicYear: z.string().min(4, "Please enter a valid academic year"),
  division: z.enum(["Division 1", "Division 2", "Division 1 & Division 2"], {
    required_error: "Please select a division",
  }),
})

const addSubjectSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  semester: z.coerce.number().int().min(1).max(8),
  lectureHours: z.coerce.number().int().min(0),
  labHours: z.coerce.number().int().min(0),
  abbreviationName: z.string().min(2, "Abbreviation must be at least 2 characters"),
  credits: z.coerce.number().int().min(1),
  departmentId: z.string(),
  isPractical: z.boolean(),
  isTheory: z.boolean(),
})

export default function HODDashboard() {
  const { roleData, currentRole, setCurrentRole } = useDashboardContext()
  const [role, setRole] = useState<RoleDataItem>()
  const [faculty, setFaculty] = useState<User_Role[]>([])
  const [subjects, setSubjects] = useState<Subjects[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [facultyDialogOpen, setFacultyDialogOpen] = useState(false)
  const [editFacultyDialogOpen, setEditFacultyDialogOpen] = useState(false)
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isAddingFaculty, setIsAddingFaculty] = useState(false)
  const [isEditingFaculty, setIsEditingFaculty] = useState(false)
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<User_Role | null>(null)
  const [deleteFacultyDialogOpen, setDeleteFacultyDialogOpen] = useState(false)
  const [deleteSubjectDialogOpen, setDeleteSubjectDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subjects | null>(null)
  const [isDeletingFaculty, setIsDeletingFaculty] = useState(false)
  const [isDeletingSubject, setIsDeletingSubject] = useState(false)
  const [showPsoPeoInDialog, setShowPsoPeoInDialog] = useState(false)
  const [psoPeoDialogOpen, setPsoPeoDialogOpen] = useState(false)
  const [psoItems, setPsoItems] = useState<PSOPEOItem[]>([
    { id: "1", label: "PSO1", value: "", type: "PSO" },
    { id: "2", label: "PSO2", value: "", type: "PSO" },
  ])
  const [peoItems, setPeoItems] = useState<PSOPEOItem[]>([
    { id: "1", label: "PEO1", value: "", type: "PEO" },
    { id: "2", label: "PEO2", value: "", type: "PEO" },
  ])
  const [middleString, setMiddleString] = useState("")

  const facultyForm = useForm<z.infer<typeof addFacultySchema>>({
    resolver: zodResolver(addFacultySchema),
    defaultValues: {
      departId: currentRole?.depart_id || "",
      academicYear: new Date().getFullYear().toString(),
      division: "Division 1 & Division 2",
    },
  })

  const editFacultyForm = useForm<z.infer<typeof editFacultySchema>>({
    resolver: zodResolver(editFacultySchema),
    defaultValues: {
      id: "",
      departId: currentRole?.depart_id || "",
      academicYear: new Date().getFullYear().toString(),
      division: "Division 1 & Division 2",
    },
  })

  const subjectForm = useForm<z.infer<typeof addSubjectSchema>>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues: {
      departmentId: currentRole?.depart_id || "",
      semester: 1,
      lectureHours: 0,
      labHours: 0,
      credits: 0,
      isPractical: false,
      isTheory: true,
    },
  })

  const uniqueRoles = useMemo(() => {
    const unique = new Map<string, RoleDataItem>()
    roleData.forEach((role) => {
      if (!unique.has(role.role_name)) {
        unique.set(role.role_name, role)
      }
    })
    return Array.from(unique.values())
  }, [roleData])

  const uniqueFaculty = useMemo(() => {
    const facultyMap = new Map<string, User_Role & { subjectAbbreviations: string[] }>()

    faculty.forEach((facultyMember) => {
      const email = facultyMember.users?.email
      if (email && !facultyMap.has(email)) {
        facultyMap.set(email, {
          ...facultyMember,
          subjectAbbreviations: [] as string[],
        })
      }
      const current = facultyMap.get(email || "")
      if (current && facultyMember.subjects?.abbreviation_name) {
        current.subjectAbbreviations.push(facultyMember.subjects.abbreviation_name)
      }
    })

    return Array.from(facultyMap.values())
  }, [faculty])

  const handleRoleChange = (roleName: string) => {
    const selectedRole = roleData.find((role) => role.role_name === roleName)
    if (selectedRole) {
      setCurrentRole(selectedRole)
    }
  }

  // PSO/PEO Management Functions
  const addPsoItem = () => {
    const newId = (psoItems.length + 1).toString()
    const newLabel = `PSO${psoItems.length + 1}`
    setPsoItems([...psoItems, { id: newId, label: newLabel, value: "", type: "PSO" }])
  }

  const addPeoItem = () => {
    const newId = (peoItems.length + 1).toString()
    const newLabel = `PEO${peoItems.length + 1}`
    setPeoItems([...peoItems, { id: newId, label: newLabel, value: "", type: "PEO" }])
  }

  const updatePsoItem = (id: string, field: "label" | "value", newValue: string) => {
    setPsoItems(psoItems.map((item) => (item.id === id ? { ...item, [field]: newValue } : item)))
  }

  const updatePeoItem = (id: string, field: "label" | "value", newValue: string) => {
    setPeoItems(peoItems.map((item) => (item.id === id ? { ...item, [field]: newValue } : item)))
  }

  const deletePsoItem = (id: string) => {
    if (psoItems.length > 1) {
      setPsoItems(psoItems.filter((item) => item.id !== id))
    }
  }

  const deletePeoItem = (id: string) => {
    if (peoItems.length > 1) {
      setPeoItems(peoItems.filter((item) => item.id !== id))
    }
  }

  const handlePsoPeoSubmit = () => {
    console.log("PSO Items:", psoItems)
    console.log("PEO Items:", peoItems)
    console.log("Middle String:", middleString)

    toast("PSO/PEO data saved successfully")
    setPsoPeoDialogOpen(false)
    setShowPsoPeoInDialog(false)
    setSubjectDialogOpen(false)

    // Reset the form data
    setPsoItems([
      { id: "1", label: "PSO1", value: "", type: "PSO" },
      { id: "2", label: "PSO2", value: "", type: "PSO" },
    ])
    setPeoItems([
      { id: "1", label: "PEO1", value: "", type: "PEO" },
      { id: "2", label: "PEO2", value: "", type: "PEO" },
    ])
    setMiddleString("")
  }

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const result = await fetchUsers()
        console.log("Fetched users result:", result)
        // Fix: Extract userData from the result object
        if (result && result.userData) {
          setUsers(result.userData)
        } else {
          setUsers([])
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsers([])
      }
    }

    if (facultyDialogOpen || editFacultyDialogOpen) {
      fetchUsersData()
    }
  }, [facultyDialogOpen, editFacultyDialogOpen])

  const onAddFacultySubmit = async (values: z.infer<typeof addFacultySchema>) => {
    if (!currentRole?.depart_id) {
      toast("Department ID is missing")
      return
    }

    setIsAddingFaculty(true)
    values.departId = currentRole.depart_id

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = await addFaculty(formData)
      if (result.success) {
        toast("Faculty added successfully")
        setFacultyDialogOpen(false)
        facultyForm.reset({
          departId: currentRole.depart_id,
          academicYear: new Date().getFullYear().toString(),
          division: "Division 1 & Division 2",
        })

        const facultyData = await fetchFaculty()
        const departFaculty = facultyData.filter(
          (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
        )
        setFaculty(departFaculty)
      } else {
        toast("Failed to add faculty")
      }
    } catch (error) {
      console.error("Error adding faculty:", error)
      toast("An unexpected error occurred")
    } finally {
      setIsAddingFaculty(false)
    }
  }

  const onEditFacultySubmit = async (values: z.infer<typeof editFacultySchema>) => {
    if (!currentRole?.depart_id) {
      toast("Department ID is missing")
      return
    }

    setIsEditingFaculty(true)
    values.departId = currentRole.depart_id

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = await editFaculty(formData)
      if (result.success) {
        toast("Faculty updated successfully")
        setEditFacultyDialogOpen(false)
        editFacultyForm.reset()

        const facultyData = await fetchFaculty()
        const departFaculty = facultyData.filter(
          (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
        )
        setFaculty(departFaculty)
      } else {
        toast("Failed to update faculty")
      }
    } catch (error) {
      console.error("Error updating faculty:", error)
      toast("An unexpected error occurred")
    } finally {
      setIsEditingFaculty(false)
    }
  }

  const handleEditFaculty = (faculty: User_Role) => {
    console.log("Editing faculty:", faculty)
    setSelectedFaculty(faculty)
    editFacultyForm.reset({
      id: faculty.id,
      userId: faculty.users?.auth_id || "",
      departId: faculty.depart_id,
      subjectId: faculty.subjects?.id || "",
      academicYear: faculty.academic_year || new Date().getFullYear().toString(),
      division:
        (faculty.division as "Division 1" | "Division 2" | "Division 1 & Division 2") || "Division 1 & Division 2",
    })
    setEditFacultyDialogOpen(true)
  }

  const handleDeleteFaculty = (faculty: User_Role) => {
    setSelectedFaculty(faculty)
    setDeleteFacultyDialogOpen(true)
  }

  const confirmDeleteFaculty = async () => {
    if (!selectedFaculty) {
      return
    }

    setIsDeletingFaculty(true)
    try {
      const result = await deleteFaculty(selectedFaculty.id)
      if (result.success) {
        toast("Faculty deleted successfully")
        setDeleteFacultyDialogOpen(false)

        const facultyData = await fetchFaculty()
        const departFaculty = facultyData.filter(
          (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
        )
        setFaculty(departFaculty)
      } else {
        toast("Failed to delete faculty")
      }
    } catch (error) {
      console.error("Error deleting faculty:", error)
      toast("An unexpected error occurred")
    } finally {
      setIsDeletingFaculty(false)
    }
  }

  const handleDeleteSubject = (subject: Subjects) => {
    setSelectedSubject(subject)
    setDeleteSubjectDialogOpen(true)
  }

  const confirmDeleteSubject = async () => {
    if (!selectedSubject) return

    setIsDeletingSubject(true)
    try {
      const result = await deleteSubject(selectedSubject.id)
      if (result.success) {
        toast("Subject deleted successfully")
        setDeleteSubjectDialogOpen(false)

        // Refresh both subjects and faculty data since faculty assignments may have changed
        const [subjectData, facultyData] = await Promise.all([fetchSubjects(), fetchFaculty()])

        const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
        setSubjects(departSubjects)

        const departFaculty = facultyData.filter(
          (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
        )
        setFaculty(departFaculty)
      } else {
        toast("Failed to delete subject")
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast("An unexpected error occurred")
    } finally {
      setIsDeletingSubject(false)
    }
  }

  const onAddSubjectSubmit = async (values: z.infer<typeof addSubjectSchema>) => {
    if (!currentRole?.depart_id) {
      toast("Department ID is missing")
      return
    }

    setIsAddingSubject(true)
    values.departmentId = currentRole.depart_id

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    try {
      const result = await addSubject(formData)
      if (result.success) {
        toast("Subject added successfully")
        subjectForm.reset({
          departmentId: currentRole.depart_id,
          semester: 1,
          lectureHours: 0,
          labHours: 0,
          credits: 0,
          isPractical: false,
          isTheory: true,
        })

        const subjectData = await fetchSubjects()
        const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
        setSubjects(departSubjects)

        // Show PSO/PEO button in dialog after successful subject addition
        setShowPsoPeoInDialog(true)
      } else {
        toast("Failed to add subject")
      }
    } catch (error) {
      console.error("Error adding subject:", error)
      toast("An unexpected error occurred")
    } finally {
      setIsAddingSubject(false)
    }
  }

  useEffect(() => {
    const foundRole = roleData.find((x) => x.role_name === currentRole?.role_name)
    setRole(foundRole)
  }, [roleData, currentRole])

  useEffect(() => {
    const loadData = async () => {
      if (!currentRole?.depart_id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const facultyData = await fetchFaculty()
        const departFaculty = facultyData.filter(
          (faculty) => faculty.depart_id === currentRole.depart_id && faculty.role_name === "Faculty",
        )
        setFaculty(departFaculty)

        const subjectData = await fetchSubjects()
        const departSubjects = subjectData.filter((subject) => subject.department_id === currentRole.depart_id)
        setSubjects(departSubjects)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentRole?.depart_id])

  // Update form defaults when currentRole changes
  useEffect(() => {
    if (currentRole?.depart_id) {
      facultyForm.setValue("departId", currentRole.depart_id)
      editFacultyForm.setValue("departId", currentRole.depart_id)
      subjectForm.setValue("departmentId", currentRole.depart_id)
    }
  }, [currentRole?.depart_id, facultyForm, editFacultyForm, subjectForm])

  if (isLoading) {
    return <HODDashboardSkeleton />
  }

  if (!currentRole) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">No role selected</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
          {currentRole.role_name} Dashboard
        </p>
        <div>
          <Select onValueChange={handleRoleChange} value={currentRole.role_name}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={currentRole.role_name} />
            </SelectTrigger>
            <SelectContent>
              {uniqueRoles.map((role, idx) => (
                <SelectItem value={role.role_name} key={idx}>
                  {role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {currentRole.role_name === "HOD" ? (
          <div>
            <div className="flex flex-col justify-around pl-5 py-2 bg-[#EBF5FF] h-[77px] rounded-[10px] border border-gray-400 mt-3">
              <p className="text-[#1A5CA1] font-manrope font-bold text-[20px] leading-[100%] tracking-[0em]">
                {currentRole.departments?.institutes?.name || "Institute Name"}
              </p>
              <h2 className="font-manrope font-medium text-[18px] leading-[100%] tracking-[0em]">
                {currentRole.departments?.name || "Department Name"}
              </h2>
            </div>

            <div className="grid grid-cols-5 gap-5 mt-3">
              <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
                <div className="flex flex-col justify-between h-14">
                  <h3 className="font-manrope font-semibold text-[17px] leading-[100%] tracking-[0em]">
                    Total Faculty
                  </h3>
                  <p className="font-manrope font-bold text-[30px] leading-[100%] tracking-[0em] text-[#1A5CA1]">
                    {uniqueFaculty.length}
                  </p>
                </div>
                <Users className="size-11" />
              </div>
              <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
                <div className="flex flex-col justify-between h-14">
                  <h3 className="font-manrope font-semibold text-[16px] leading-[100%] tracking-[0em]">
                    Total Subjects
                  </h3>
                  <p className="font-manrope font-bold text-[30px] leading-[100%] tracking-[0em] text-[#1A5CA1]">
                    {subjects.length}
                  </p>
                </div>
                <BookOpen className="size-11" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="border rounded-lg border-black p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">
                    Faculty Management
                  </h2>
                  <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <div className="flex items-center gap-2">
                          <Plus />
                          <p>Add Faculty</p>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
                          Add New Faculty
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...facultyForm}>
                        <form onSubmit={facultyForm.handleSubmit(onAddFacultySubmit)} className="space-y-4">
                          <div className="flex gap-x-4">
                            <FormField
                              control={facultyForm.control}
                              name="userId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Faculty</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select Faculty" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {users.map((user) => (
                                        <SelectItem className="cursor-pointer" key={user.auth_id} value={user.auth_id}>
                                          {user.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={facultyForm.control}
                              name="subjectId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-[230px]">
                                        <SelectValue placeholder="Select Subject" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {subjects.map((subject) => (
                                        <SelectItem className="cursor-pointer" key={subject.id} value={subject.id}>
                                          {subject.name} ({subject.abbreviation_name})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={facultyForm.control}
                            name="academicYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Academic Year</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={facultyForm.control}
                            name="division"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Division</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-[230px]">
                                      <SelectValue placeholder="Select division" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem className="cursor-pointer" value="Division 1">
                                      Division 1
                                    </SelectItem>
                                    <SelectItem className="cursor-pointer" value="Division 2">
                                      Division 2
                                    </SelectItem>
                                    <SelectItem className="cursor-pointer" value="Division 1 & Division 2">
                                      Division 1 & Division 2
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <div className="flex justify-between w-full">
                              <Button type="button" variant="outline" onClick={() => setFacultyDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isAddingFaculty}>
                                {isAddingFaculty ? "Adding..." : "Add Faculty"}
                              </Button>
                            </div>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                <hr className="border-1 border-black mt-3" />
                <div className="mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[28%]">Name</TableHead>
                        <TableHead className="w-[45%]">Email</TableHead>
                        <TableHead className="w-[19%]">Subjects</TableHead>
                        <TableHead className="w-[10%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueFaculty.length > 0 ? (
                        uniqueFaculty.map((facultyMember) => (
                          <TableRow key={facultyMember.id}>
                            <TableCell className="font-medium">{facultyMember.users?.name || "N/A"}</TableCell>
                            <TableCell>{facultyMember.users?.email || "N/A"}</TableCell>
                            <TableCell>{facultyMember.subjectAbbreviations.join(", ") || "No subjects"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleEditFaculty(facultyMember)}
                                >
                                  <Edit />
                                </Button>
                                <Button
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteFaculty(facultyMember)}
                                >
                                  <Trash />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No faculty members found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="border rounded-lg border-black p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">
                    Subject Details
                  </h2>
                  <div className="flex gap-2">
                    <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <div className="flex items-center gap-2">
                            <Plus />
                            <p>Add Subject</p>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
                            Add New Subject
                          </DialogTitle>
                        </DialogHeader>
                        <Form {...subjectForm}>
                          <form onSubmit={subjectForm.handleSubmit(onAddSubjectSubmit)} className="space-y-4">
                            <FormField
                              control={subjectForm.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="CSE401" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={subjectForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Data Communication and Networking" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={subjectForm.control}
                              name="abbreviationName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Abbreviation</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="DCN" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={subjectForm.control}
                                name="semester"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Semester</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} min={1} max={8} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={subjectForm.control}
                                name="credits"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Credits</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} min={1} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={subjectForm.control}
                                name="lectureHours"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lecture Hours</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} min={0} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={subjectForm.control}
                                name="labHours"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lab Hours</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} min={0} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex space-x-4 pt-1 pb-3">
                              <FormField
                                control={subjectForm.control}
                                name="isTheory"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start">
                                    <FormControl>
                                      <Checkbox
                                        className="cursor-pointer"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none cursor-pointer">
                                      <FormLabel className="cursor-pointer">Theory Subject</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={subjectForm.control}
                                name="isPractical"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start">
                                    <FormControl>
                                      <Checkbox
                                        className="cursor-pointer"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none cursor-pointer">
                                      <FormLabel className="cursor-pointer">Practical Subject</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <DialogFooter>
                              <div className="flex justify-between w-full">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setSubjectDialogOpen(false)
                                    setShowPsoPeoInDialog(false)
                                  }}
                                >
                                  Cancel
                                </Button>
                                {!showPsoPeoInDialog ? (
                                  <Button type="submit" disabled={isAddingSubject}>
                                    {isAddingSubject ? "Adding..." : "Add Subject"}
                                  </Button>
                                ) : (
                                  <Button type="button" onClick={() => setPsoPeoDialogOpen(true)}>
                                    Add PSO/PEO
                                  </Button>
                                )}
                              </div>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                    {/* PSO/PEO Dialog */}
                    <Dialog open={psoPeoDialogOpen} onOpenChange={setPsoPeoDialogOpen}>
                      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
                            Add PSO/PEO
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* PSO Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">Program Specific Outcome</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPsoItem}
                                className="flex items-center gap-1"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {psoItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-2">
                                <Input
                                  value={item.label}
                                  onChange={(e) => updatePsoItem(item.id, "label", e.target.value)}
                                  className="w-20"
                                  placeholder="PSO1"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) => updatePsoItem(item.id, "value", e.target.value)}
                                  className="flex-1"
                                  placeholder="Enter PSO description"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deletePsoItem(item.id)}
                                  disabled={psoItems.length <= 1}
                                  className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {/* PEO Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">Program Educational Objective</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPeoItem}
                                className="flex items-center gap-1"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {peoItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-2">
                                <Input
                                  value={item.label}
                                  onChange={(e) => updatePeoItem(item.id, "label", e.target.value)}
                                  className="w-20"
                                  placeholder="PEO1"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) => updatePeoItem(item.id, "value", e.target.value)}
                                  className="flex-1"
                                  placeholder="Enter PEO description"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deletePeoItem(item.id)}
                                  disabled={peoItems.length <= 1}
                                  className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <DialogFooter className="mt-6">
                          <div className="flex justify-between w-full">
                            <Button type="button" variant="outline" onClick={() => setPsoPeoDialogOpen(false)}>
                              Back to Subject
                            </Button>
                            <Button type="button" onClick={handlePsoPeoSubmit}>
                              Submit PSO/PEO
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <hr className="border-1 border-black mt-3" />
                <div className="mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[55%]">Name</TableHead>
                        <TableHead className="w-[15%]">Code</TableHead>
                        <TableHead className="w-[16%]">Semester</TableHead>
                        <TableHead className="w-[48%]">Abbreviation</TableHead>
                        <TableHead className="w-[10%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.length > 0 ? (
                        subjects.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell>{subject.code}</TableCell>
                            <TableCell>{subject.semester}</TableCell>
                            <TableCell>{subject.abbreviation_name}</TableCell>
                            <TableCell>
                              <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteSubject(subject)}
                              >
                                <Trash />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No subjects found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>{JSON.stringify(role)}</div>
        )}
      </div>

      {/* Edit Faculty Dialog */}
      <Dialog open={editFacultyDialogOpen} onOpenChange={setEditFacultyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px] mb-3">
              Edit Faculty
            </DialogTitle>
          </DialogHeader>
          <Form {...editFacultyForm}>
            <form onSubmit={editFacultyForm.handleSubmit(onEditFacultySubmit)} className="space-y-4">
              <FormField
                control={editFacultyForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-x-4">
                <FormField
                  control={editFacultyForm.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem className="cursor-pointer" key={user.auth_id} value={user.auth_id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editFacultyForm.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[230px]">
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem className="cursor-pointer" key={subject.id} value={subject.id}>
                              {subject.name} ({subject.abbreviation_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editFacultyForm.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editFacultyForm.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[230px]">
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="Division 1">
                          Division 1
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="Division 2">
                          Division 2
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="Division 1 & Division 2">
                          Division 1 & Division 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button type="button" variant="outline" onClick={() => setEditFacultyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isEditingFaculty}>
                    {isEditingFaculty ? "Updating..." : "Update Faculty"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Faculty Confirmation Dialog */}
      <AlertDialog open={deleteFacultyDialogOpen} onOpenChange={setDeleteFacultyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 font-manrope font-bold text-[23px] leading-[25px]">
              Delete Faculty
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to delete <b>{selectedFaculty?.users?.name}</b>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-between w-full">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteFaculty}
                disabled={isDeletingFaculty}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeletingFaculty ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Subject Confirmation Dialog */}
      <AlertDialog open={deleteSubjectDialogOpen} onOpenChange={setDeleteSubjectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 font-manrope font-bold text-[23px] leading-[25px]">
              Delete Subject
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to delete <b>{selectedSubject?.name}</b>? This action cannot be undone.
              <br />
              <br />
              <strong>Note:</strong> Any faculty assigned to this subject will have their assignment removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-between w-full">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteSubject}
                disabled={isDeletingSubject}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeletingSubject ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
