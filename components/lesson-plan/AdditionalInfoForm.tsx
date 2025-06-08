// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Trash2, Save } from "lucide-react";
// import { toast } from "sonner";
// import {
//   additionalInfoSchema,
//   type AdditionalInfoFormValues,
// } from "@/utils/schema";
// import { saveAdditionalInfoForm } from "@/app/dashboard/actions/saveAdditionalInfoForm";
// import { useDashboardContext } from "@/context/DashboardContext";

// interface AdditionalInfoFormProps {
//   lessonPlan: any;
//   setLessonPlan: React.Dispatch<React.SetStateAction<any>>;
// }

// const eventTypes = [
//   "Expert Talk",
//   "Workshop",
//   "Seminar",
//   "Webinar",
//   "Competition",
//   "Panel Discussion",
//   "Round Table Discussion",
//   "Poster Presentations",
//   "Project Exhibitions",
//   "Knowledge Sharing Session",
//   "Debate",
//   "Idea/Innovation Contest",
//   "Other",
// ];

// const targetAudienceOptions = [
//   "1st Semester",
//   "2nd Semester",
//   "3rd Semester",
//   "4th Semester",
//   "5th Semester",
//   "6th Semester",
//   "7th Semester",
//   "8th Semester",
//   "Staff",
// ];

// const skillMappingOptions = [
//   "Problem Solving",
//   "Critical Thinking",
//   "Communication",
//   "Leadership",
//   "Teamwork",
//   "Technical Skills",
//   "Research Skills",
//   "Innovation",
//   "Analytical Thinking",
//   "Project Management",
// ];

