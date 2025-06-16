import type React from "react"
import { AuthProvider } from "@/lib/AuthContext"
import { DashboardProvider } from "@/context/DashboardContext"
import { createClient } from "@/utils/supabase/server"
import { signOut } from "../actions/auth"
import FacultySidebar from "@/components/FacultySidebar"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Authentication error or user not found:", authError)
    redirect("/auth/login")
  }

  const { data: userData, error: userError } = await supabase.from("users").select("*").eq("auth_id", user.id).single()

  if (userError || !userData) {
    console.error("Error fetching user data:", userError)
    redirect("/auth/login")
  }

  // Try multiple approaches to find the role data
  const { data: roleDataWithUserId, error: roleErrorWithUserId } = await supabase
    .from("user_role")
    .select("*, departments(*, institutes(*))")
    .eq("user_id", userData.id)

  const { data: roleDataWithAuthId, error: roleErrorWithAuthId } = await supabase
    .from("user_role")
    .select("*, departments(*, institutes(*))")
    .eq("user_id", userData.auth_id)

  const { data: roleDataWithSupabaseId, error: roleErrorWithSupabaseId } = await supabase
    .from("user_role")
    .select("*, departments(*, institutes(*))")
    .eq("user_id", user.id)

  // Use whichever query returns data
  let roleData = null
  let roleError = null

  if (roleDataWithUserId && roleDataWithUserId.length > 0) {
    roleData = roleDataWithUserId
    roleError = roleErrorWithUserId
  } else if (roleDataWithAuthId && roleDataWithAuthId.length > 0) {
    roleData = roleDataWithAuthId
    roleError = roleErrorWithAuthId
  } else if (roleDataWithSupabaseId && roleDataWithSupabaseId.length > 0) {
    roleData = roleDataWithSupabaseId
    roleError = roleErrorWithSupabaseId
  } else {
    roleError = roleErrorWithUserId || roleErrorWithAuthId || roleErrorWithSupabaseId
  }

  if (roleError) {
    console.error("Error fetching role data:", roleError)
  }

  if (!roleData || roleData.length === 0) {
    console.error("User has no roles assigned")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have any roles assigned. Please contact your administrator.</p>
          <div className="bg-gray-100 p-4 rounded mb-4 text-left text-sm">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>
              <strong>Auth ID:</strong> {user.id}
            </p>
            <p>
              <strong>DB User ID:</strong> {userData.id}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
          </div>
          <form action={signOut}>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Check user roles
  const hasHODRole = roleData?.some((role) => role.role_name === "HOD")
  const hasFacultyRole = roleData?.some((role) => role.role_name === "Faculty")
  const hasPrincipalRole = roleData?.some((role) => role.role_name === "Principal")

  // Determine which sidebar to show based on roles
  const showFacultySidebar = hasFacultyRole
  const showHODSidebar = hasHODRole && !hasFacultyRole
  const showPrincipalSidebar = hasPrincipalRole

  return (
    <AuthProvider>
      <DashboardProvider value={{ userData, roleData: roleData || [] }}>
        <div className="flex h-screen bg-gray-100">
          {showFacultySidebar && <FacultySidebar signOut={signOut} />}
          {showHODSidebar && <CollapsibleSidebar signOut={signOut} />}
          {showPrincipalSidebar && <CollapsibleSidebar signOut={signOut} />}
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${showHODSidebar ? "p-5" : ""}`}>
            {children}
          </main>
        </div>
      </DashboardProvider>
    </AuthProvider>
  )
}
