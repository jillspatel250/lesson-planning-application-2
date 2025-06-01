// import { type NextRequest, NextResponse } from "next/server"
// import { createClient } from "@/utils/supabase/server"

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const subjectId = searchParams.get("subjectId")

//   if (!subjectId) {
//     return NextResponse.json({ success: false, error: "Subject ID is required" }, { status: 400 })
//   }

//   const supabase = await createClient()

//   try {
//     // Get all faculty assignments for this subject
//     const { data: facultyAssignments, error: assignmentError } = await supabase
//       .from("user_role")
//       .select(`
//         id,
//         user_id,
//         role_name,
//         depart_id,
//         subject_id,
//         academic_year,
//         division,
//         users:user_id(
//           id,
//           name,
//           email,
//           profile_photo
//         )
//       `)
//       .eq("subject_id", subjectId)
//       .eq("role_name", "Faculty")
//       .not("users", "is", null)

//     if (assignmentError) {
//       console.error("Error fetching faculty assignments:", assignmentError)
//       return NextResponse.json({
//         success: false,
//         error: "Failed to fetch faculty assignments",
//         isSharing: false,
//         allFaculty: [],
//         primaryFaculty: null,
//         secondaryFaculty: [],
//       })
//     }

//     console.log("Faculty assignments found:", facultyAssignments)

//     if (!facultyAssignments || facultyAssignments.length === 0) {
//       return NextResponse.json({
//         success: true,
//         isSharing: false,
//         allFaculty: [],
//         primaryFaculty: null,
//         secondaryFaculty: [],
//       })
//     }

//     // Group by division to check for sharing within same division
//     const divisionGroups = facultyAssignments.reduce(
//       (acc, assignment) => {
//         const division = assignment.division || "default"
//         if (!acc[division]) {
//           acc[division] = []
//         }
//         acc[division].push(assignment)
//         return acc
//       },
//       {} as Record<string, any[]>,
//     )

//     // Check if any division has multiple faculty (sharing within same division)
//     let isSharing = false
//     let sharedFaculty: any[] = []

//     for (const [division, assignments] of Object.entries(divisionGroups)) {
//       if (assignments.length > 1) {
//         isSharing = true
//         // Get unique faculty for this division
//         const uniqueFaculty = assignments.reduce((acc, assignment) => {
//           const facultyId = assignment.users?.id
//           if (facultyId && !acc.find((f: any) => f.id === facultyId)) {
//             acc.push({
//               id: facultyId,
//               name: assignment.users.name,
//               email: assignment.users.email,
//               profile_photo: assignment.users.profile_photo,
//               division: division,
//               assignment_id: assignment.id,
//             })
//           }
//           return acc
//         }, [])

//         sharedFaculty = [...sharedFaculty, ...uniqueFaculty]
//         break // We found sharing in at least one division, that's enough
//       }
//     }

//     // If no sharing within same division found, check if there are faculty in different divisions
//     // but don't mark as sharing (this is the key change)
//     if (!isSharing) {
//       // Just return all faculty for informational purposes, but not as "sharing"
//       const allFaculty = facultyAssignments.reduce((acc, assignment) => {
//         const facultyId = assignment.users?.id
//         if (facultyId && !acc.find((f: any) => f.id === facultyId)) {
//           acc.push({
//             id: facultyId,
//             name: assignment.users.name,
//             email: assignment.users.email,
//             profile_photo: assignment.users.profile_photo,
//             division: assignment.division || "default",
//             assignment_id: assignment.id,
//           })
//         }
//         return acc
//       }, [])

//       console.log("No sharing detected - faculty in different divisions:", allFaculty)

//       return NextResponse.json({
//         success: true,
//         isSharing: false,
//         allFaculty: allFaculty,
//         primaryFaculty: allFaculty[0] || null,
//         secondaryFaculty: allFaculty.slice(1),
//       })
//     }

//     // Remove duplicates from sharedFaculty
//     const allFaculty = sharedFaculty.reduce((acc, faculty) => {
//       if (!acc.find((f: any) => f.id === faculty.id)) {
//         acc.push(faculty)
//       }
//       return acc
//     }, [])

//     console.log("Sharing detected within same division:", allFaculty)

//     const primaryFaculty = allFaculty[0] || null
//     const secondaryFaculty = allFaculty.slice(1)

//     return NextResponse.json({
//       success: true,
//       isSharing,
//       allFaculty,
//       primaryFaculty,
//       secondaryFaculty,
//     })
//   } catch (error) {
//     console.error("Error in checkFacultySharing:", error)
//     return NextResponse.json({
//       success: false,
//       error: "An unexpected error occurred",
//       isSharing: false,
//       allFaculty: [],
//       primaryFaculty: null,
//       secondaryFaculty: [],
//     })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// Define a type for faculty member
interface FacultyMember {
  id: string;
  name: string;
  email: string;
  profile_photo: string | null;
  division: string;
  assignment_id: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subjectId = searchParams.get("subjectId")

