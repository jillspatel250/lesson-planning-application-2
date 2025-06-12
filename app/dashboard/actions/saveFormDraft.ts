//@ts-nocheck

"use server"

import { createClient } from "@/utils/supabase/server"

export async function saveFormDraft(facultyId: string, subjectId: string, formType: string, formData: any) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Get the user from the users table using auth_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    // Check if the authenticated user matches the faculty ID
    if (userData.id !== facultyId) {
      throw new Error("Unauthorized")
    }

    // Get existing record to preserve other form types
    const { data: existingRecord } = await supabase
      .from("forms")
      .select("form")
      .eq("faculty_id", facultyId)
      .eq("subject_id", subjectId)
      .single()

    // Prepare the combined form data
    let combinedFormData = {}

    // If there's existing data, preserve it
    if (existingRecord?.form) {
      combinedFormData = { ...existingRecord.form }
    }

    // Add/update the current form type
    combinedFormData[formType] = {
      ...formData,
      savedAt: new Date().toISOString(),
    }

    console.log(`Saving ${formType} draft:`, formData)
    console.log("Combined form data:", combinedFormData)

    let result
    if (existingRecord) {
      // Update existing record
      result = await supabase
        .from("forms")
        .update({
          form: combinedFormData,
          created_at: new Date().toISOString(),
        })
        .eq("faculty_id", facultyId)
        .eq("subject_id", subjectId)
        .select()
    } else {
      // Insert new record
      result = await supabase
        .from("forms")
        .insert({
          faculty_id: facultyId,
          subject_id: subjectId,
          form: combinedFormData,
          created_at: new Date().toISOString(),
        })
        .select()
    }

    if (result.error) {
      console.error("Error saving form draft:", result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error in saveFormDraft:", error)
    return { success: false, error: error.message }
  }
}

export async function loadFormDraft(facultyId: string, subjectId: string, formType: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Get the user from the users table using auth_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    // Check if the authenticated user matches the faculty ID
    if (userData.id !== facultyId) {
      throw new Error("Unauthorized")
    }

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("faculty_id", facultyId)
      .eq("subject_id", subjectId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error loading form draft:", error)
      return { success: false, error: error.message }
    }

    // Extract the specific form type data if it exists
    const allFormData = data?.form
    if (allFormData && allFormData[formType]) {
      console.log(`Loading ${formType} draft:`, allFormData[formType])
      return { success: true, data: allFormData[formType] }
    }

    return { success: true, data: null }
  } catch (error) {
    console.error("Error in loadFormDraft:", error)
    return { success: false, error: error.message }
  }
}

export async function loadAllFormDrafts(facultyId: string, subjectId: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Get the user from the users table using auth_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    // Check if the authenticated user matches the faculty ID
    if (userData.id !== facultyId) {
      throw new Error("Unauthorized")
    }

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("faculty_id", facultyId)
      .eq("subject_id", subjectId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error loading all form drafts:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data?.form || {} }
  } catch (error) {
    console.error("Error in loadAllFormDrafts:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteFormDraft(facultyId: string, subjectId: string, formType: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Get the user from the users table using auth_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    // Check if the authenticated user matches the faculty ID
    if (userData.id !== facultyId) {
      throw new Error("Unauthorized")
    }

    // Get existing record
    const { data: existingRecord } = await supabase
      .from("forms")
      .select("form")
      .eq("faculty_id", facultyId)
      .eq("subject_id", subjectId)
      .single()

    if (existingRecord?.form) {
      const updatedForm = { ...existingRecord.form }
      delete updatedForm[formType]

      // If no form types left, delete the entire record
      if (Object.keys(updatedForm).length === 0) {
        const { error } = await supabase.from("forms").delete().eq("faculty_id", facultyId).eq("subject_id", subjectId)

        if (error) {
          console.error("Error deleting form draft:", error)
          return { success: false, error: error.message }
        }
      } else {
        // Update with remaining form types
        const { error } = await supabase
          .from("forms")
          .update({ form: updatedForm })
          .eq("faculty_id", facultyId)
          .eq("subject_id", subjectId)

        if (error) {
          console.error("Error updating form draft:", error)
          return { success: false, error: error.message }
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteFormDraft:", error)
    return { success: false, error: error.message }
  }
}
