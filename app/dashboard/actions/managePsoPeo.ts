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

    // Check if record exists
    const { data: existing } = await supabase
      .from("department_pso_peo")
      .select("id")
      .eq("department_id", departmentId)
      .single()

    const psoPeoData = {
      department_id: departmentId,
      pso_data: psoData,
      peo_data: peoData,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing) {
      // Update existing record
      result = await supabase.from("department_pso_peo").update(psoPeoData).eq("department_id", departmentId)
    } else {
      // Insert new record
      result = await supabase.from("department_pso_peo").insert({
        ...psoPeoData,
        created_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      console.error("Error saving department PSO/PEO:", result.error)
      return { success: false, error: result.error.message }
    }

    revalidatePath("/dashboard/pso-peo")
    return { success: true }
  } catch (error) {
    console.error("Error saving department PSO/PEO:", error)
    return { success: false, error: "Failed to save PSO/PEO data" }
  }
}
