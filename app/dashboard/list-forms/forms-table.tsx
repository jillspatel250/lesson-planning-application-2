
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EyeIcon, ArrowUpDown, Printer, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Form = {
  id: string
  created_at: string
  form: any
  complete_general?: boolean
  complete_unit?: boolean
  complete_practical?: boolean
  complete_cie?: boolean
  complete_additional?: boolean
  users: {
    id: string
    auth_id: string
    name: string
    email: string
  }
  subjects: {
    id: string
    name: string
    code: string
    semester?: string | number
    departments: {
      id: string
      name: string
      abbreviation_depart: string
      institutes: {
        id: string
        name: string
      }
    }
  }
}

type UserRole = {
  id: string
  user_id: string
  role_name: string
  depart_id: string
  institute?: string
  departments?: {
    id: string
    name: string
  }
  institutes?: {
    id: string
    name: string
  }
}

type Department = {
  id: string
  name: string
}

type FormsTableProps = {
  forms: Form[]
  userrole: UserRole[]
  allDepartments: Department[]
}

export default function FormsTable({ forms, userrole, allDepartments }: FormsTableProps) {
  const router = useRouter()
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean
  }>({})

  const userRole = userrole[0]
  const isPrincipal = userRole?.role_name === "Principal"
  let isHOD = false

  for (const role of userrole) {
    if (role.role_name === "HOD") {
      isHOD = true
      break
    }
  }

  const safeAccess = (obj: any, path: string, defaultValue: any = "") => {
    try {
      return path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined && current[key] !== null ? current[key] : defaultValue
      }, obj)
    } catch {
      return defaultValue
    }
  }

  const hasInitiatedLPD = (form: Form) => {
    const completionFields = [
      form.complete_general,
      form.complete_unit,
      form.complete_practical,
      form.complete_cie,
      form.complete_additional,
    ]
    return completionFields.some((field) => field === true)
  }

  const getCompletionStatus = (form: Form) => {
    const completionFields = [
      form.complete_general,
      form.complete_unit,
      form.complete_practical,
      form.complete_cie,
      form.complete_additional,
    ]
    const completedCount = completionFields.filter(Boolean).length
    const totalFields = completionFields.length

    if (completedCount === totalFields) {
      return { status: "Complete", variant: "default" as const }
    } else if (completedCount > 0) {
      return {
        status: `${completedCount}/${totalFields} Complete`,
        variant: "secondary" as const,
      }
    } else {
      return { status: "Not Started", variant: "destructive" as const }
    }
  }

  const departmentFilteredForms = useMemo(() => {
    if (!isPrincipal || selectedDepartment === "all") {
      return forms
    }
    return forms.filter((form) => {
      const departmentId = safeAccess(form, "subjects.departments.id")
      return departmentId === selectedDepartment
    })
  }, [forms, selectedDepartment, isPrincipal])

  const sortedForms = useMemo(() => {
    if (!sortField) return departmentFilteredForms

    return [...departmentFilteredForms].sort((a, b) => {
      let aValue: any = ""
      let bValue: any = ""

      switch (sortField) {
        case "faculty":
          aValue = safeAccess(a, "users.name")
          bValue = safeAccess(b, "users.name")
          break
        case "subject":
          aValue = safeAccess(a, "subjects.name")
          bValue = safeAccess(b, "subjects.name")
          break
        case "code":
          aValue = safeAccess(a, "subjects.code")
          bValue = safeAccess(b, "subjects.code")
          break
        case "department":
          aValue = safeAccess(a, "subjects.departments.name")
          bValue = safeAccess(b, "subjects.departments.name")
          break
        case "date":
          aValue = a.created_at || ""
          bValue = b.created_at || ""
          break
        case "semester":
          const aSemester = safeAccess(a, "subjects.semester", "")
          const bSemester = safeAccess(b, "subjects.semester", "")
          const aNum = !isNaN(Number(aSemester)) ? Number(aSemester) : aSemester
          const bNum = !isNaN(Number(bSemester)) ? Number(bSemester) : bSemester
          if (typeof aNum === "number" && typeof bNum === "number") {
            return sortOrder === "asc" ? aNum - bNum : bNum - aNum
          }
          aValue = String(aSemester)
          bValue = String(bSemester)
          break
        default:
          return 0
      }

      if (sortField !== "semester") {
        const comparison = String(aValue).localeCompare(String(bValue))
        return sortOrder === "asc" ? comparison : -comparison
      }

      const comparison = aValue.localeCompare(bValue)
      return sortOrder === "asc" ? comparison : -comparison
    })
  }, [departmentFilteredForms, sortField, sortOrder])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    }
    return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
  }

  // Helper function to clear loading state
  const clearLoadingState = (actionKey: string) => {
    setLoadingActions((prev) => {
      const newState = { ...prev }
      delete newState[actionKey]
      return newState
    })
  }

  // 🚀 OPTIMIZED VIEW HANDLER - NO DATABASE QUERIES!
  const handleOnView = (form: Form) => {
    const actionKey = `view-${form.id}`

    // Set loading state
    setLoadingActions((prev) => ({ ...prev, [actionKey]: true }))

    try {
      // Check if LPD has been initiated (using existing data)
      if (!hasInitiatedLPD(form)) {
        toast.error(
          `The LPD for ${safeAccess(
            form,
            "subjects.name",
            "this subject",
          )} has not been started by ${form?.users.name}!`,
        )
        clearLoadingState(actionKey)
        return
      }

      // 🚀 DIRECT NAVIGATION - Use the form.id which is already the user_role.id we need!
      router.push(`/dashboard/lesson-plans/${form.id}/view-lp`)

      // Clear loading state after navigation
      setTimeout(() => {
        clearLoadingState(actionKey)
      }, 300)
    } catch (error) {
      console.error("Error in handleOnView:", error)
      toast.error("An unexpected error occurred. Please try again.")
      clearLoadingState(actionKey)
    }
  }

  // 🚀 OPTIMIZED PRINT HANDLER - NO DATABASE QUERIES!
  const handleOnPrint = (form: Form) => {
    const actionKey = `print-${form.id}`

    // Set loading state
    setLoadingActions((prev) => ({ ...prev, [actionKey]: true }))

    try {
      // Check if LPD has been initiated (using existing data)
      if (!hasInitiatedLPD(form)) {
        toast.error(
          `The LPD for ${safeAccess(
            form,
            "subjects.name",
            "this subject",
          )} has not been started by ${form?.users.name}!`,
        )
        clearLoadingState(actionKey)
        return
      }

      // 🚀 DIRECT NAVIGATION - Use the form.id for print route!
      router.push(`/print/${form.id}`)

      // Clear loading state after navigation
      setTimeout(() => {
        clearLoadingState(actionKey)
      }, 300)
    } catch (error) {
      console.error("Error in handleOnPrint:", error)
      toast.error("An unexpected error occurred. Please try again.")
      clearLoadingState(actionKey)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        {isPrincipal && allDepartments.length > 1 && (
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[300px] cursor-pointer">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">
                All Departments
              </SelectItem>
              {allDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id} className="cursor-pointer">
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-bold text-lg">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("faculty")}
                  className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                >
                  Faculty Name
                  {getSortIcon("faculty")}
                </Button>
              </TableHead>
              <TableHead className="text-black font-bold text-lg">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("subject")}
                  className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                >
                  Subject Name
                  {getSortIcon("subject")}
                </Button>
              </TableHead>
              <TableHead className="text-black font-bold text-lg">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("code")}
                  className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                >
                  Subject Code
                  {getSortIcon("code")}
                </Button>
              </TableHead>
              <TableHead className="text-black font-bold text-lg">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("semester")}
                  className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                >
                  Sem
                  {getSortIcon("semester")}
                </Button>
              </TableHead>
              {isPrincipal && (
                <TableHead className="text-black font-bold text-lg">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("department")}
                    className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                  >
                    Depart.
                    {getSortIcon("department")}
                  </Button>
                </TableHead>
              )}
              <TableHead className="text-black font-bold text-lg">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isPrincipal ? 6 : 5} className="text-center py-8 text-gray-500">
                  No lesson plan forms found.
                </TableCell>
              </TableRow>
            ) : (
              sortedForms.map((form) => {
                const viewActionKey = `view-${form.id}`
                const printActionKey = `print-${form.id}`

                return (
                  <TableRow className="hover:bg-gray-50 text-lg" key={form.id}>
                    <TableCell className="pl-5 scale-95">{safeAccess(form, "users.name", "N/A")}</TableCell>
                    <TableCell className="pl-5 scale-95">{safeAccess(form, "subjects.name", "N/A")}</TableCell>
                    <TableCell className="pl-5 scale-95">{safeAccess(form, "subjects.code", "N/A")}</TableCell>
                    <TableCell className="pl-5 scale-95">{safeAccess(form, "subjects.semester", "N/A")}</TableCell>
                    {isPrincipal && (
                      <TableCell className="pl-5 scale-95">
                        {safeAccess(form, "subjects.departments.abbreviation_depart", "N/A")}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* 🚀 FAST VIEW BUTTON */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOnView(form)}
                          disabled={loadingActions[viewActionKey]}
                          className="min-w-[70px] flex items-center justify-center"
                        >
                          {loadingActions[viewActionKey] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                              <span className="text-xs">Loading...</span>
                            </>
                          ) : (
                            <>
                              <EyeIcon className="w-4 h-4 mr-1" />
                              <span className="text-xs">View</span>
                            </>
                          )}
                        </Button>

                        {/* 🚀 FAST PRINT BUTTON */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOnPrint(form)}
                          disabled={loadingActions[printActionKey]}
                          className="min-w-[70px] flex items-center justify-center"
                        >
                          {loadingActions[printActionKey] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                              <span className="text-xs">Loading...</span>
                            </>
                          ) : (
                            <>
                              <Printer className="w-4 h-4 mr-1" />
                              <span className="text-xs">Print</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
