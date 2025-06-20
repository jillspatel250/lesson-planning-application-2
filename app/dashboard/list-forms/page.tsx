/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/server"
import FormsTable from "./forms-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Loading component for the forms table
function FormsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[300px]" />
      </div>
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

async function FormsContent() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return <div className="text-red-600">Authentication error. Please log in again.</div>
  }

  // Fetch user role data with better error handling
  const { data: userData, error: userError } = await supabase
    .from("user_role")
    .select(`
      *,
      departments(*),
      institutes(*)
    `)
    .eq("user_id", user.id)

  if (userError) {
    console.error("Error fetching user roles:", userError)
    return <div className="text-red-600">Error loading user roles. Please try again later.</div>
  }

  if (!userData || userData.length === 0) {
    return <div className="text-yellow-600">No role assigned. Please contact administrator.</div>
  }

  const userRole = userData[0]
  const isPrincipal = userRole?.role_name === "Principal"
  const isHOD = userData.some((role) => role.role_name === "HOD")

  if (!isPrincipal && !isHOD) {
    return <div className="text-red-600">You are not authorized to access this page.</div>
  }

  // Use the original working query structure
  let formsQuery = supabase.from("forms").select(`
    *,
    users(*),
    subjects(*, departments(*, institutes(*)))
  `)

  // Apply role-based filtering at database level for better performance
  if (isHOD && userRole.depart_id) {
    // HOD: Filter by their department through subjects
    formsQuery = formsQuery.eq("subjects.department_id", userRole.depart_id)
  } else if (isPrincipal && userRole.institute) {
    // Principal: Filter by their institute through departments
    formsQuery = formsQuery.eq("subjects.departments.institute_id", userRole.institute)
  }

  const { data: forms, error: formsError } = await formsQuery

  if (formsError) {
    console.error("Error fetching forms:", formsError)
    return <div className="text-red-600">Error loading forms. Please try again later.</div>
  }

  // Filter out forms with null/invalid data to prevent production errors
  const validForms = (forms || []).filter((form) => {
    return (
      form &&
      form.users &&
      form.users.name &&
      form.subjects &&
      form.subjects.name &&
      form.subjects.departments &&
      form.subjects.departments.name
    )
  })

  // Fetch departments based on user role
  let departmentsData: any[] = []
  if (isPrincipal && userRole.institute) {
    // Principal: Get departments from their institute only
    const { data: instituteDepartments } = await supabase
      .from("departments")
      .select("*")
      .eq("institute_id", userRole.institute)
      .order("name")

    departmentsData = instituteDepartments || []
  } else if (isHOD && userRole.depart_id) {
    // HOD: Get only their department
    const { data: hodDepartment } = await supabase.from("departments").select("*").eq("id", userRole.depart_id)

    departmentsData = hodDepartment || []
  }

  return <FormsTable forms={validForms} userrole={userData} allDepartments={departmentsData} />
}

export default async function DepartmentFormsPage() {
  return (
    <div className="mx-4 mt-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
            List of Lesson Planning Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<FormsTableSkeleton />}>
            <FormsContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}



