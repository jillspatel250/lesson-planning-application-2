// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { Table, TableHead, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useDashboardContext } from "@/context/DashboardContext"
import { fetchFacultySubjects } from "@/app/dashboard/actions/fetchFacultySubjects"
import Link from "next/link"

type FacultySubject = {
  id: string
  user_id: string
  role_name: string
  depart_id: string
  subject_id: string
  academic_year: string
  division: string
  subjects: {
    id: string
    code: string
    name: string
    semester: number
    lecture_hours: number
    lab_hours: number
    abbreviation_name: string
    credits: number
    is_practical: boolean
    is_theory: boolean
  } | null
  departments: {
    id: string
    name: string
    abbreviation_depart: string
    institutes: {
      id: string
      name: string
      abbreviation_insti: string
    } | null
  } | null
}

export default function SubjectsPage() {
  const { userData } = useDashboardContext()
  const [subjects, setSubjects] = useState<FacultySubject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSubjectData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchFacultySubjects(userData.id)
        setSubjects(data)
      } catch (error) {
        console.error("Error fetching faculty subjects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userData.id) {
      getSubjectData()
    }
  }, [userData.id])

  // Filter out subjects where subjects is null
  const validSubjects = subjects.filter((subject) => subject.subjects !== null)

  return (
    <div>
      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg mb-6">
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">My Subjects</p>
      </div>

      <div className="border rounded-lg border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-manrope font-semibold text-xl">Assigned Subjects</h2>
        </div>
        <hr className="border-1 border-black mb-6" />

        {isLoading ? (
          <div className="text-center py-8">Loading subjects...</div>
        ) : validSubjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No subjects assigned yet.</p>
            <p className="text-sm text-gray-500 mt-2">Contact your HOD for subject assignments.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Hours (L-P)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validSubjects.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.subjects?.code}</TableCell>
                  <TableCell>{item.subjects?.name}</TableCell>
                  <TableCell>{item.subjects?.semester}</TableCell>
                  <TableCell>{item.division}</TableCell>
                  <TableCell>{item.academic_year}</TableCell>
                  <TableCell>{`${item.subjects?.lecture_hours}-${item.subjects?.lab_hours}`}</TableCell>
                  <TableCell>
                    {item.subjects?.is_theory && item.subjects?.is_practical
                      ? "Theory & Practical"
                      : item.subjects?.is_theory
                        ? "Theory"
                        : "Practical"}
                  </TableCell>
                  <TableCell>
                    <Link href="/dashboard/lesson-plans/create">
                      <Button size="sm">Create Lesson Plan</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
