//@ts-nocheck

// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"
// import { saveAdditionalInfoSchema } from "@/utils/schema"
// import { z } from "zod"

// export async function saveAdditionalInfoForm(data: z.infer<typeof saveAdditionalInfoSchema>) {
//   try {
//     const validatedData = saveAdditionalInfoSchema.parse(data)
//     const supabase = await createClient()

//     // Check if a form already exists for this faculty and subject
//     const { data: existingForm, error: fetchError } = await supabase
//       .from("forms")
//       .select("id, form")
//       .eq("faculty_id", validatedData.faculty_id)
//       .eq("subject_id", validatedData.subject_id)
//       .single()

//     if (fetchError && fetchError.code !== "PGRST116") {
//       console.error("Error fetching existing form:", fetchError)
//       return { success: false, error: fetchError.message }
//     }

//     // Prepare the additional info data in BSON format structure
//     const additionalInfoData = {
//       faculty_id: validatedData.faculty_id,
//       subject_id: validatedData.subject_id,
//       classroom_conduct: validatedData.formData.classroom_conduct,
//       attendance_policy: validatedData.formData.attendance_policy,
//       lesson_planning_guidelines: validatedData.formData.lesson_planning_guidelines || "",
//       cie_guidelines: validatedData.formData.cie_guidelines,
//       self_study_guidelines: validatedData.formData.self_study_guidelines,
//       topics_beyond_syllabus: validatedData.formData.topics_beyond_syllabus || "",
//       reference_materials: validatedData.formData.reference_materials,
//       academic_integrity: validatedData.formData.academic_integrity,
//       communication_channels: validatedData.formData.communication_channels,
//       interdisciplinary_integration: validatedData.formData.interdisciplinary_integration || "",
//       events: validatedData.formData.events || [],
//     }

//     if (existingForm) {
//       // Update existing form
//       const existingFormData = existingForm.form || {}
//       const updatedFormData = {
//         ...existingFormData,
//         additionalInfo: additionalInfoData,
//       }

//       const { error: updateError } = await supabase
//         .from("forms")
//         .update({ form: updatedFormData })
//         .eq("id", existingForm.id)

//       if (updateError) {
//         console.error("Error updating form:", updateError)
//         return { success: false, error: updateError.message }
//       }
//     } else {
//       // Create new form with just additional info
//       const formData = {
//         additionalInfo: additionalInfoData,
//       }

//       const { error: insertError } = await supabase.from("forms").insert({
//         faculty_id: validatedData.faculty_id,
//         subject_id: validatedData.subject_id,
//         form: formData,
//       })

//       if (insertError) {
//         console.error("Error creating form:", insertError)
//         return { success: false, error: insertError.message }
//       }
//     }

//     revalidatePath("/dashboard/lesson-plans")
//     return { success: true }
//   } catch (error) {
//     console.error("Unexpected error saving additional info form:", error)
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         error: "Validation failed",
//         fieldErrors: error.flatten().fieldErrors,
//       }
//     }
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//     }
//   }
// }

// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"

// export async function saveAdditionalInfoForm(data: {
//   faculty_id: string
//   subject_id: string
//   formData: any
// }) {
//   try {
//     console.log("🚀 Starting saveAdditionalInfoForm with data:", {
//       faculty_id: data.faculty_id,
//       subject_id: data.subject_id,
//     })

//     const validatedData = {
//       faculty_id: data.faculty_id,
//       subject_id: data.subject_id,
//       formData: data.formData,
//     }

//     // Check only the REQUIRED fields (excluding learner planning fields)
//     const requiredFields = [
//       "classroom_conduct",
//       "attendance_policy",
//       "cie_guidelines",
//       "self_study_guidelines",
//       "topics_beyond_syllabus",
//       "reference_materials",
//       "academic_integrity",
//       "communication_channels",
//     ]

//     const missingFields = []
//     for (const field of requiredFields) {
//       const value = validatedData.formData[field]
//       if (!value || (typeof value === "string" && value.trim() === "")) {
//         missingFields.push(field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
//       }
//     }

