"use client"

import { useDashboardContext } from "@/context/DashboardContext"
import HODDashboard from "@/components/HODDashboard"
import FacultyDashboard from "@/components/FacultyDashboard"

export default function Dashboard() {
  const { roleData, currentRole } = useDashboardContext()

  // Check if user has HOD role
  const hasHODRole = roleData?.some((role) => role.role_name === "HOD")
  const hasFacultyRole = roleData?.some((role) => role.role_name === "Faculty")

  // If user only has HOD role, show HOD dashboard
  if (hasHODRole && !hasFacultyRole) {
    return <HODDashboard />
  }

  // If user has Faculty role (with or without HOD), show Faculty dashboard
  if (hasFacultyRole) {
    // Show HOD Dashboard if current role is HOD
    if (currentRole?.role_name === "HOD") {
      return <HODDashboard />
    }

    // Show Faculty Dashboard if current role is Faculty
    return <FacultyDashboard />
  }

  // Fallback
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-[#1A5CA1]">Dashboard</h1>
      <p className="text-lg text-gray-600 mt-4">No valid role found.</p>
    </div>
  )
}