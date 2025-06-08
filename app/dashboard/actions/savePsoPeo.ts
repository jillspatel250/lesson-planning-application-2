"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type PSOPEOItem = {
  id: string
  label: string
  value: string
  type: "PSO" | "PEO"
}

export async function savePsoPeo(subjectId: string, psoItems: PSOPEOItem[], peoItems: PSOPEOItem[]) {
  try {
    const supabase = createClient()

    // Format the data for storage
    const psoData = psoItems.map((item) => ({
      label: item.label,
      description: item.value,
    }))

    const peoData = peoItems.map((item) => ({
      label: item.label,
      description: item.value,
    }))

    // Check if a PSO/PEO form already exists for this subject
    const { data: existingForm, error: fetchError } = await (await supabase)
      .from("forms")
      .select("id")
      .eq("subject_id", subjectId)
      .eq("form", "pso_peo_form") // Using a valid form type
      .maybeSingle()

    if (fetchError) {
      console.error("Error checking for existing PSO/PEO form:", fetchError)
      return { success: false, error: fetchError.message }
    }

    let result

    if (existingForm) {
      // Update existing form - assuming your forms table has a JSON column called 'form_json'
      result = await (await supabase)
        .from("forms")
        .update({
          form_json: { pso: psoData, peo: peoData }, // Using form_json instead of form_data
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingForm.id)
    } else {
      // Create new form
      result = await (await supabase).from("forms").insert({
        subject_id: subjectId,
        form: "pso_peo_form", // Using a valid form type
        form_json: { pso: psoData, peo: peoData }, // Using form_json instead of form_data
        created_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      console.error("Error saving PSO/PEO data:", result.error)
      return { success: false, error: result.error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error in savePsoPeo:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function fetchPsoPeo(subjectId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await (await supabase)
      .from("forms")
      .select("form_json") // Using form_json instead of form_data
      .eq("subject_id", subjectId)
      .eq("form", "pso_peo_form") // Using a valid form type
      .maybeSingle()

    if (error) {
      console.error("Error fetching PSO/PEO data:", error)
      return { success: false, error: error.message }
    }

    if (!data || !data.form_json) {
      return {
        success: true,
        data: {
          pso: [
            { label: "PSO1", description: "" },
            { label: "PSO2", description: "" },
          ],
          peo: [
            { label: "PEO1", description: "" },
            { label: "PEO2", description: "" },
          ],
        },
      }
    }

    return { success: true, data: data.form_json }
  } catch (error) {
    console.error("Error in fetchPsoPeo:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
