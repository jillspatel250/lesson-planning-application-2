"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export const updateTopicStatus = async (topicId: string, isCompleted: boolean) => {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("lesson_plan_topics")
      .update({
        is_completed: isCompleted,
      })
      .eq("id", topicId)

    if (error) {
      console.error("Error updating topic status:", error)
      return { success: false, error: error.message }
    }

    // Get the lesson plan ID to update its updated_at timestamp
    const { data: topic, error: topicError } = await supabase
      .from("lesson_plan_topics")
      .select("lesson_plan_id")
      .eq("id", topicId)
      .single()

    if (topicError) {
      console.error("Error fetching topic:", topicError)
      return { success: false, error: topicError.message }
    }

    // Update the lesson plan's updated_at timestamp
    const { error: updateError } = await supabase
      .from("lesson_plans")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", topic.lesson_plan_id)

    if (updateError) {
      console.error("Error updating lesson plan timestamp:", updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath("/dashboard/lesson-plans")
    revalidatePath(`/dashboard/lesson-plans/${topic.lesson_plan_id}`)

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating topic status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