//     if (missingFields.length > 0) {
//       console.log("❌ Missing required fields:", missingFields)
//       return {
//         success: false,
//         error: `Missing required fields: ${missingFields.join(", ")}`,
//         statusChanged: false,
//       }
//     }

//     const supabase = await createClient()

//     // Check if a form already exists for this faculty and subject
//     const { data: existingForm, error: fetchError } = await supabase
//       .from("forms")
//       .select("id, form")
//       .eq("faculty_id", validatedData.faculty_id)
//       .eq("subject_id", validatedData.subject_id)
//       .single()

//     if (fetchError && fetchError.code !== "PGRST116") {
//       console.error("❌ Error fetching existing form:", fetchError)
//       return {
//         success: false,
//         error: fetchError.message,
//         statusChanged: false,
//       }
//     }

//     // Prepare the additional info data structure
//     const additionalInfoData = {
//       faculty_id: validatedData.faculty_id,
//       subject_id: validatedData.subject_id,
//       classroom_conduct: validatedData.formData.classroom_conduct,
//       attendance_policy: validatedData.formData.attendance_policy,
//       lesson_planning_guidelines: validatedData.formData.lesson_planning_guidelines || "",
//       cie_guidelines: validatedData.formData.cie_guidelines,
//       self_study_guidelines: validatedData.formData.self_study_guidelines,
//       topics_beyond_syllabus: validatedData.formData.topics_beyond_syllabus,
//       reference_materials: validatedData.formData.reference_materials,
//       academic_integrity: validatedData.formData.academic_integrity,
//       communication_channels: validatedData.formData.communication_channels,
//       interdisciplinary_integration: validatedData.formData.interdisciplinary_integration || "",
//       fast_learner_planning: validatedData.formData.fast_learner_planning || "",
//       medium_learner_planning: validatedData.formData.medium_learner_planning || "",
//       slow_learner_planning: validatedData.formData.slow_learner_planning || "",
//       events: validatedData.formData.events || [],
//       completed_at: new Date().toISOString(),
//     }

//     let formSaved = false

//     if (existingForm) {
//       console.log("📝 Updating existing form...")
//       // Update existing form
//       const existingFormData = existingForm.form || {}
//       const updatedFormData = {
//         ...existingFormData,
//         additionalInfo: additionalInfoData,
//         additionalInfo: additionalInfoData,
//       }

//       const { error: updateError } = await supabase
//         .from("forms")
//         .update({ form: updatedFormData })
//         .eq("id", existingForm.id)

//       if (updateError) {
//         console.error("❌ Error updating form:", updateError)
//         return {
//           success: false,
//           error: updateError.message,
//           statusChanged: false,
//         }
//       }
//       formSaved = true;
//       // 🆕 ADD THIS ENTIRE BLOCK AFTER formSaved = true:
//     // Update subject status to "submitted" after saving additional info
//     if (formSaved) {
//       console.log("📊 Updating subject lesson plan status to submitted...")
//       const { error: statusUpdateError } = await supabase
//         .from("subjects")
//         .update({ lesson_plan_status: "submitted" })
//         .eq("id", validatedData.subject_id)

//       if (statusUpdateError) {
//         console.error("❌ Error updating subject status:", statusUpdateError)
//       } else {
//         console.log("✅ Subject lesson plan status updated to submitted")
//       }
//     }

//       console.log("✅ Form updated successfully")
//     } else {
//       console.log("📝 Creating new form...")
//       // Create new form with additional info
//       const formData = {
//         additionalInfo: additionalInfoData,
//         additionalInfo: additionalInfoData,
//       }

//       const { error: insertError } = await supabase.from("forms").insert({
//         faculty_id: validatedData.faculty_id,
//         subject_id: validatedData.subject_id,
//         form: formData,
//       })

//       if (insertError) {
//         console.error("❌ Error creating form:", insertError)
//         return {
//           success: false,
//           error: insertError.message,
//           statusChanged: false,
//         }
//       }
//       formSaved = true
//       console.log("✅ Form created successfully")
//     }

