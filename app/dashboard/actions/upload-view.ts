"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function uploadSyllabus(file: File, subjectId: string, userId: string) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const timestamp = new Date().getTime()
    const fileName = `syllabus_${subjectId}_${userId}_${timestamp}.pdf`
    const filePath = `syllabus/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { success: false, error: uploadError.message }
    }

    const { error: dbError } = await supabase.from("syllabus").upsert({
      subject_id: subjectId,
      user_id: userId,
      file_name: fileName,
      file_path: filePath,
      uploaded_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
    }

    return { success: true, filePath }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

export async function viewSyllabus(subjectId: string, userId: string) {
  try {
    const { data: syllabusData, error: dbError } = await supabase
      .from("syllabus")
      .select("file_path")
      .eq("subject_id", subjectId)
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single()

    let filePath: string

    if (dbError || !syllabusData) {
      const { data: files, error: listError } = await supabase.storage.from("documents").list("syllabus", {
        search: `syllabus_${subjectId}_${userId}`,
      })

      if (listError || !files || files.length === 0) {
        return { success: false, error: "No syllabus found for this subject" }
      }

      const mostRecentFile = files.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0]

      filePath = `syllabus/${mostRecentFile.name}`
    } else {
      filePath = syllabusData.file_path
    }

    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 7200) 

    if (urlError) {
      console.error("URL generation error:", urlError)
      return { success: false, error: "Failed to generate viewing URL" }
    }

    return { success: true, url: signedUrlData.signedUrl }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Failed to retrieve syllabus" }
  }
}
