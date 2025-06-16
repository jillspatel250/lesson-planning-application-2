/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EyeIcon, File, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Form = {
  id: string
  created_at: string
  form: any
  users: {
    id: string
    name: string
    email: string
  }
  subjects: {
    id: string
    name: string
    code: string
    departments: {
      id: string
      name: string
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
  departments?: {
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Get user role information
  const userRole = userrole[0]
  const isPrincipal = userRole?.role_name === "Principal"
  const isHOD = userRole?.role_name === "HOD"
  const userDepartmentId = userRole?.depart_id

  // Filter forms based on user role
  const roleFilteredForms = useMemo(() => {
    if (isPrincipal) {
      return forms // Principal can see all forms
    } else if (isHOD && userDepartmentId) {
      // HOD can only see forms from their department
      return forms.filter((form) => form.subjects.departments.id === userDepartmentId)
    }
    return []
  }, [forms, isPrincipal, isHOD, userDepartmentId])

  // Filter forms by selected department (for principal)
  const departmentFilteredForms = useMemo(() => {
    if (!isPrincipal || selectedDepartment === "all") {
      return roleFilteredForms
    }
    return roleFilteredForms.filter((form) => form.subjects.departments.id === selectedDepartment)
  }, [roleFilteredForms, selectedDepartment, isPrincipal])

  // Sort forms
  const sortedForms = useMemo(() => {
    if (!sortField) return departmentFilteredForms

    return [...departmentFilteredForms].sort((a, b) => {
      let aValue = ""
      let bValue = ""

      switch (sortField) {
        case "faculty":
          aValue = a.users.name
          bValue = b.users.name
          break
        case "subject":
          aValue = a.subjects.name
          bValue = b.subjects.name
          break
        case "code":
          aValue = a.subjects.code
          bValue = b.subjects.code
          break
        case "department":
          aValue = a.subjects.departments.name
          bValue = b.subjects.departments.name
          break
        case "date":
          aValue = a.created_at
          bValue = b.created_at
          break
        default:
          return 0
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

  // Check authorization
  if (!isPrincipal && !isHOD) {
    return <div>You are not authorized to access this page</div>
  }

  return (
    <div className="space-y-4">
      {/* Department Filter for Principal */}
      {isPrincipal && allDepartments.length > 0 && (
        <div className="flex justify-end">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {allDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Table */}
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
              {isPrincipal && (
                <TableHead className="text-black font-bold text-lg">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("department")}
                    className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                  >
                    Department
                    {getSortIcon("department")}
                  </Button>
                </TableHead>
              )}
              <TableHead className="text-black font-bold text-lg">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("date")}
                  className="h-auto p-0 font-bold text-lg hover:bg-transparent"
                >
                  Submitted
                  {getSortIcon("date")}
                </Button>
              </TableHead>
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
              sortedForms.map((form) => (
                <TableRow className="hover:bg-gray-50 text-lg" key={form.id}>
                  <TableCell className="font-medium">{form.users.name}</TableCell>
                  <TableCell>{form.subjects.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{form.subjects.code}</Badge>
                  </TableCell>
                  {isPrincipal && (
                    <TableCell>
                      <Badge variant="secondary">{form.subjects.departments.name}</Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {new Date(form.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/utility/submitted-form/${form.id}`}>
                        <Button variant="outline" size="sm">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View LP
                        </Button>
                      </Link>
                      <Link href={`/print/${form.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <File className="w-4 h-4 mr-1" />
                          Print LP
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {sortedForms.length} lesson plan form{sortedForms.length !== 1 ? "s" : ""}
        </div>
        {selectedDepartment !== "all" && isPrincipal && (
          <div>Filtered by: {allDepartments.find((d) => d.id === selectedDepartment)?.name}</div>
        )}
      </div>
    </div>
  )
}
