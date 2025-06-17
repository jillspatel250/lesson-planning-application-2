"use server"


import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"


export interface PSOPEOItem {
  id: string
  label: string
  description: string
}


export interface DepartmentPsoPeoData {
  pso_data: PSOPEOItem[]
  peo_data: PSOPEOItem[]
}


export async function fetchDepartmentPsoPeo(departmentId: string) {
  try {
    const supabase = await createClient()


    const { data, error } = await supabase
      .from("department_pso_peo")
      .select("*")
      .eq("department_id", departmentId)
      .single()


    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is acceptable
      console.error("Error fetching department PSO/PEO:", error)
      return { success: false, error: error.message }
    }


    return {
      success: true,
      data: data || { pso_data: [], peo_data: [] },
    }
  } catch (error) {
    console.error("Error fetching department PSO/PEO:", error)
    return { success: false, error: "Failed to fetch PSO/PEO data" }
      }
}


export async function saveDepartmentPsoPeo(departmentId: string, psoData: PSOPEOItem[], peoData: PSOPEOItem[]) {
  try {
    const supabase = await createClient()


    // Validate data
    if (!psoData.length || !peoData.length) {
      return { success: false, error: "At least one PSO and one PEO are required" }
    }


    // Validate that all PSO items have descriptions
    if (psoData.some((item) => !item.description.trim())) {
      return { success: false, error: "All PSO items must have descriptions" }
    }


    // Validate that all PEO items have descriptions
    if (peoData.some((item) => !item.description.trim())) {
      return { success: false, error: "All PEO items must have descriptions" }
    }


    // Check if record exists
    const { data: existing, error: checkError } = await supabase
      .from("department_pso_peo")
      .select("id")
      .eq("department_id", departmentId)
      .single()


    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing record:", checkError)
      return { success: false, error: "Failed to check existing data" }
    }


    const psoPeoData = {
      department_id: departmentId,
      pso_data: psoData,
      peo_data: peoData,
      updated_at: new Date().toISOString(),
    }


    let result
    if (existing) {
      // Update existing record
      result = await supabase.from("department_pso_peo").update(psoPeoData).eq("department_id", departmentId).select()
    } else {
      // Insert new record
      result = await supabase
        .from("department_pso_peo")
        .insert({
          ...psoPeoData,
          created_at: new Date().toISOString(),
        })
        .select()
    }


    if (result.error) {
      console.error("Error saving department PSO/PEO:", result.error)
      return { success: false, error: result.error.message }
    }


    revalidatePath("/dashboard/hod")
    revalidatePath("/dashboard")
    return { success: true, data: result.data?.[0] }
  } catch (error) {
    console.error("Error saving department PSO/PEO:", error)
    return { success: false, error: "Failed to save PSO/PEO data" }
  }
}


// Function to get PSO/PEO data for a specific subject (by looking up its department)
export async function fetchSubjectPsoPeo(subjectId: string) {
  try {
    const supabase = await createClient()


    // First get the subject's department
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("department_id")
      .eq("id", subjectId)
      .single()


    if (subjectError) {
      console.error("Error fetching subject:", subjectError)
      return { success: false, error: subjectError.message }
    }


    if (!subject?.department_id) {
      return { success: false, error: "Subject department not found" }
    }


    // Then get the department's PSO/PEO data
    return await fetchDepartmentPsoPeo(subject.department_id)
  } catch (error) {
    console.error("Error fetching subject PSO/PEO:", error)
    return { success: false, error: "Failed to fetch PSO/PEO data" }
  }
}


// Function to get current user's department ID (for HOD role)
export async function getCurrentUserDepartmentId() {
  try {
    const supabase = await createClient()


    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()


    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }


    // Get user's role and department info
    const { data: userRole, error: roleError } = await supabase
      .from("user_role")
      .select(`
        depart_id,
        role_name,
        users!inner(auth_id, name, email),
        departments!inner(id, name)
      `)
      .eq("users.auth_id", user.id)
      .eq("role_name", "HOD")
      .single()


    if (roleError) {
      console.error("Error fetching HOD role:", roleError)
      return { success: false, error: "HOD role not found for current user" }
    }
    if (!userRole?.depart_id) {
      return { success: false, error: "Department information not found" }
    }


    return {
      success: true,
      departmentId: userRole.depart_id,
      departmentName: userRole.departments[0]?.name,
    }
  } catch (error) {
    console.error("Error getting user department:", error)
    return { success: false, error: "Failed to get department information" }
  }
}