// export default function AdditionalInfoForm({
//   lessonPlan,
//   setLessonPlan,
// }: AdditionalInfoFormProps) {
//   const { userData } = useDashboardContext();
//   const [isSaving, setIsSaving] = useState(false);

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<AdditionalInfoFormValues>({
//     resolver: zodResolver(additionalInfoSchema),
//     defaultValues: {
//       faculty_id: userData?.id || "",
//       subject_id: lessonPlan?.subject?.id || "",
//       classroom_conduct: lessonPlan?.additional_info?.classroom_conduct || "",
//       attendance_policy: lessonPlan?.additional_info?.attendance_policy || "",
//       lesson_planning_guidelines:
//         lessonPlan?.additional_info?.lesson_planning_guidelines || "",
//       cie_guidelines: lessonPlan?.additional_info?.cie_guidelines || "",
//       self_study_guidelines:
//         lessonPlan?.additional_info?.self_study_guidelines || "",
//       topics_beyond_syllabus:
//         lessonPlan?.additional_info?.topics_beyond_syllabus || "",
//       reference_materials:
//         lessonPlan?.additional_info?.reference_materials || "",
//       academic_integrity: lessonPlan?.additional_info?.academic_integrity || "",
//       communication_channels:
//         lessonPlan?.additional_info?.communication_channels || "",
//       interdisciplinary_integration:
//         lessonPlan?.additional_info?.interdisciplinary_integration || "",
//       events: lessonPlan?.additional_info?.events || [],
//     },
//   });

//   const {
//     fields: eventFields,
//     append: appendEvent,
//     remove: removeEvent,
//   } = useFieldArray({
//     control,
//     name: "events",
//   });

//   const addEvent = () => {
//     appendEvent({
//       id: `event-${Date.now()}`,
//       event_type: "Expert Talk",
//       tentative_title: "",
//       proposed_week: "",
//       duration: 1,
//       target_audience: [],
//       mode_of_conduct: "Offline",
//       expected_outcomes: "",
//       skill_mapping: [],
//       proposed_speaker: "",
//     });
//   };

//   const onSubmit = async (data: AdditionalInfoFormValues) => {
//     setIsSaving(true);
//     try {
//       const result = await saveAdditionalInfoForm({
//         faculty_id: userData?.id || "",
//         subject_id: lessonPlan?.subject?.id || "",
//         formData: data,
//       });

//       if (result.success) {
//         toast.success("Additional information saved successfully!");
//         setLessonPlan((prev: any) => ({
//           ...prev,
//           additional_info: data,
//         }));
//       } else {
//         toast.error(result.error || "Failed to save additional information");
//       }
//     } catch (error) {
//       console.error("Error saving additional info:", error);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">
//           Additional Planning Information
//         </h3>
//       </div>

//       {/* Required Fields */}
//       <div className="grid grid-cols-1 gap-6">
//         <div>
//           <Label htmlFor="classroom_conduct">
//             Classroom Conduct and Instructions{" "}
//             <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="classroom_conduct"
//             placeholder="e.g. General expectations regarding student behavior, punctuality, discipline, and active participation."
//             {...register("classroom_conduct")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.classroom_conduct && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.classroom_conduct.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="attendance_policy">
//             Attendance Policy and Criteria{" "}
//             <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="attendance_policy"
//             placeholder="e.g. Minimum attendance requirement, how attendance will be recorded, and consequences of short attendance."
//             {...register("attendance_policy")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.attendance_policy && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.attendance_policy.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="cie_guidelines">
//             CIE Guidelines <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="cie_guidelines"
//             placeholder='e.g. "Out of 5 CIEs conducted, the best 4 scores will be considered for final CIE calculation."'
//             {...register("cie_guidelines")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.cie_guidelines && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.cie_guidelines.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="self_study_guidelines">
//             Self-Study/Homework Guidelines{" "}
//             <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="self_study_guidelines"
//             placeholder="e.g. Expectations for self-study topics, how they will be assessed, and their contribution to internal evaluation."
//             {...register("self_study_guidelines")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.self_study_guidelines && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.self_study_guidelines.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="reference_materials">
//             Reference Materials and Tools{" "}
//             <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="reference_materials"
//             placeholder="e.g. Mention textbooks, reference books, software tools, platforms (e.g., Moodle, Google Classroom, etc.) used throughout the course."
//             {...register("reference_materials")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.reference_materials && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.reference_materials.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="academic_integrity">
//             Academic Integrity Policy <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="academic_integrity"
//             placeholder="e.g. Guidelines regarding plagiarism, cheating in evaluations, and expectations for original work."
//             {...register("academic_integrity")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.academic_integrity && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.academic_integrity.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <Label htmlFor="communication_channels">
//             Communication Channels <span className="text-red-500">*</span>
//           </Label>
//           <Textarea
//             id="communication_channels"
//             placeholder="e.g. LMS will be the only official mode of communication for course announcements. You can provide details with class code or other relevant information."
//             {...register("communication_channels")}
//             className="mt-2"
//             rows={4}
//           />
//           {errors.communication_channels && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.communication_channels.message}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Optional Fields */}
//       <div className="grid grid-cols-1 gap-6">
//         <div>
//           <Label htmlFor="lesson_planning_guidelines">
//             Lesson Planning Guidelines (Optional)
//           </Label>
//           <Textarea
//             id="lesson_planning_guidelines"
//             placeholder="e.g. Overview of how lessons will be delivered etc."
//             {...register("lesson_planning_guidelines")}
//             className="mt-2"
//             rows={4}
//           />
//         </div>

//         <div>
//           <Label htmlFor="topics_beyond_syllabus">
//             Topics Beyond Syllabus (Optional)
//           </Label>
//           <Textarea
//             id="topics_beyond_syllabus"
//             placeholder="e.g. Identify the topics that go beyond the prescribed syllabus to enrich student learning. These may include recent advancements & emerging trends, interdisciplinary applications, or practical case studies relevant to the subject."
//             {...register("topics_beyond_syllabus")}
//             className="mt-2"
//             rows={4}
//           />
//         </div>

//         <div>
//           <Label htmlFor="interdisciplinary_integration">
//             Interdisciplinary/Industry/Research Integration (Optional)
//           </Label>
//           <Textarea
//             id="interdisciplinary_integration"
//             placeholder="e.g. Mention of any real-world case studies, industry problems, or mini-research elements integrated in the curriculum."
//             {...register("interdisciplinary_integration")}
//             className="mt-2"
//             rows={4}
//           />
//         </div>
//       </div>

//       {/* Event Planning Section */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Event Planning Details (Optional)</CardTitle>
//             <Button
//               type="button"
//               onClick={addEvent}
//               variant="outline"
//               size="sm"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add Event
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {eventFields.map((field, index) => (
//             <Card key={field.id} className="p-4">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Event {index + 1}</h4>
//                 <Button
//                   type="button"
//                   onClick={() => removeEvent(index)}
//                   variant="outline"
//                   size="sm"
//                   className="text-red-600 hover:text-red-700"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="mb-2">
//                     Event Type <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={watch(`events.${index}.event_type`)}
//                     onValueChange={(value) =>
//                       setValue(`events.${index}.event_type`, value as any)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select event type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {eventTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="mb-2">
//                     Tentative Event Title{" "}
//                     <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     {...register(`events.${index}.tentative_title`)}
//                     placeholder="Enter event title"
//                   />
//                   {errors.events?.[index]?.tentative_title && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.events[index]?.tentative_title?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label className="mb-2">
//                     Proposed Week <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     {...register(`events.${index}.proposed_week`)}
//                     placeholder="e.g. Week 5"
//                   />
//                   {errors.events?.[index]?.proposed_week && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.events[index]?.proposed_week?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label className="mb-2">
//                     Duration (hours) <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     type="number"
//                     min="1"
//                     {...register(`events.${index}.duration`)}
//                     placeholder="1"
//                   />
//                   {errors.events?.[index]?.duration && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.events[index]?.duration?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label className="mb-2">
//                     Mode of Conduct <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={watch(`events.${index}.mode_of_conduct`)}
//                     onValueChange={(value) =>
//                       setValue(`events.${index}.mode_of_conduct`, value as any)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select mode" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Offline">Offline</SelectItem>
//                       <SelectItem value="Online">Online</SelectItem>
//                       <SelectItem value="Hybrid">Hybrid</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="mb-2">Proposed Speaker (Optional)</Label>
//                   <Input
//                     {...register(`events.${index}.proposed_speaker`)}
//                     placeholder="Enter speaker name"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <Label className="mb-2">
//                     Expected Outcomes <span className="text-red-500">*</span>
//                   </Label>
//                   <Textarea
//                     {...register(`events.${index}.expected_outcomes`)}
//                     placeholder="Write in brief, how this event will benefit students."
//                     rows={3}
//                   />
//                   {errors.events?.[index]?.expected_outcomes && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.events[index]?.expected_outcomes?.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           ))}

//           {eventFields.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               <p>No events added yet. Click "Add Event" to create an event.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="w-full flex justify-end">
//         <Button
//           type="submit"
//           disabled={isSaving}
//           className="bg-[#1A5CA1] hover:bg-[#154A80]"
//         >
//           <Save className="mr-2 h-4 w-4" />
//           {isSaving ? "Saving..." : "Save Additional Information"}
//         </Button>
//       </div>
//     </form>
//   );
// }
"use client"

import type React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { additionalInfoSchema, type AdditionalInfoFormValues } from "@/utils/schema"
import { saveAdditionalInfoForm } from "@/app/dashboard/actions/saveAdditionalInfoForm"
import { useDashboardContext } from "@/context/DashboardContext"
import { checkLessonPlanCompletion } from "@/app/dashboard/actions/checkLessonPlanCompletion"

interface AdditionalInfoFormProps {
  lessonPlan: any
  setLessonPlan: React.Dispatch<React.SetStateAction<any>>
}

const eventTypes = [
  "Expert Talk",
  "Workshop",
  "Seminar",
  "Webinar",
  "Competition",
  "Panel Discussion",
  "Round Table Discussion",
  "Poster Presentations",
  "Project Exhibitions",
  "Knowledge Sharing Session",
  "Debate",
  "Idea/Innovation Contest",
  "Other",
]

const targetAudienceOptions = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "Staff",
]

const skillMappingOptions = [
  "Problem Solving",
  "Critical Thinking",
  "Communication",
  "Leadership",
  "Teamwork",
  "Technical Skills",
  "Research Skills",
  "Innovation",
  "Analytical Thinking",
  "Project Management",
]

export default function AdditionalInfoForm({ lessonPlan, setLessonPlan }: AdditionalInfoFormProps) {
  const { userData } = useDashboardContext()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      faculty_id: userData?.id || "",
      subject_id: lessonPlan?.subject?.id || "",
      classroom_conduct: lessonPlan?.additional_info?.classroom_conduct || "",
      attendance_policy: lessonPlan?.additional_info?.attendance_policy || "",
      lesson_planning_guidelines: lessonPlan?.additional_info?.lesson_planning_guidelines || "",
      cie_guidelines: lessonPlan?.additional_info?.cie_guidelines || "",
      self_study_guidelines: lessonPlan?.additional_info?.self_study_guidelines || "",
      topics_beyond_syllabus: lessonPlan?.additional_info?.topics_beyond_syllabus || "",
      reference_materials: lessonPlan?.additional_info?.reference_materials || "",
      academic_integrity: lessonPlan?.additional_info?.academic_integrity || "",
      communication_channels: lessonPlan?.additional_info?.communication_channels || "",
      interdisciplinary_integration: lessonPlan?.additional_info?.interdisciplinary_integration || "",
      events: lessonPlan?.additional_info?.events || [],
    },
  })

  const {
    fields: eventFields,
    append: appendEvent,
    remove: removeEvent,
  } = useFieldArray({
    control,
    name: "events",
  })

  const addEvent = () => {
    appendEvent({
      id: `event-${Date.now()}`,
      event_type: "Expert Talk",
      tentative_title: "",
      proposed_week: "",
      duration: 1,
      target_audience: [],
      mode_of_conduct: "Offline",
      expected_outcomes: "",
      skill_mapping: [],
      proposed_speaker: "",
    })
  }

  const onSubmit = async (data: AdditionalInfoFormValues) => {
    setIsSaving(true)
    try {
      const result = await saveAdditionalInfoForm({
        faculty_id: userData?.id || "",
        subject_id: lessonPlan?.subject?.id || "",
        formData: data,
      })

      if (result.success) {
        // Check if lesson plan is now complete
        const completionResult = await checkLessonPlanCompletion(lessonPlan?.subject?.id)

        if (completionResult.success && completionResult.status === "submitted") {
          toast.success("🎉 Lesson Plan Completed! Status: Submitted", {
            duration: 5000,
          })
        } else {
          toast.success("Additional information saved successfully!")
        }

        setLessonPlan((prev: any) => ({
          ...prev,
          additional_info: data,
        }))
      } else {
        toast.error(result.error || "Failed to save additional information")
      }
    } catch (error) {
      console.error("Error saving additional info:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Additional Planning Information</h3>
      </div>

      {/* Required Fields */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="classroom_conduct">
            Classroom Conduct and Instructions <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="classroom_conduct"
            placeholder="e.g. General expectations regarding student behavior, punctuality, discipline, and active participation."
            {...register("classroom_conduct")}
            className="mt-2"
            rows={4}
          />
          {errors.classroom_conduct && <p className="text-red-500 text-sm mt-1">{errors.classroom_conduct.message}</p>}
        </div>

        <div>
          <Label htmlFor="attendance_policy">
            Attendance Policy and Criteria <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="attendance_policy"
            placeholder="e.g. Minimum attendance requirement, how attendance will be recorded, and consequences of short attendance."
            {...register("attendance_policy")}
            className="mt-2"
            rows={4}
          />
          {errors.attendance_policy && <p className="text-red-500 text-sm mt-1">{errors.attendance_policy.message}</p>}
        </div>

        <div>
          <Label htmlFor="cie_guidelines">
            CIE Guidelines <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="cie_guidelines"
            placeholder='e.g. "Out of 5 CIEs conducted, the best 4 scores will be considered for final CIE calculation."'
            {...register("cie_guidelines")}
            className="mt-2"
            rows={4}
          />
          {errors.cie_guidelines && <p className="text-red-500 text-sm mt-1">{errors.cie_guidelines.message}</p>}
        </div>

        <div>
          <Label htmlFor="self_study_guidelines">
            Self-Study/Homework Guidelines <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="self_study_guidelines"
            placeholder="e.g. Expectations for self-study topics, how they will be assessed, and their contribution to internal evaluation."
            {...register("self_study_guidelines")}
            className="mt-2"
            rows={4}
          />
          {errors.self_study_guidelines && (
            <p className="text-red-500 text-sm mt-1">{errors.self_study_guidelines.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reference_materials">
            Reference Materials and Tools <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reference_materials"
            placeholder="e.g. Mention textbooks, reference books, software tools, platforms (e.g., Moodle, Google Classroom, etc.) used throughout the course."
            {...register("reference_materials")}
            className="mt-2"
            rows={4}
          />
          {errors.reference_materials && (
            <p className="text-red-500 text-sm mt-1">{errors.reference_materials.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="academic_integrity">
            Academic Integrity Policy <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="academic_integrity"
            placeholder="e.g. Guidelines regarding plagiarism, cheating in evaluations, and expectations for original work."
            {...register("academic_integrity")}
            className="mt-2"
            rows={4}
          />
          {errors.academic_integrity && (
            <p className="text-red-500 text-sm mt-1">{errors.academic_integrity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="communication_channels">
            Communication Channels <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="communication_channels"
            placeholder="e.g. LMS will be the only official mode of communication for course announcements. You can provide details with class code or other relevant information."
            {...register("communication_channels")}
            className="mt-2"
            rows={4}
          />
          {errors.communication_channels && (
            <p className="text-red-500 text-sm mt-1">{errors.communication_channels.message}</p>
          )}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="lesson_planning_guidelines">Lesson Planning Guidelines (Optional)</Label>
          <Textarea
            id="lesson_planning_guidelines"
            placeholder="e.g. Overview of how lessons will be delivered etc."
            {...register("lesson_planning_guidelines")}
            className="mt-2"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="topics_beyond_syllabus">Topics Beyond Syllabus (Optional)</Label>
          <Textarea
            id="topics_beyond_syllabus"
            placeholder="e.g. Identify the topics that go beyond the prescribed syllabus to enrich student learning. These may include recent advancements & emerging trends, interdisciplinary applications, or practical case studies relevant to the subject."
            {...register("topics_beyond_syllabus")}
            className="mt-2"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="interdisciplinary_integration">
            Interdisciplinary/Industry/Research Integration (Optional)
          </Label>
          <Textarea
            id="interdisciplinary_integration"
            placeholder="e.g. Mention of any real-world case studies, industry problems, or mini-research elements integrated in the curriculum."
            {...register("interdisciplinary_integration")}
            className="mt-2"
            rows={4}
          />
        </div>
      </div>

      {/* Event Planning Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Event Planning Details (Optional)</CardTitle>
            <Button type="button" onClick={addEvent} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {eventFields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Event {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeEvent(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch(`events.${index}.event_type`)}
                    onValueChange={(value) => setValue(`events.${index}.event_type`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">
                    Tentative Event Title <span className="text-red-500">*</span>
                  </Label>
                  <Input {...register(`events.${index}.tentative_title`)} placeholder="Enter event title" />
                  {errors.events?.[index]?.tentative_title && (
                    <p className="text-red-500 text-sm mt-1">{errors.events[index]?.tentative_title?.message}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">
                    Proposed Week <span className="text-red-500">*</span>
                  </Label>
                  <Input {...register(`events.${index}.proposed_week`)} placeholder="e.g. Week 5" />
                  {errors.events?.[index]?.proposed_week && (
                    <p className="text-red-500 text-sm mt-1">{errors.events[index]?.proposed_week?.message}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">
                    Duration (hours) <span className="text-red-500">*</span>
                  </Label>
                  <Input type="number" min="1" {...register(`events.${index}.duration`)} placeholder="1" />
                  {errors.events?.[index]?.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.events[index]?.duration?.message}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">
                    Mode of Conduct <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch(`events.${index}.mode_of_conduct`)}
                    onValueChange={(value) => setValue(`events.${index}.mode_of_conduct`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Proposed Speaker (Optional)</Label>
                  <Input {...register(`events.${index}.proposed_speaker`)} placeholder="Enter speaker name" />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2">
                    Expected Outcomes <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    {...register(`events.${index}.expected_outcomes`)}
                    placeholder="Write in brief, how this event will benefit students."
                    rows={3}
                  />
                  {errors.events?.[index]?.expected_outcomes && (
                    <p className="text-red-500 text-sm mt-1">{errors.events[index]?.expected_outcomes?.message}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {eventFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No events added yet. Click "Add Event" to create an event.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="w-full flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-[#1A5CA1] hover:bg-[#154A80]">
          {isSaving ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Lesson Plan
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
