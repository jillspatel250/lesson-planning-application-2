"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"

interface PsoPeoManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PsoItem {
  id: string
  label: string
  description: string
}

interface PeoItem {
  id: string
  label: string
  description: string
}

export default function PsoPeoManagementModal({ isOpen, onClose }: PsoPeoManagementModalProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [psoItems, setPsoItems] = useState<PsoItem[]>([{ id: "pso1", label: "PSO1", description: "" }])
  const [peoItems, setPeoItems] = useState<PeoItem[]>([{ id: "peo1", label: "PEO1", description: "" }])
  const [hodDepartmentId, setHodDepartmentId] = useState<string | null>(null)

  // Get current HOD's department when modal opens
  useEffect(() => {
    if (isOpen) {
      getCurrentHodDepartment()
    }
  }, [isOpen])

  // Load PSO/PEO data when department is found
  useEffect(() => {
    if (hodDepartmentId) {
      loadDepartmentPsoPeo()
    }
  }, [hodDepartmentId])

  // Get current HOD's department from user_role table
  const getCurrentHodDepartment = async () => {
    setLoading(true)
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error("User not authenticated")
        return
      }

      // Get user's role and department info
      const { data: userRole, error: roleError } = await supabase
        .from("user_role")
        .select(`
          *,
          users!inner(auth_id, name, email),
          departments!inner(id, name)
        `)
        .eq("users.auth_id", user.id)
        .eq("role_name", "HOD")
        .single()

      if (roleError) {
        console.error("Error fetching HOD role:", roleError)
        toast.error("Department information not found")
        return
      }

      if (userRole && userRole.depart_id) {
        setHodDepartmentId(userRole.depart_id)
      } else {
        toast.error("Department information not found")
      }
    } catch (error) {
      console.error("Error getting HOD department:", error)
      toast.error("Failed to load department information")
    } finally {
      setLoading(false)
    }
  }

  // Load PSO/PEO data from any subject in the department
  const loadDepartmentPsoPeo = async () => {
    if (!hodDepartmentId) return

    try {
      // Get any subject from the department to load existing PSO/PEO data
      const { data, error } = await supabase
        .from("subjects")
        .select("pso, peo")
        .eq("department_id", hodDepartmentId)
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error loading department PSO/PEO:", error)
        return
      }

      if (data) {
        // Load PSO data
        if (data.pso?.items && data.pso.items.length > 0) {
          setPsoItems(data.pso.items)
        }

        // Load PEO data
        if (data.peo?.items && data.peo.items.length > 0) {
          setPeoItems(data.peo.items)
        }
      }
    } catch (error) {
      console.error("Error loading PSO/PEO data:", error)
    }
  }

  // Add new PSO item
  const addPsoItem = () => {
    const newId = `pso${psoItems.length + 1}`
    const newLabel = `PSO${psoItems.length + 1}`
    setPsoItems([...psoItems, { id: newId, label: newLabel, description: "" }])
  }

  // Add new PEO item
  const addPeoItem = () => {
    const newId = `peo${peoItems.length + 1}`
    const newLabel = `PEO${peoItems.length + 1}`
    setPeoItems([...peoItems, { id: newId, label: newLabel, description: "" }])
  }

  // Update PSO item description
  const updatePsoDescription = (id: string, description: string) => {
    setPsoItems(psoItems.map((item) => (item.id === id ? { ...item, description } : item)))
  }

  // Update PEO item description
  const updatePeoDescription = (id: string, description: string) => {
    setPeoItems(peoItems.map((item) => (item.id === id ? { ...item, description } : item)))
  }

  // Remove PSO item
  const removePsoItem = (id: string) => {
    if (psoItems.length > 1) {
      setPsoItems(psoItems.filter((item) => item.id !== id))
    } else {
      toast.error("At least one PSO item is required")
    }
  }

  // Remove PEO item
  const removePeoItem = (id: string) => {
    if (peoItems.length > 1) {
      setPeoItems(peoItems.filter((item) => item.id !== id))
    } else {
      toast.error("At least one PEO item is required")
    }
  }

  // Save PSO/PEO data to ALL subjects in the department
  const savePsoPeoData = async () => {
    if (!hodDepartmentId) {
      toast.error("Department information not found")
      return
    }

    // Validate PSO items
    if (psoItems.some((item) => !item.description.trim())) {
      toast.error("Please fill in all PSO descriptions")
      return
    }

    // Validate PEO items
    if (peoItems.some((item) => !item.description.trim())) {
      toast.error("Please fill in all PEO descriptions")
      return
    }

    setSaving(true)
    try {
      // Update ALL subjects in the department with the same PSO/PEO data
      const { error } = await supabase
        .from("subjects")
        .update({
          pso: { items: psoItems },
          peo: { items: peoItems },
        })
        .eq("department_id", hodDepartmentId)

      if (error) {
        throw error
      }

      toast.success("PSO/PEO data saved successfully for all subjects in the department")
      onClose() // Close modal after successful save
    } catch (error) {
      console.error("Error saving PSO/PEO data:", error)
      toast.error("Failed to save PSO/PEO data")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading department information...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!hodDepartmentId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Access Denied</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Department information not found. Please ensure you are logged in as an HOD.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">PSO/PEO Management</DialogTitle>
          <p className="text-sm text-gray-600">Manage PSO/PEO for all subjects in your department</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PSO Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Program Specific Outcome</h3>
              <Button variant="ghost" size="icon" onClick={addPsoItem} className="h-8 w-8 rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {psoItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-16 bg-gray-100 p-2 text-center rounded-md font-medium">{item.label}</div>
                  <Input
                    value={item.description}
                    onChange={(e) => updatePsoDescription(item.id, e.target.value)}
                    placeholder="Enter PSO description"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePsoItem(item.id)}
                    className="h-8 w-8 bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* PEO Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Program Educational Objective</h3>
              <Button variant="ghost" size="icon" onClick={addPeoItem} className="h-8 w-8 rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {peoItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-16 bg-gray-100 p-2 text-center rounded-md font-medium">{item.label}</div>
                  <Input
                    value={item.description}
                    onChange={(e) => updatePeoDescription(item.id, e.target.value)}
                    placeholder="Enter PEO description"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePeoItem(item.id)}
                    className="h-8 w-8 bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
  <Button variant="outline" onClick={onClose}>
    Cancel
  </Button>
  <Button onClick={savePsoPeoData} disabled={saving} className="bg-[#1A5CA1] hover:bg-[#1A5CA1]/90">
    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Save PSO/PEO for All Subjects
  </Button>
</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

   
