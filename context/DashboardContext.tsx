"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserData = {
  id: string
  auth_id: string
  email: string
  profile_photo: string | null
  name: string
}

export type RoleDataItem = {
  id: string
  role_name: string
  user_id: string
  depart_id: string
  departments: {
    id: string
    name: string
    abbreviation_depart: string
    institutes: {
      id: string
      name: string
      abbreviation_insti: string
    }
  }
}

interface DashboardContextType {
  userData: UserData
  roleData: RoleDataItem[]
  currentRole: RoleDataItem
  setCurrentRole: (role: RoleDataItem) => void
  updateUserData: (newData: Partial<UserData>) => void // Added this function
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export const DashboardProvider = ({
  children,
  value,
}: {
  children: ReactNode
  value: Omit<DashboardContextType, "currentRole" | "setCurrentRole" | "updateUserData"> // Updated type
}) => {
  const [currentRole, setCurrentRoleState] = useState<RoleDataItem>(value.roleData[0])
  const [userData, setUserData] = useState<UserData>(value.userData) // Add state for userData

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRoleId = localStorage.getItem("currentRoleId")
      if (savedRoleId) {
        const savedRole = value.roleData.find((role) => role.id === savedRoleId)
        if (savedRole) {
          setCurrentRoleState(savedRole)
        }
      }
    }
  }, [value.roleData])

  // Update userData when value.userData changes (from props)
  useEffect(() => {
    setUserData(value.userData)
  }, [value.userData])

  const setCurrentRole = (role: RoleDataItem) => {
    setCurrentRoleState(role)
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentRoleId", role.id)
    }
  }

  // Add updateUserData function
  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }))
  }

  return (
    <DashboardContext.Provider
      value={{
        ...value,
        userData, // Use state instead of value.userData
        currentRole,
        setCurrentRole,
        updateUserData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboardContext must be used within DashboardProvider")
  }
  return context
}
