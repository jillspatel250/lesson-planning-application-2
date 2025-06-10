"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default function PrintLessonPlanPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [lessonPlan, setLessonPlan] = useState<any>(null)
  const hasPrinted = useRef(false)

  useEffect(() => {
    const loadLessonPlan = async () => {
      try {
        setIsLoading(true)
        const result = await fetchLessonPlanById(params.id as string)

        if (result.success) {
          setLessonPlan(result.data)
        } else {
          console.error(result.error || "Failed to load lesson plan")
        }
      } catch (error) {
        console.error("Error loading lesson plan:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadLessonPlan()
    }
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  // Helper function to format date in DDMMYYYY format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading lesson plan for printing...</div>
  }

  if (!lessonPlan) {
    return (
      <div className="text-center text-red-500">
        Lesson plan not found or you don&apos;t have permission to view it.
      </div>
    )
  }

  return (
    <>
      {/* Print Button - Hidden during print */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print Lesson Plan
        </Button>
      </div>

      <div className="w-full p-8 bg-white text-black font-sans" style={{ fontFamily: "Arial, sans-serif" }}>
        <style jsx global>{`
  @page {
    size: A4;
    margin: 15mm 10mm 15mm 10mm;
  }

  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      width: 100%;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif !important;
    }

    /* Hide all non-essential elements during print */
    .print\\:hidden {
      display: none !important;
    }

    /* Ensure proper page breaks */
    .page-break-before {
      page-break-before: always;
    }
    
    .page-break-after {
      page-break-after: always;
    }

    /* Section headers should not break */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    /* Keep table headers with content */
    thead {
      display: table-header-group;
    }

    /* Table styling for print */
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      page-break-inside: auto;
    }

    th, td {
      padding: 3px !important;
      border: 1px solid black !important;
      vertical-align: top !important;
      font-size: 8.5pt !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      white-space: normal !important;
    }

    /* Prevent table rows from breaking across pages when possible */
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    /* Specific table column widths for better layout */
    .unit-details-table th:nth-child(1),
    .unit-details-table td:nth-child(1) {
      width: 4% !important;
    }
    .unit-details-table th:nth-child(2),
    .unit-details-table td:nth-child(2) {
      width: 16% !important;
    }
    .unit-details-table th:nth-child(3),
    .unit-details-table td:nth-child(3) {
      width: 35% !important;
    }
    .unit-details-table th:nth-child(4),
    .unit-details-table td:nth-child(4),
    .unit-details-table th:nth-child(5),
    .unit-details-table td:nth-child(5) {
      width: 8% !important;
    }
    .unit-details-table th:nth-child(6),
    .unit-details-table td:nth-child(6),
    .unit-details-table th:nth-child(7),
    .unit-details-table td:nth-child(7) {
      width: 11% !important;
    }

    /* Section spacing */
    .mb-6 {
      margin-bottom: 12pt !important;
    }

    /* Header section */
    .text-center {
      text-align: center !important;
    }

    .text-xl {
      font-size: 12pt !important;
      font-weight: bold !important;
    }

    .text-lg {
      font-size: 11pt !important;
      font-weight: bold !important;
    }

    .text-md {
      font-size: 10pt !important;
      font-weight: 600 !important;
    }

    /* Ensure sections don't break awkwardly */
    .units-section {
      page-break-inside: avoid;
    }

    /* Digital signature at bottom */
    .text-right {
      text-align: right !important;
      margin-top: 20pt !important;
    }

    /* Force page breaks before major sections if needed */
    .section-break {
      page-break-before: always;
    }
  }
`}</style>

        {/* Header Section */}
        <div className="text-center mb-8 space-y-1">
          <h1 className="text-xl font-bold">Charotar University of Science and Technology (CHARUSAT)</h1>
          <h2 className="text-xl font-bold">Devang Patel Institute of Advance Technology and Research (DEPSTAR)</h2>
          <h3 className="text-xl font-bold">Department of {lessonPlan.subject.department.name}</h3>
          <h4 className="text-xl font-bold">Lesson Planning Document</h4>
        </div>

        {/* 1. GENERAL DETAILS */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">1. GENERAL DETAILS</h2>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Faculty Name:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.faculty.name}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0 w-[10%]">
                  Faculty Email:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0 w-[25%]">
                  {lessonPlan.faculty.email}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0 w-[11%]">
                  Department:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0 w-[25%]">
                  {lessonPlan.subject.department.name} ({lessonPlan.subject.department.abbreviation_depart})
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Subject Code:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.subject.code}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0 w-[10%]">
                  Subject Name:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.subject.name}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Term Duration:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {formatDate(lessonPlan.term_start_date)} to {formatDate(lessonPlan.term_end_date)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Semester:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.subject.semester}
                  <sup>
                    {lessonPlan.subject.semester === 1
                      ? "st"
                      : lessonPlan.subject.semester === 2
                        ? "nd"
                        : lessonPlan.subject.semester === 3
                          ? "rd"
                          : "th"}
                  </sup>{" "}
                  semester
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Division:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.division}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Academic Year:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.academic_year}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Lecture Hours:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.subject.lecture_hours}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Lab Hours:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.subject.lab_hours}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Credits:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.subject.credits}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Course Prerequisites:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0" colSpan={5}>
                  {lessonPlan.course_prerequisites || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Course Prerequisites Materials:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0" colSpan={5}>
                  {lessonPlan.course_prerequisites_materials || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. UNIT DETAILS */}
        <div className="mb-6 units-section">
          <h2 className="text-lg font-bold mb-2">2. UNIT DETAILS</h2>
          <h3 className="text-md font-semibold mb-2">2.1 Basic Units Information</h3>
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[4%]">
                  No.
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                  Unit Name
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[50%]">
                  Unit Topics
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[8%]">
                  Start Date
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[8%]">
                  End Date
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[11%]">
                  No. of Lectures
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[9%]">
                  CO Mapping
                </th>
              </tr>
            </thead>
            <tbody>
              {lessonPlan.units.map((unit: any, index: number) => (
                <tr key={unit.id}>
                  <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    {index + 1}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words overflow-hidden text-ellipsis max-w-0">
                    {unit.unit_name}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.unit_topics}
                  </td>
                  <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    {formatDate(unit.probable_start_date)}
                  </td>
                  <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    {formatDate(unit.probable_end_date)}
                  </td>
                  <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    {unit.no_of_lectures}
                  </td>
                  <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    {unit.co_mapping.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">2.2 Units Content</h3>
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[4%]">
                  No.
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[29%]">
                  Self Study Topics
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[28%]">
                  Self Study Materials
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                  Teaching Pedagogy
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                  Skill Mapping
                </th>
              </tr>
            </thead>
            <tbody>
              {lessonPlan.units.map((unit: any, index: number) => (
                <tr key={unit.id}>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {index + 1}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.self_study_topics || "N/A"}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.self_study_materials || "N/A"}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.teaching_pedagogy.join(", ")}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.skill_mapping.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">2.3 Other Units Content</h3>
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[4%]">
                  No.
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[29%]">
                  Unit Materials
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[28%]">
                  Skill Objectives
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                  Topics Beyond Unit
                </th>
                <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                  Interlink Topics
                </th>
              </tr>
            </thead>
            <tbody>
              {lessonPlan.units.map((unit: any, index: number) => (
                <tr key={unit.id}>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {index + 1}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.unit_materials || "N/A"}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.skill_objectives || "N/A"}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.topics_beyond_unit || "N/A"}
                  </td>
                  <td className="border border-black p-2 text-center text-sm break-words whitespace-normal">
                    {unit.interlink_topics || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. PRACTICAL DETAILS */}
        <div className="mb-6 section-break">
          <h2 className="text-lg font-bold mb-2">3. PRACTICAL DETAILS</h2>
          {lessonPlan.practicals && lessonPlan.practicals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">3.1 Basic Practical Information</h3>
              <table className="w-full border-collapse table-fixed mb-4">
                <thead>
                  <tr>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[5%]">
                      No.
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                      Faculty Name
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                      Lab Hours
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                      Probable Week
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                      CO Mapping
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[19%]">
                      PSO Mapping
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlan.practicals.map((practical: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {index + 1}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {practical.faculty_name}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {practical.lab_hours}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {practical.probable_week}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {Array.isArray(practical.co_mapping) ? practical.co_mapping.join(", ") : practical.co_mapping}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {Array.isArray(practical.pso_mapping)
                          ? practical.pso_mapping.join(", ")
                          : practical.pso_mapping}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="text-md font-semibold mb-2">3.2 Practical Content</h3>
              <table className="w-full border-collapse table-fixed mb-4">
                <thead>
                  <tr>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[3%]">
                      No.
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[28%]">
                      Practical Aim
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[26%]">
                      Practical Tasks
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[12%]">
                      Practical Pedagogy
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[12%]">
                      Evaluation Methods
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlan.practicals.map((practical: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {index + 1}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {practical.practical_aim}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {practical.practical_tasks}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {practical.practical_pedagogy}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {Array.isArray(practical.evaluation_methods)
                          ? practical.evaluation_methods.join(", ")
                          : practical.evaluation_methods}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="text-md font-semibold mb-2">3.3 Additional Practical Information</h3>
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[4%]">
                      No.
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                      Associated Units
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                      Blooms Taxonomy
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                      Skill Mapping
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                      Skill Objectives
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                      Reference Material
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                      Software/Hardware Requirements
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlan.practicals.map((practical: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {index + 1}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {Array.isArray(practical.associated_units)
                          ? practical.associated_units.join(", ")
                          : practical.associated_units}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {Array.isArray(practical.blooms_taxonomy)
                          ? practical.blooms_taxonomy.join(", ")
                          : practical.blooms_taxonomy}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                        {Array.isArray(practical.skill_mapping)
                          ? practical.skill_mapping.join(", ")
                          : practical.skill_mapping}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {practical.skill_objectives}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {practical.reference_material}
                      </td>
                      <td className="border border-black p-2 text-center break-words whitespace-normal text-sm">
                        {practical.software_hardware_requirements}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. CIE DETAILS */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">4. CIE DETAILS</h2>
          {lessonPlan.cies && lessonPlan.cies.length > 0 && (
            <div className="mb-6">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      CIE No.
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      Units Covered
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      Date
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      Duration
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      Marks
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      Evaluation Method
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0">
                      CO Mapping
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlan.cies.map((cie: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {index + 1}
                      </td>
                      <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.units_covered}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {formatDate(cie.date)}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.duration} mins
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.marks}
                      </td>
                      <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.evaluation_method}
                      </td>
                      <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.co_mapping}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 5. ADDITIONAL DETAILS */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">5. ADDITIONAL DETAILS</h2>
          {lessonPlan.additional_info && Object.keys(lessonPlan.additional_info).length > 0 && (
            <div className="mb-6">
              <table className="w-full border-collapse">
                <tbody>
                  {lessonPlan.additional_info.academic_integrity && (
                    <tr>
                      <td
                        className="border border-black p-3 font-bold bg-gray-50 align-top"
                        style={{ width: "250px", minWidth: "250px" }}
                      >
                        Academic Integrity:
                      </td>
                      <td
                        className="border border-black p-3 align-top"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {lessonPlan.additional_info.academic_integrity}
                      </td>
                    </tr>
                  )}
                  {lessonPlan.additional_info.attendance_policy && (
                    <tr>
                      <td
                        className="border border-black p-3 font-bold bg-gray-50 align-top"
                        style={{ width: "250px", minWidth: "250px" }}
                      >
                        Attendance Policy:
                      </td>
                      <td
                        className="border border-black p-3 align-top"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {lessonPlan.additional_info.attendance_policy}
                      </td>
                    </tr>
                  )}
                  {lessonPlan.additional_info.cie_guidelines && (
                    <tr>
                      <td
                        className="border border-black p-3 font-bold bg-gray-50 align-top"
                        style={{ width: "250px", minWidth: "250px" }}
                      >
                        CIE Guidelines:
                      </td>
                      <td
                        className="border border-black p-3 align-top"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {lessonPlan.additional_info.cie_guidelines}
                      </td>
                    </tr>
                  )}
                  {lessonPlan.additional_info.classroom_conduct && (
                    <tr>
                      <td
                        className="border border-black p-3 font-bold bg-gray-50 align-top"
                        style={{ width: "250px", minWidth: "250px" }}
                      >
                        Classroom Conduct:
                      </td>
                      <td
                        className="border border-black p-3 align-top"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {lessonPlan.additional_info.classroom_conduct}
                      </td>
                    </tr>
                  )}
                  {lessonPlan.additional_info.communication_channels && (
                    <tr>
                      <td
                        className="border border-black p-3 font-bold bg-gray-50 align-top"
                        style={{ width: "250px", minWidth: "250px" }}
                      >
                        Communication Channels:
                      </td>
                      <td
                        className="border border-black p-3 align-top"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {lessonPlan.additional_info.communication_channels}
                      </td>
                    </tr>
                  )}
                  {/* Add any other additional info fields here */}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 6. SHARING */}
        {lessonPlan.is_sharing && (
          <>
            <h2 className="text-lg font-bold mb-2">6. SHARING DETAILS</h2>
            <div className="mb-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td
                      className="border border-black p-2 font-bold bg-gray-50 align-top"
                      style={{ width: "250px", minWidth: "250px" }}
                    >
                      Sharing Status:
                    </td>
                    <td
                      className="border border-black p-2 align-top"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Shared Subject
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                      Shared Faculties:
                    </td>
                    <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                      {lessonPlan.sharing_faculty.map((faculty: any) => (
                        <div key={faculty.id}>
                          {faculty.name} ({faculty.email}) - {faculty.division}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* DIGITAL SIGNATURE */}
        <p className="text-right text-sm mt-10">
          {lessonPlan.faculty.name} | {formatDate(new Date().toISOString())}
        </p>
      </div>
    </>
  )
}