  if (!subjectId) {
    return NextResponse.json({ success: false, error: "Subject ID is required" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    // Get all faculty assignments for this subject
    const { data: facultyAssignments, error: assignmentError } = await supabase
      .from("user_role")
      .select(`
        id,
        user_id,
        role_name,
        depart_id,
        subject_id,
        academic_year,
        division,
        users:user_id(
          id,
          name,
          email,
          profile_photo
        )
      `)
      .eq("subject_id", subjectId)
      .eq("role_name", "Faculty")
      .not("users", "is", null)

    if (assignmentError) {
      console.error("Error fetching faculty assignments:", assignmentError)
      return NextResponse.json({
        success: false,
        error: "Failed to fetch faculty assignments",
        isSharing: false,
        allFaculty: [],
        primaryFaculty: null,
        secondaryFaculty: [],
      })
    }

    console.log("Faculty assignments found:", facultyAssignments)

    if (!facultyAssignments || facultyAssignments.length === 0) {
      return NextResponse.json({
        success: true,
        isSharing: false,
        allFaculty: [],
        primaryFaculty: null,
        secondaryFaculty: [],
      })
    }

    // Group by division to check for sharing within same division
    const divisionGroups = facultyAssignments.reduce(
      (acc, assignment) => {
        const division = assignment.division || "default"
        if (!acc[division]) {
          acc[division] = []
        }
        acc[division].push(assignment)
        return acc
      },
      {} as Record<string, any[]>,
    )

    // Check if any division has multiple faculty (sharing within same division)
    let isSharing = false
    let sharedFaculty: FacultyMember[] = []

    for (const [division, assignments] of Object.entries(divisionGroups)) {
      if (assignments.length > 1) {
        isSharing = true
        // Get unique faculty for this division
        const uniqueFaculty = assignments.reduce((acc: FacultyMember[], assignment: any) => {
          const facultyUser = assignment.users as {
            id: string;
            name: string;
            email: string;
            profile_photo: string | null;
          }
        
          const facultyId = facultyUser?.id;
          if (facultyId && !acc.find((f) => f.id === facultyId)) {
            acc.push({
              id: facultyId,
              name: facultyUser.name,
              email: facultyUser.email,
              profile_photo: facultyUser.profile_photo,
              division: division,
              assignment_id: assignment.id,
            })
          }
          return acc;
        }, [])
        

        sharedFaculty = [...sharedFaculty, ...uniqueFaculty]
        break // We found sharing in at least one division, that's enough
      }
    }

    // If no sharing within same division found, check if there are faculty in different divisions
    // but don't mark as sharing (this is the key change)
    if (!isSharing) {
      // Just return all faculty for informational purposes, but not as "sharing"
      const allFaculty = facultyAssignments.reduce((acc: FacultyMember[], assignment: any) => {
        const facultyUser = assignment.users as {
          id: string;
          name: string;
          email: string;
          profile_photo: string | null;
        }
      
        const facultyId = facultyUser?.id;
        if (facultyId && !acc.find((f) => f.id === facultyId)) {
          acc.push({
            id: facultyId,
            name: facultyUser.name,
            email: facultyUser.email,
            profile_photo: facultyUser.profile_photo,
            division: assignment.division || "default",
            assignment_id: assignment.id,
          })
        }
        return acc;
      }, []);
      

      console.log("No sharing detected - faculty in different divisions:", allFaculty)

      return NextResponse.json({
        success: true,
        isSharing: false,
        allFaculty: allFaculty,
        primaryFaculty: allFaculty[0] || null,
        secondaryFaculty: allFaculty.slice(1),
      })
    }

    // Remove duplicates from sharedFaculty
    const allFaculty = sharedFaculty.reduce((acc: FacultyMember[], faculty) => {
      if (!acc.find((f) => f.id === faculty.id)) {
        acc.push(faculty)
      }
      return acc
    }, [])

    console.log("Sharing detected within same division:", allFaculty)

    const primaryFaculty = allFaculty[0] || null
    const secondaryFaculty = allFaculty.slice(1)

    return NextResponse.json({
      success: true,
      isSharing,
      allFaculty,
      primaryFaculty,
      secondaryFaculty,
    })
  } catch (error) {
    console.error("Error in checkFacultySharing:", error)
    return NextResponse.json({
      success: false,
      error: "An unexpected error occurred",
      isSharing: false,
      allFaculty: [],
      primaryFaculty: null,
      secondaryFaculty: [],
    })
  }
}