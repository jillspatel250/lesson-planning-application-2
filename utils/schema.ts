import { z } from "zod";

// General Details Form Schema
export const generalDetailsSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  division: z.enum(["Div 1", "Div 2", "Div 1 & 2", "Division 1 & 2"], {
    required_error: "Division is required",
  }),
  lecture_hours: z.coerce.number().min(1, "Lecture hours must be at least 1"),
  lab_hours: z.coerce.number().min(0, "Lab hours cannot be negative"),
  credits: z.coerce.number().min(1, "Credits must be at least 1"),
  term_start_date: z.string().min(1, "Term start date is required"),
  term_end_date: z.string().min(1, "Term end date is required"),
  course_prerequisites: z.string().min(1, "Course prerequisites are required"),
  course_prerequisites_materials: z.string().min(1, "Course prerequisites materials are required"),
  courseOutcomes: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, "Course outcome text is required"),
      }),
    )
    .min(1, "At least one course outcome is required"),
  remarks: z.string().optional(),
})

export type GeneralDetailsFormValues = z.infer<typeof generalDetailsSchema>

// Unit Planning Schema
export const unitPlanningSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  units: z
    .array(
      z.object({
        id: z.string(),
        unit_name: z.string().min(1, "Unit name is required"),
        unit_topics: z.string().min(1, "Unit topics are required"),
        probable_start_date: z.string().min(1, "Probable start date is required"),
        probable_end_date: z.string().min(1, "Probable end date is required"),
        no_of_lectures: z.coerce.number().min(1, "Number of lectures must be at least 1"),
        self_study_topics: z.string().optional(),
        self_study_materials: z.string().optional(),
        unit_materials: z.string().min(1, "Unit materials are required"),
        teaching_pedagogy: z.array(z.string()).min(1, "At least one teaching pedagogies must be selected"),
        other_pedagogy: z.string().optional(),
        co_mapping: z.array(z.string()).min(1, "At least one CO must be mapped"),
        skill_mapping: z.array(z.string()).min(1, "At least one skill must be mapped"),
        skill_objectives: z.string().min(1, "Skill objectives are required"),
        interlink_topics: z.string().optional(),
        topics_beyond_unit: z.string().min(1, "Topics beyond unit are required"),
        assigned_faculty_id: z.string().optional(),
        faculty_name: z.string().optional(),
        isNew: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
      }),
    )
    .min(1, "At least one unit is required"),
  remarks: z.string().optional(),
})

export type UnitPlanningFormValues = z.infer<typeof unitPlanningSchema>

// Practical Planning Schema
export const practicalPlanningSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  practicals: z
    .array(
      z.object({
        id: z.string(),
        practical_aim: z.string().min(1, "Practical aim is required"),
        associated_units: z.array(z.string()).min(1, "At least one associated unit must be selected"),
        probable_week: z.string().min(1, "Probable week is required"),
        lab_hours: z.coerce.number().min(1, "Lab hours must be at least 1"),
        software_hardware_requirements: z.string().min(1, "Software/Hardware requirements are required"),
        practical_tasks: z.string().min(1, "Practical tasks/problem statement is required"),
        evaluation_methods: z.array(z.string()).min(1, "At least one evaluation method must be selected"),
        other_evaluation_method: z.string().optional(),
        practical_pedagogy: z.string().min(1, "Practical pedagogy is required"),
        other_pedagogy: z.string().optional(),
        reference_material: z.string().min(1, "Reference material is required"),
        co_mapping: z.array(z.string()).min(1, "At least one CO must be mapped"),
        pso_mapping: z.array(z.string()).optional(),
        peo_mapping: z.array(z.string()).optional(),
        blooms_taxonomy: z.array(z.string()).min(1, "At least one Bloom's taxonomy level must be selected"),
        skill_mapping: z.array(z.string()).min(1, "At least one skill must be mapped"),
        skill_objectives: z.string().min(1, "Skill objectives are required"),
        assigned_faculty_id: z.string().optional(),
        faculty_name: z.string().optional(),
        isNew: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
      }),
    )
    .min(1, "At least one practical is required"),
  remarks: z.string().optional(),
})

