"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSubject(formData: FormData) {
  try {
    const supabase = createClient();

    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const semester = Number.parseInt(formData.get("semester") as string);
    const lectureHours = Number.parseInt(
      formData.get("lectureHours") as string
    );
    const labHours = Number.parseInt(formData.get("labHours") as string);
    const abbreviationName = formData.get("abbreviationName") as string;
    const credits = Number.parseInt(formData.get("credits") as string);
    const departmentId = formData.get("departmentId") as string;
    const isPractical = formData.get("isPractical") === "true";
    const isTheory = formData.get("isTheory") === "true";
    const termStartDate = formData.get("termStartDate") as string;
    const termEndDate = formData.get("termEndDate") as string;

    // Prepare metadata object
    const metadata: any = {};
    if (termStartDate) {
      metadata.term_start_date = termStartDate;
    }
    if (termEndDate) {
      metadata.term_end_date = termEndDate;
    }

    const { data, error } = await (
      await supabase
    )
      .from("subjects")
      .insert({
        code,
        name,
        semester,
        lecture_hours: lectureHours,
        lab_hours: labHours,
        abbreviation_name: abbreviationName,
        credits,
        department_id: departmentId,
        is_practical: isPractical,
        is_theory: isTheory,
        metadata,
      })
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true, data };
  } catch (error) {
    console.error("Error adding subject:", error);
    return { success: false, error: "Failed to add subject" };
  }
}

export async function deleteSubject(id: string) {
  console.log("Deleting subject with ID:", id);
  try {
    const supabase = createClient();

    // First, find all faculty members who teach only this subject
    const { data: facultyWithOnlyThisSubject, error: facultyError } = await (
      await supabase
    )
      .from("user_role")
      .select("id, user_id")
      .eq("subject_id", id)
      .eq("role_name", "Faculty");

    if (facultyError) {
      console.error("Error finding faculty with this subject:", facultyError);
      return { success: false, error: facultyError.message };
    }

    // For each faculty member who teaches only this subject, update their record to remove the subject
    if (facultyWithOnlyThisSubject && facultyWithOnlyThisSubject.length > 0) {
      for (const faculty of facultyWithOnlyThisSubject) {
        const { error: updateError } = await (await supabase)
          .from("user_role")
          .update({ subject_id: null })
          .eq("id", faculty.id);

        if (updateError) {
          console.error("Error updating faculty record:", updateError);
          return { success: false, error: updateError.message };
        }
      }
    }

    const { error: deleteFormError } = await (await supabase)
      .from("forms")
      .delete()
      .eq("subject_id", id);

    if (deleteFormError) {
      console.error("Error deleting subject from subjects table:", deleteFormError);
      return { success: false, error: deleteFormError.message };
    }

    // Now delete the subject
    const { error: deleteError } = await (await supabase)
      .from("subjects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting subject:", deleteError);
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error: "Failed to delete subject" };
  }
}
