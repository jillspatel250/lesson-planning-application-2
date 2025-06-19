//@ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchLessonPlanById } from "@/app/dashboard/actions/fetchLessonPlanById";
import { useDashboardContext } from "@/context/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CodeSquare } from "lucide-react";

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
          toast.error(result.error || "Failed to load lesson plan !!");
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
                    {lessonPlan.subject.metadata.term_start_date} -{" "}
                    {lessonPlan.subject.metadata.term_end_date}
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
                          .map((coId) => {
                            const outcome = lessonPlan.courseOutcomes.find(
                              (co) => co.id === coId
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
          <h2 className="text-lg font-bold mb-2">3. PRACTICAL DETAILS</h2>
          {lessonPlan.practicals && lessonPlan.practicals.length > 0 && (
            <div className="mb-6 section-break practicals-section">
              {lessonPlan.practicals && lessonPlan.practicals.length > 0 && (
                <div className="mb-6">
                  {lessonPlan.practicals.map(
                    (practical: any, index: number) => (
                      <div
                        key={index}
                        className={index > 0 ? "section-break" : ""}
                      >
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
                                  .map((coId) => {
                                    const outcome =
                                      lessonPlan.courseOutcomes.find(
                                        (co) => co.id === coId
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
                                <td
                                  className="border border-black p-2"
                                  colSpan={5}
                                >
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
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
                                colSpan={5}
                              >
                                {practical.reference_material}
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-black p-2 text-sm font-bold bg-gray-50">
                                Software/Hardware Requirements:
                              </td>
                              <td
                                className="border border-black p-2 text-sm break-words whitespace-normal"
                                colSpan={5}
                              >
                                {practical.software_hardware_requirements}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

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
                        lessonPlan.complete_general
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.complete_general ? "Submitted" : "Pending"}
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
                        lessonPlan.complete_unit
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.complete_unit ? "Submitted" : "Pending"}
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
                        lessonPlan.complete_practical
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.complete_practical ? "Submitted" : "Pending"}
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
                        lessonPlan.complete_cie
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.complete_cie ? "Submitted" : "Pending"}
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
                        lessonPlan.complete_additional
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lessonPlan.complete_additional ? "Submitted" : "Pending"}
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