//     // Force revalidation of the lesson plans page
//     revalidatePath("/dashboard/lesson-plans")

//     console.log("🎉 Process completed:", {
//       formSaved,
//       statusChanged: formSaved,
//     })

//     return {
//       success: true,
//       data: additionalInfoData,
//       statusChanged: formSaved,
//       message: "Lesson plan completed! Status: Submitted",
//     }
//   } catch (error) {
//     console.error("❌ Unexpected error saving additional info form:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//       statusChanged: false,
//     }
//   }
// }

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ADD THIS FUNCTION AFTER THE IMPORTS:
// REPLACE the uploadFilesToStorage function with this:
async function uploadFilesToStorage(
  supabase: any,
  uploadedFiles: any,
  facultyId: string,
  subjectId: string
) {
  const uploadedUrls: any = {};

  for (const [learnerType, fileData] of Object.entries(uploadedFiles)) {
    if (fileData && typeof fileData === "object" && "arrayBuffer" in fileData) {
      try {
        // CREATE PROPER FOLDER STRUCTURE: lesson-plans/{subject_id}/{faculty_id}/
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${learnerType}_${timestamp}.pdf`;
        const filePath = `lesson-plans/${subjectId}/${facultyId}/${fileName}`;

        console.log(`📤 Uploading ${learnerType} file to:`, filePath);

        // Convert ArrayBuffer to Uint8Array for upload
        const uint8Array = new Uint8Array(fileData.arrayBuffer);

        const { data, error } = await supabase.storage
          .from("lesson-plan-files")
          .upload(filePath, uint8Array, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (error) {
          console.error(`❌ Error uploading ${learnerType} file:`, error);
          throw new Error(
            `Failed to upload ${learnerType} file: ${error.message}`
          );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("lesson-plan-files")
          .getPublicUrl(filePath);

        uploadedUrls[`${learnerType}_file_url`] = urlData.publicUrl;
        console.log(
          `✅ ${learnerType} file uploaded successfully:`,
          urlData.publicUrl
        );
      } catch (error) {
        console.error(`❌ Error processing ${learnerType} file:`, error);
        throw error;
      }
    }
  }

  return uploadedUrls;
}

export async function saveAdditionalInfoForm(data: {
  faculty_id: string;
  subject_id: string;
  formData: any;
}) {
  try {
    console.log("🚀 Starting saveAdditionalInfoForm with data:", {
      faculty_id: data.faculty_id,
      subject_id: data.subject_id,
    });

    const validatedData = {
      faculty_id: data.faculty_id,
      subject_id: data.subject_id,
      formData: data.formData,
    };

    // Check only the REQUIRED fields (excluding learner planning fields)
    const requiredFields = [
      "classroom_conduct",
      "attendance_policy",
      "cie_guidelines",
      "self_study_guidelines",
      "topics_beyond_syllabus",
      "reference_materials",
      "academic_integrity",
      "communication_channels",
    ];

    const missingFields = [];
    for (const field of requiredFields) {
      const value = validatedData.formData[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        missingFields.push(
          field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        );
      }
    }

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields);
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
        statusChanged: false,
      };
    }

    const supabase = await createClient();

    // Check if a form already exists for this faculty and subject
    const { data: existingForm, error: fetchError } = await supabase
      .from("forms")
      .select("id, form")
      .eq("faculty_id", validatedData.faculty_id)
      .eq("subject_id", validatedData.subject_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Error fetching existing form:", fetchError);
      return {
        success: false,
        error: fetchError.message,
        statusChanged: false,
      };
    }

    // Prepare the additional info data structure
    // ADD THIS AFTER PREPARING additionalInfoData (around line 70):
    // Handle file uploads if any
    let uploadedFileUrls = {};
    if (
      validatedData.formData.uploaded_files &&
      Object.keys(validatedData.formData.uploaded_files).length > 0
    ) {
      console.log("📤 Processing file uploads...");
      try {
        uploadedFileUrls = await uploadFilesToStorage(
          supabase,
          validatedData.formData.uploaded_files,
          validatedData.faculty_id,
          validatedData.subject_id
        );
        console.log("✅ All files uploaded successfully:", uploadedFileUrls);
      } catch (error) {
        console.error("❌ File upload failed:", error);
        return {
          success: false,
          error: `File upload failed: ${error.message}`,
          statusChanged: false,
        };
      }
    }

    const additionalInfoData = {
      faculty_id: validatedData.faculty_id,
      subject_id: validatedData.subject_id,
      classroom_conduct: validatedData.formData.classroom_conduct,
      attendance_policy: validatedData.formData.attendance_policy,
      lesson_planning_guidelines:
        validatedData.formData.lesson_planning_guidelines || "",
      cie_guidelines: validatedData.formData.cie_guidelines,
      self_study_guidelines: validatedData.formData.self_study_guidelines,
      topics_beyond_syllabus: validatedData.formData.topics_beyond_syllabus,
      reference_materials: validatedData.formData.reference_materials,
      academic_integrity: validatedData.formData.academic_integrity,
      communication_channels: validatedData.formData.communication_channels,
      interdisciplinary_integration:
        validatedData.formData.interdisciplinary_integration || "",
      fast_learner_planning: validatedData.formData.fast_learner_planning || "",
      medium_learner_planning:
        validatedData.formData.medium_learner_planning || "",
      slow_learner_planning: validatedData.formData.slow_learner_planning || "",
      events: validatedData.formData.events || [],
      completed_at: new Date().toISOString(),
      // ADD THE UPLOADED FILE URLS:
      ...uploadedFileUrls,
    };

    let formSaved = false;

    if (existingForm) {
      console.log("📝 Updating existing form...");
      // Update existing form
      const existingFormData = existingForm.form || {};
      const updatedFormData = {
        ...existingFormData,
        additionalInfo: additionalInfoData,
      };

      const { error: updateError } = await supabase
        .from("forms")
        .update({ form: updatedFormData })
        .eq("id", existingForm.id);

      if (updateError) {
        console.error("❌ Error updating form:", updateError);
        return {
          success: false,
          error: updateError.message,
          statusChanged: false,
        };
      }
      formSaved = true;
      console.log("✅ Form updated successfully");
    } else {
      console.log("📝 Creating new form...");
      // Create new form with additional info
      const formData = {
        additionalInfo: additionalInfoData,
      };

      const { error: insertError } = await supabase.from("forms").insert({
        faculty_id: validatedData.faculty_id,
        subject_id: validatedData.subject_id,
        form: formData,
      });

      if (insertError) {
        console.error("❌ Error creating form:", insertError);
        return {
          success: false,
          error: insertError.message,
          statusChanged: false,
        };
      }
      formSaved = true;
      console.log("✅ Form created successfully");
    }

    // 🆕 UPDATE SUBJECT STATUS TO SUBMITTED
    if (formSaved) {
      console.log("📊 Updating subject lesson plan status to submitted...");
      const { error: statusUpdateError } = await supabase
        .from("subjects")
        .update({ lesson_plan_status: "submitted" })
        .eq("id", validatedData.subject_id);

      if (statusUpdateError) {
        console.error("❌ Error updating subject status:", statusUpdateError);
        // Don't fail the entire operation, but log the error
      } else {
        console.log("✅ Subject lesson plan status updated to submitted");
      }
    }

    const { error: updateStatusError } = await supabase
      .from("forms")
      .update({ complete_additional: true })
      .eq("id", existingForm.id)
      .single(); 

    // Force revalidation of the lesson plans page
    revalidatePath("/dashboard/lesson-plans");

    console.log("🎉 Process completed:", {
      formSaved,
      statusChanged: formSaved,
    });

    return {
      success: true,
      data: additionalInfoData,
      statusChanged: formSaved,
      message: "Lesson plan completed! Status: Submitted",
    };
  } catch (error) {
    console.error("❌ Unexpected error saving additional info form:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      statusChanged: false,
    };
  }
}
