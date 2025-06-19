"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintLessonPlanPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const hasPrinted = useRef(false);

  useEffect(() => {
    const loadLessonPlan = async () => {
      try {
        setIsLoading(true);
        const result = await fetchLessonPlanById(params.id as string);

        if (result.success) {
          setLessonPlan(result.data);
        } else {
          console.error(result.error || "Failed to load lesson plan");
        }
      } catch (error) {
        console.error("Error loading lesson plan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadLessonPlan();
    }
  }, [params.id]);

  useEffect(() => {
    if (lessonPlan && !isLoading && !hasPrinted.current) {
      setTimeout(() => {
        window.print();
        hasPrinted.current = true;
      }, 200);
    }
  }, [lessonPlan, isLoading]);

  const handlePrint = () => {
    window.print();
  };

  // Helper function to format date in DDMMYYYY format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading lesson plan for printing...
      </div>
    );
  }

  if (!lessonPlan) {
    return (
      <div className="text-center text-red-500">
        Lesson plan not found or you don&apos;t have permission to view it.
      </div>
    );
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

      <div
        className="w-full p-8 bg-white text-black font-sans"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <style jsx global>{`
          @page {
            size: A4 landscape;
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
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
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

            th,
            td {
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

            /* Add this to ensure each section starts on a new page */
            .units-section,
            .practicals-section,
            .cie-section,
            .additional-section {
              page-break-before: always;
            }
          }
        `}</style>

        {/* Header Section */}
        <div className="text-center mb-8 space-y-1">
          <h1 className="text-xl font-bold">
            Charotar University of Science and Technology (CHARUSAT)
          </h1>
          <h2 className="text-xl font-bold">
            Devang Patel Institute of Advance Technology and Research (DEPSTAR)
          </h2>
          <h3 className="text-xl font-bold">
            Department of {lessonPlan.subject.department.name}
          </h3>
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
                  {lessonPlan.subject.department.name} (
                  {lessonPlan.subject.department.abbreviation_depart})
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
                  {formatDate(lessonPlan.term_start_date)} to{" "}
                  {formatDate(lessonPlan.term_end_date)}
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
                  {lessonPlan.lecture_hours}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Lab Hours:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.lab_hours}
                </td>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Credits:
                </td>
                <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                  {lessonPlan.credits}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Course Prerequisites:
                </td>
                <td
                  className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0"
                  colSpan={5}
                >
                  {lessonPlan.course_prerequisites || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold break-words overflow-hidden text-ellipsis max-w-0">
                  Course Prerequisites Materials:
                </td>
                <td
                  className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0"
                  colSpan={5}
                >
                  {lessonPlan.course_prerequisites_materials || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. UNIT DETAILS */}
        <div className="mb-6 units-section">
          <h2 className="text-lg font-bold mb-2">2. UNIT DETAILS</h2>

          {lessonPlan.units.map((unit: any, index: number) => (
            <div key={unit.id} className={index > 0 ? "section-break" : ""}>
              <h3 className="text-lg font-semibold mb-2 mt-5">
                Unit {index + 1}
              </h3>

              <table className="w-full border-collapse table-fixed mb-4">
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50 w-[20%]">
                      Unit Name:
                    </td>
                    <td className="border border-black p-2 w-[30%]">
                      {unit.unit_name}
                    </td>
                    <td className="border border-black p-2 font-bold bg-gray-50 w-[20%]">
                      Faculty Name:
                    </td>
                    <td className="border border-black p-2 w-[30%]">
                      {lessonPlan.units[index].faculty_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Start Date:
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(unit.probable_start_date)}
                    </td>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      End Date:
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(unit.probable_end_date)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50 w-[20%]">
                      No. of Lectures:
                    </td>
                    <td className="border border-black p-2 w-[30%]">
                      {unit.no_of_lectures}
                    </td>
                    <td className="border border-black p-2 font-bold bg-gray-50 w-[20%]">
                      CO Mapping:
                    </td>
                    <td className="border border-black p-2" colSpan={3}>
                      {unit.co_mapping
                        .map((coId: any) => {
                          const outcome = lessonPlan.courseOutcomes.find(
                            (co: any) => co.id === coId
                          );
                          return outcome ? outcome.text : coId;
                        })
                        .join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Unit Topics:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.unit_topics}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Self Study Topics:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.self_study_topics || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Self Study Materials:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.self_study_materials || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Teaching Pedagogy:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.teaching_pedagogy.join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Skill Mapping:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.skill_mapping.join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Unit Materials:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.unit_materials || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Skill Objectives:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.skill_objectives || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Topics Beyond Unit:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.topics_beyond_unit || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-50">
                      Interlink Topics:
                    </td>
                    <td
                      className="border border-black p-2 text-sm break-words whitespace-normal"
                      colSpan={3}
                    >
                      {unit.interlink_topics || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* 3. PRACTICAL DETAILS */}
        <div className="mb-6 section-break practicals-section">
          <h2 className="text-lg font-bold mb-2">3. PRACTICAL DETAILS</h2>
          {lessonPlan.practicals && lessonPlan.practicals.length > 0 && (
            <div className="mb-6">
              {lessonPlan.practicals.map((practical: any, index: number) => (
                <div key={index} className={index > 0 ? "section-break" : ""}>
                  <h3 className="text-lg font-semibold mb-2">
                    Practical {index + 1}
                  </h3>

                  <table className="w-full border-collapse table-fixed mb-4">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50 w-[20%]">
                          Faculty Name:
                        </td>
                        <td className="border border-black p-2 w-[30%]">
                          {practical.faculty_name}
                        </td>
                        <td className="border border-black p-2 font-bold bg-gray-50 w-[20%]">
                          Lab Hours:
                        </td>
                        <td className="border border-black p-2 w-[30%]">
                          {practical.lab_hours}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Probable Week:
                        </td>
                        <td className="border border-black p-2">
                          {practical.probable_week}
                        </td>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          CO Mapping:
                        </td>
                        <td className="border border-black p-2">
                          {practical.co_mapping
                            .map((coId: any) => {
                              const outcome = lessonPlan.courseOutcomes.find(
                                (co: any) => co.id === coId
                              );
                              return outcome ? outcome.text : coId;
                            })
                            .join(", ")}
                        </td>
                      </tr>
                      {practical.pso_mapping.length > 0 && (
                        <tr>
                          <td className="border border-black p-2 font-bold bg-gray-50">
                            PSO Mapping:
                          </td>
                          <td className="border border-black p-2" colSpan={3}>
                            {Array.isArray(practical.pso_mapping)
                              ? practical.pso_mapping.join(", ")
                              : practical.pso_mapping}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Practical Aim:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {practical.practical_aim}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Practical Tasks:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {practical.practical_tasks}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Practical Pedagogy:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {practical.practical_pedagogy}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Evaluation Methods:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {Array.isArray(practical.evaluation_methods)
                            ? practical.evaluation_methods.join(", ")
                            : practical.evaluation_methods}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Associated Units:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {Array.isArray(practical.associated_units)
                            ? practical.associated_units.join(", ")
                            : practical.associated_units}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Blooms Taxonomy:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {Array.isArray(practical.blooms_taxonomy)
                            ? practical.blooms_taxonomy.join(", ")
                            : practical.blooms_taxonomy}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Skill Mapping:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {Array.isArray(practical.skill_mapping)
                            ? practical.skill_mapping.join(", ")
                            : practical.skill_mapping}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Skill Objectives:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {practical.skill_objectives}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Reference Material:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {practical.reference_material}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-gray-50">
                          Software/Hardware Requirements:
                        </td>
                        <td
                          className="border border-black p-2 text-sm break-words whitespace-normal"
                          colSpan={3}
                        >
                          {practical.software_hardware_requirements}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. CIE DETAILS */}
        <div className="mb-6 cie-section">
          <h2 className="text-lg font-bold mb-2">4. CIE DETAILS</h2>
          {lessonPlan.cies && lessonPlan.cies.length > 0 && (
            <div className="mb-6">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[5%]">
                      No.
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[38%]">
                      Units Covered
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[11%]">
                      Date
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[11%]">
                      Duration
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[6%]">
                      Marks
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[34%]">
                      Evaluation Method
                    </th>
                    <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[10%]">
                      COs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlan.cies.map((cie: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {index + 1}
                      </td>
                      {/* <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.units_covered}
                      </td> */}


<td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
  {(() => {
    // Handle units_covered mapping
    if (typeof cie.units_covered === "string") {
      // Check if it's a comma-separated list of unit IDs
      const unitIds = cie.units_covered.split(",").map((id) => id.trim())

      // If it looks like UUIDs, try to map them to unit names
      if (unitIds.some((id) => id.length > 20 && id.includes("-"))) {
        const mappedUnits = unitIds.map((unitId) => {
          const unit = lessonPlan.units?.find((u: any) => u.id === unitId)
          if (unit) {
            const unitIndex = lessonPlan.units.findIndex((u: any) => u.id === unitId)
            return `Unit ${unitIndex + 1}: ${unit.unit_name}`
          }
          return unitId // Fallback to original ID if not found
        })
        return mappedUnits.join(", ")
      }

      // If it's already readable text, return as is
      return cie.units_covered
    }

    // Handle array format
    if (Array.isArray(cie.units_covered)) {
      return cie.units_covered
        .map((unitId) => {
          const unit = lessonPlan.units?.find((u: any) => u.id === unitId)
          if (unit) {
            const unitIndex = lessonPlan.units.findIndex((u: any) => u.id === unitId)
            return `Unit ${unitIndex + 1}: ${unit.unit_name}`
          }
          return unitId
        })
        .join(", ")
    }

    return cie.units_covered || "N/A"
  })()}
</td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.date}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.duration >= 60
                          ? `${
                              cie.duration % 60 === 0
                                ? (cie.duration / 60).toFixed(0)
                                : (cie.duration / 60).toFixed(2)
                            } hours`
                          : `${cie.duration} mins`}
                      </td>
                      <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.marks}
                      </td>
                      <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.evaluation_pedagogy}
                      </td>
                      <td className="border border-black p-2 break-words overflow-hidden text-ellipsis max-w-0">
                        {cie.co_mapping
                          .map((coId: any) => {
                            const outcome = lessonPlan.courseOutcomes.find(
                              (co: any) => co.id === coId
                            );
                            return outcome ? outcome.text : coId;
                          })
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="font-bold">
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    </td>
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                      Total
                    </td>
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    </td>
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                      {(() => {
                        const totalDuration = lessonPlan.cies.reduce(
                          (sum: number, cie: any) => sum + cie.duration,
                          0
                        );
                        return totalDuration >= 60
                          ? `${
                              totalDuration % 60 === 0
                                ? (totalDuration / 60).toFixed(0)
                                : (totalDuration / 60).toFixed(2)
                            } hours`
                          : `${totalDuration} mins`;
                      })()}
                    </td>
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                      {lessonPlan.cies.reduce(
                        (sum: number, cie: any) => sum + cie.marks,
                        0
                      )}
                    </td>
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    </td>
                    <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 5. ADDITIONAL DETAILS */}
        <div className="mb-6 additional-section">
          <h2 className="text-lg font-bold mb-2">5. ADDITIONAL DETAILS</h2>
          {lessonPlan.additional_info &&
            Object.keys(lessonPlan.additional_info).length > 0 && (
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

        {/* DIGITAL SIGNATURE */}
        <p className="text-right text-sm mt-10">
          {lessonPlan.faculty.name} | {formatDate(new Date().toISOString())}
        </p>
      </div>
    </>
  );
}
