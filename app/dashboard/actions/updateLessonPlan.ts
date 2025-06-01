"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type Topic = {
  id: string
  title: string
  description: string
  hours: number
  order: number
  is_completed: boolean
  isNew?: boolean
  isDeleted?: boolean
}

type UpdateLessonPlanData = {
  id: string
  topics: Topic[]
}

export async function updateLessonPlan(data: UpdateLessonPlanData) {
  try {
    const supabase = await createClient()

    // Update the lesson plan's updated_at timestamp
    const { error: updateError } = await supabase
      .from("lesson_plans")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)

    if (updateError) {
      console.error("Error updating lesson plan:", updateError)
      return { success: false, error: updateError.message }
    }

    // Handle existing topics that need to be updated
    const existingTopics = data.topics.filter((topic) => !topic.isNew && !topic.isDeleted)

    for (const topic of existingTopics) {
      const { error } = await supabase
        .from("lesson_plan_topics")
        .update({
          title: topic.title,
          description: topic.description,
          hours: topic.hours,
          order: topic.order,
        })
        .eq("id", topic.id)

      if (error) {
        console.error("Error updating topic:", error)
        return { success: false, error: error.message }
      }
    }

    // Handle new topics that need to be created
    const newTopics = data.topics.filter((topic) => topic.isNew && !topic.isDeleted)

    if (newTopics.length > 0) {
      const topicsToInsert = newTopics.map((topic) => ({
        lesson_plan_id: data.id,
        title: topic.title,
        description: topic.description,
        hours: topic.hours,
        order: topic.order,
        is_completed: topic.is_completed,
      }))

      const { error } = await supabase.from("lesson_plan_topics").insert(topicsToInsert)

      if (error) {
        console.error("Error creating new topics:", error)
        return { success: false, error: error.message }
      }
    }

    // Handle topics that need to be deleted
    const deletedTopics = data.topics.filter((topic) => topic.isDeleted && !topic.isNew)

    for (const topic of deletedTopics) {
      const { error } = await supabase.from("lesson_plan_topics").delete().eq("id", topic.id)

      if (error) {
        console.error("Error deleting topic:", error)
        return { success: false, error: error.message }
      }
    }

    revalidatePath("/dashboard/lesson-plans")
    revalidatePath(`/dashboard/lesson-plans/${data.id}`)

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating lesson plan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
