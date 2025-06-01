"use server"

// This function now calls the API route instead of directly accessing the database
export const checkFacultySharing = async (subjectId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/faculty-sharing?subjectId=${subjectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error in checkFacultySharing:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
      isSharing: false,
      allFaculty: [],
      primaryFaculty: null,
      secondaryFaculty: [],
    }
  }
}
