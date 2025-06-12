"use server"

import { createClient } from "@/utils/supabase/server"

export async function fetchFormCompletionStatus(facultyId: string, subjectId: string) {
  try {
    console.log(`🔍 Checking form completion for faculty: ${facultyId}, subject: ${subjectId}`)

    const supabase = await createClient()

    // Check if a form with additionalInfo exists for this faculty and subject
    const { data: formData, error } = await supabase
      .from("forms")
      .select("form, id, faculty_id, subject_id")
      .eq("faculty_id", facultyId)
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching form:", error)
      return { hasAdditionalInfo: false }
    }

    console.log(`📋 Form data found:`, formData)

    // If no form data found
    if (!formData || formData.length === 0) {
      console.log("❌ No form data found")
      return { hasAdditionalInfo: false }
    }

    // Check if additionalInfo exists in any of the forms
    const hasAdditionalInfo = formData.some((form) => {
      const formContent = form.form
      return (
        formContent &&
        typeof formContent === "object" &&
        "additionalInfo" in formContent &&
        formContent.additionalInfo !== null &&
        formContent.additionalInfo.completed_at
      )
    })

    console.log(`📊 Form completion status:`, {
      formsFound: formData.length,
      hasAdditionalInfo,
      formIds: formData.map((f) => f.id),
    })

    return { hasAdditionalInfo: !!hasAdditionalInfo }
  } catch (error) {
    console.error("❌ Error checking form completion:", error)
    return { hasAdditionalInfo: false }
  }
}
