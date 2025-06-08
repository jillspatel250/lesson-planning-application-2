"use server"

import { createClient } from "@/utils/supabase/server"

interface PSOPEOItem {
  id: string
  label: string
  description: string
}

export async function updateSubjectPsoPeo(subjectId: string, psoItems: PSOPEOItem[], peoItems: PSOPEOItem[]) {
  try {
    const supabase = await createClient()

    // Update the subject with PSO/PEO data
    const { error } = await supabase
      .from("subjects")
      .update({
        pso: { items: psoItems },
        peo: { items: peoItems },
      })
      .eq("id", subjectId)

    if (error) {
      console.error("Error updating subject PSO/PEO:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateSubjectPsoPeo:", error)
    return { success: false, error: "Failed to update PSO/PEO data" }
  }
}
