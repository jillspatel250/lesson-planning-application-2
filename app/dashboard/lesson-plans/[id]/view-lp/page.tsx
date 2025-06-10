"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById";
import { useDashboardContext } from "@/context/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function ViewLessonPlanPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const { userData } = useDashboardContext();

  useEffect(() => {
    const loadLessonPlan = async () => {
      try {
        setIsLoading(true);
        const result = await fetchLessonPlanById(params.id as string);

        if (result.success) {
          setLessonPlan(result.data);
        } else {
          toast.error(result.error || "Failed to load lesson plan");
        }
      } catch (error) {
        console.error("Error loading lesson plan:", error);
        toast.error("Failed to load lesson plan");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id && userData.id) {
      loadLessonPlan();
    }
  }, [params.id, userData.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-lg">Loading lesson plan...</p>
        </div>
      </div>
    );
  }

  if (!lessonPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-lg text-red-500">
            Lesson plan not found or you don&apos;t have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full p-5 bg-white text-black font-sans overflow-hidden">
      <style jsx>{`
        table {
          table-layout: fixed;
          width: 100%;
        }
        td,
        th {
          word-wrap: break-word;
          word-break: break-all;
          overflow-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>
            <div className="text-center mb-8 space-y-1">
              <h1 className="text-xl font-bold">
                Charotar University of Science and Technology (CHARUSAT)
              </h1>
              <h2 className="text-xl font-bold">
                Devang Patel Institute of Advance Technology and Research
                (DEPSTAR)
              </h2>
              <h3 className="text-xl font-bold">
                Department of {lessonPlan.subject.department.name}
              </h3>
              <h4 className="text-xl font-bold">Lesson Planning</h4>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
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
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">2. UNIT DETAILS</h2>
            <h3 className="text-md font-semibold mb-2">
              2.1 Basic Units Information
            </h3>
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[4%]">
                    No.
                  </th>
                  <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[16%]">
                    Unit Name
                  </th>
                  <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[51%]">
                    Unit Topics
                  </th>
                  <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[8%]">
                    Start Date
                  </th>
                  <th className="border border-black p-2 font-bold text-center break-words overflow-hidden text-ellipsis max-w-0 w-[7%]">
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
                    <td className="border border-black p-2 text-center text-sm break-words overflow-hidden text-ellipsis max-w-0">
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
            <h3 className="text-md font-semibold mb-2">
              2.3 Other Units Content
            </h3>
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
          <h2 className="text-lg font-bold mb-2">3. PRACTICAL DETAILS</h2>
          {lessonPlan.practicals && lessonPlan.practicals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">
                3.1 Basic Practical Information
              </h3>
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
                  {lessonPlan.practicals.map(
                    (practical: any, index: number) => (
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
                          {Array.isArray(practical.co_mapping)
                            ? practical.co_mapping.join(", ")
                            : practical.co_mapping}
                        </td>
                        <td className="border border-black p-2 text-center break-words overflow-hidden text-ellipsis max-w-0 text-sm">
                          {Array.isArray(practical.pso_mapping)
                            ? practical.pso_mapping.join(", ")
                            : practical.pso_mapping}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <h3 className="text-md font-semibold mb-2">
                3.2 Practical Content
              </h3>
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
                  {lessonPlan.practicals.map(
                    (practical: any, index: number) => (
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
                    )
                  )}
                </tbody>
              </table>

              <h3 className="text-md font-semibold mb-2">
                3.3 Additional Practical Information
              </h3>
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
                  {lessonPlan.practicals.map(
                    (practical: any, index: number) => (
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
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. CIE DETAILS */}
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

          {/* 5. ADDITIONAL DETAILS */}
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

          {/* 6. STATUS */}
          <h2 className="text-lg font-bold mb-2">6. STATUS</h2>
          <div className="mb-6">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td
                    className="border border-black p-2 font-bold bg-gray-50 align-top"
                    style={{ width: "250px", minWidth: "250px" }}
                  >
                    Current Status:
                  </td>
                  <td
                    className="border border-black p-2 align-top"
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <span
                      className={`px-2 py-1 rounded ${
                        lessonPlan.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : lessonPlan.status === "Submitted"
                          ? "bg-blue-100 text-blue-800"
                          : lessonPlan.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100"
                      }`}
                    >
                      {lessonPlan.status}
                    </span>
                  </td>
                </tr>
                {lessonPlan.is_sharing && (
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
                )}
                {lessonPlan.is_sharing && (
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
                )}
              </tbody>
            </table>
          </div>

          {/* 7. COMPLETION STATUS */}
          <h2 className="text-lg font-bold mb-2">7. COMPLETION STATUS</h2>
          <div className="mt-6">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50 w-1/2">
                    General Details Completed:
                  </td>
                  <td className="border border-black p-3">
                    <span
                      className={`px-3 py-1 rounded font-medium ${
                        lessonPlan.general_details_completed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.general_details_completed
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">
                    Unit Planning Completed:
                  </td>
                  <td className="border border-black p-3">
                    <span
                      className={`px-3 py-1 rounded font-medium ${
                        lessonPlan.unit_planning_completed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.unit_planning_completed
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">
                    Practical Planning Completed:
                  </td>
                  <td className="border border-black p-3">
                    <span
                      className={`px-3 py-1 rounded font-medium ${
                        lessonPlan.practical_planning_completed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.practical_planning_completed
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">
                    CIE Planning Completed:
                  </td>
                  <td className="border border-black p-3">
                    <span
                      className={`px-3 py-1 rounded font-medium ${
                        lessonPlan.cie_planning_completed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.cie_planning_completed
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">
                    Additional Info Completed:
                  </td>
                  <td className="border border-black p-3">
                    <span
                      className={`px-3 py-1 rounded font-medium ${
                        lessonPlan.additional_info_completed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.additional_info_completed
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewLessonPlanPage;