export type PracticalPlanningFormValues = z.infer<typeof practicalPlanningSchema>

// CIE Planning Schema
export const ciePlanningSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  cies: z
    .array(
      z.object({
        id: z.string(),
        cie_number: z.coerce.number().min(1, "CIE number is required"),
        type: z.enum([
          "Lecture CIE",
          "Course Prerequisites CIE",
          "Mid-term/Internal Exam",
          "Practical CIE",
          "Internal Practical",
        ]),
        units_covered: z.array(z.string()).optional(),
        practicals_covered: z.array(z.string()).optional(),
        date: z.string().min(1, "Date is required"),
        marks: z.coerce.number().min(1, "Marks must be at least 1"),
        duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
        blooms_taxonomy: z.array(z.string()).min(1, "At least one Bloom's taxonomy level must be selected"),
        evaluation_pedagogy: z.string().min(1, "Evaluation pedagogy is required"),
        other_pedagogy: z.string().optional(),
        co_mapping: z.array(z.string()).min(1, "At least one CO must be mapped"),
        pso_mapping: z.array(z.string()).optional(),
        peo_mapping: z.array(z.string()).optional(),
        skill_mapping: z
          .array(
            z.object({
              skill: z.string().min(1, "Skill is required"),
              details: z.string().min(1, "Skill details are required"),
            }),
          )
          .min(1, "At least one skill must be mapped"),
        isNew: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
      }),
    )
    .min(3, "Minimum 3 CIEs are required for theory subjects"),
  remarks: z.string().optional(),
})

export type CIEPlanningFormValues = z.infer<typeof ciePlanningSchema>

// Additional Information Form Schema
export const additionalInfoSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  // Additional Planning Information (Required fields)
  classroom_conduct: z.string().min(1, "Classroom conduct and instructions are required"),
  attendance_policy: z.string().min(1, "Attendance policy and criteria are required"),
  cie_guidelines: z.string().min(1, "CIE guidelines are required"),
  self_study_guidelines: z.string().min(1, "Self-study/homework guidelines are required"),
  reference_materials: z.string().min(1, "Reference materials and tools are required"),
  academic_integrity: z.string().min(1, "Academic integrity policy is required"),
  communication_channels: z.string().min(1, "Communication channels are required"),

  // Optional fields
  lesson_planning_guidelines: z.string().optional(),
  topics_beyond_syllabus: z.string().optional(),
  interdisciplinary_integration: z.string().optional(),

  // Event Planning details (Optional)
  events: z
    .array(
      z.object({
        id: z.string(),
        event_type: z.enum([
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
        ]),
        other_event_type: z.string().optional(),
        tentative_title: z.string().min(1, "Event title is required"),
        proposed_week: z.string().min(1, "Proposed week is required"),
        duration: z.coerce.number().min(1, "Duration must be at least 1 hour"),
        target_audience: z
          .array(
            z.enum([
              "1st Semester",
              "2nd Semester",
              "3rd Semester",
              "4th Semester",
              "5th Semester",
              "6th Semester",
              "7th Semester",
              "8th Semester",
              "Staff",
            ]),
          )
          .min(1, "At least one target audience must be selected"),
        mode_of_conduct: z.enum(["Offline", "Online", "Hybrid"]),
        expected_outcomes: z.string().min(1, "Expected outcomes are required"),
        skill_mapping: z.array(z.string()).min(1, "At least one skill must be mapped"),
        proposed_speaker: z.string().optional(),
      }),
    )
    .optional(),
})

export type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>

// Action Schemas
export const saveGeneralDetailsSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  formData: generalDetailsSchema,
})

export const saveUnitPlanningSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  formData: unitPlanningSchema,
})

export const savePracticalPlanningSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  formData: practicalPlanningSchema,
})

export const saveCIEPlanningSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  formData: ciePlanningSchema,
})

