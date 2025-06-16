/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/server"
import FormsTable from "./forms-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DepartmentFormsPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return <div>Authentication error. Please log in again.</div>
  }

  // Fetch forms with related data
  const { data: forms, error } = await supabase.from("forms").select(`
      *,
      users(*),
      subjects(*, departments(*, institutes(*)))
    `)

  if (error) {
    console.error("Error fetching forms:", error)
    return <div>Error loading forms. Please try again later.</div>
  }

  // Fetch user role data
  const { data: userData, error: userError } = await supabase
    .from("user_role")
    .select("*, departments(*)")
    .eq("user_id", user.id)

  if (userError) {
    console.error("Error fetching user roles:", userError)
    return <div>Error loading user roles. Please try again later.</div>
  }

  // Fetch all departments for principal users
  const { data: allDepartments } = await supabase.from("departments").select("*").order("name")

  return (
    <div className="mx-4 mt-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">List of Lesson Planning Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <FormsTable forms={forms || []} userrole={userData || []} allDepartments={allDepartments || []} />
        </CardContent>
      </Card>
    </div>
  )
}
