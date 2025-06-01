"use client"

import HODDashboard from "@/components/HODDashboard"
import { useDashboardContext } from "@/context/DashboardContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HODPage() {
  const { roleData, currentRole, setCurrentRole } = useDashboardContext()
  const router = useRouter()

  useEffect(() => {
    // Check if user has HOD role
    const hodRole = roleData?.find((role) => role.role_name === "HOD")

    if (!hodRole) {
      // If user doesn't have HOD role, redirect to main dashboard
      router.push("/dashboard")
      return
    }

    // Set HOD role as current if not already set
    if (currentRole?.role_name !== "HOD") {
      setCurrentRole(hodRole)
    }
  }, [roleData, currentRole, setCurrentRole, router])

  // Check if user has HOD role
  const hasHODRole = roleData?.some((role) => role.role_name === "HOD")

  if (!hasHODRole) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 mt-4">You don't have permission to access the HOD dashboard.</p>
      </div>
    )
  }

  return <HODDashboard />
}