export const saveAdditionalInfoSchema = z.object({
  faculty_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  formData: additionalInfoSchema,
})

// Update the teachingPedagogyOptions array:
export const teachingPedagogyOptions = {
  traditional: ["Chalk and Talk", "ICT based learning"],
  alternative: [
    "Active Learning",
    "Blended Learning",
    "Concept/Mind Mapping",
    "Demonstration/Simulation-Based Learning",
    "Experiential Learning",
    "Flipped Classroom",
    "Collaborative Learning",
    "Peer Learning",
    "Problem-Based Learning",
    "Project-Based Learning",
    "Reflective Learning",
    "Role Play",
    "Storytelling/Narrative Pedagogy",
  ],
  other: ["Other"],
}

// Keep the flat array for backward compatibility
export const teachingPedagogyOptionsFlat = [
  "Chalk and Talk",
  "ICT based learning",
  "Active Learning",
  "Blended Learning",
  "Concept/Mind Mapping",
  "Demonstration/Simulation-Based Learning",
  "Experiential Learning",
  "Flipped Classroom",
  "Collaborative Learning",
  "Peer Learning",
  "Problem-Based Learning",
  "Project-Based Learning",
  "Reflective Learning",
  "Role Play",
  "Storytelling/Narrative Pedagogy",
  "Other",
]

// Practical Pedagogy Options
export const practicalPedagogyOptions = [
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
export const evaluationMethodOptions = [
  "Viva",
  "Lab Performance",
  "File Submission",
  "Mini-Project",
  "Code Review",
  "Peer Evaluation",
  "Presentation",
  "Other",
]

// CIE Type Options
export const cieTypeOptions = [
  "Lecture CIE",
  "Course Prerequisites CIE",
  "Mid-term/Internal Exam",
  "Practical CIE",
  "Internal Practical",
]

// Evaluation Pedagogy Options for CIE
export const evaluationPedagogyOptions = {
  traditional: [
    "Objective-Based Assessment (Quiz/MCQ)",
    "Short/Descriptive Evaluation",
    "Oral/Visual Communication-Based Evaluation (Presentation/Public Speaking/Viva)",
    "Assignment-Based Evaluation (Homework/Take-home assignments)",
  ],
  alternative: [
    "Problem-Based Evaluation",
    "Open Book Assessment",
    "Peer Assessment",
    "Case Study-Based Evaluation",
    "Concept Mapping Evaluation",
    "Analytical Reasoning Test",
    "Critical Thinking Assessment",
    "Project-Based Assessment",
    "Group/Team Assessment",
    "Certification-Based Evaluation",
  ],
  other: ["Other"],
}

// All Evaluation Pedagogy Options (flattened)
export const allEvaluationPedagogyOptions = [
  ...evaluationPedagogyOptions.traditional,
  ...evaluationPedagogyOptions.alternative,
  ...evaluationPedagogyOptions.other,
]

// Bloom's Taxonomy Options for Practicals
export const bloomsTaxonomyPracticalOptions = ["Apply", "Analyze", "Evaluate", "Create"]

// Bloom's Taxonomy Options for CIE (includes Remember and Understand)
export const bloomsTaxonomyCIEOptions = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]

// Backward compatibility
export const bloomsTaxonomyOptions = bloomsTaxonomyPracticalOptions

// Skill Mapping Options
export const skillMappingOptions = [
  "Technical Skills",
  "Cognitive Skills",
  "Professional Skills",
  "Research and Innovation Skills",
  "Entrepreneurial or Managerial Skills",
  "Communication Skills",
  "Leadership and Teamwork Skills",
  "Creativity and Design Thinking Skills",
  "Ethical, Social, and Environmental Awareness Skills",
  "Other",
]

// PSO Options (Program Specific Outcomes)
export const psoOptions = ["PSO1", "PSO2", "PSO3", "PSO4", "PSO5"]

// PEO Options (Program Educational Objectives)
export const peoOptions = ["PEO1", "PEO2", "PEO3", "PEO4", "PEO5"]