"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

interface ProgressIndicatorProps {
  lessonPlan: any
  subject: any
}

export default function ProgressIndicator({ lessonPlan, subject }: ProgressIndicatorProps) {
  const sections = [
    {
      name: "General Details",
      completed: lessonPlan?.general_details_completed || false,
      required: true,
    },
    {
      name: "Unit Planning",
      completed: lessonPlan?.unit_planning_completed || false,
      required: subject?.is_theory || false,
    },
    {
      name: "Practical Planning",
      completed: lessonPlan?.practical_planning_completed || false,
      required: subject?.is_practical || false,
    },
    {
      name: "CIE Planning",
      completed: lessonPlan?.cie_planning_completed || false,
      required: true,
    },
    {
      name: "Additional Information",
      completed: lessonPlan?.additional_info_completed || false,
      required: true,
    },
  ]

  const requiredSections = sections.filter((section) => section.required)
  const completedSections = requiredSections.filter((section) => section.completed)
  const progressPercentage = Math.round((completedSections.length / requiredSections.length) * 100)

  const getStatusInfo = () => {
    if (progressPercentage === 100) {
      return { status: "Submitted", color: "bg-green-100 text-green-800", icon: CheckCircle }
    } else if (progressPercentage > 0) {
      return { status: "In Progress", color: "bg-yellow-100 text-yellow-800", icon: Clock }
    } else {
      return { status: "Not Started", color: "bg-gray-100 text-gray-800", icon: Circle }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Lesson Plan Progress</h4>
        <Badge className={statusInfo.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>
            {completedSections.length}/{requiredSections.length} sections completed
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progressPercentage === 100 ? "bg-green-500" : progressPercentage > 0 ? "bg-yellow-500" : "bg-gray-400"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {requiredSections.map((section, index) => (
            <div key={index} className="flex items-center space-x-2">
              {section.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span className={`text-sm ${section.completed ? "text-green-700" : "text-gray-600"}`}>
                {section.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
