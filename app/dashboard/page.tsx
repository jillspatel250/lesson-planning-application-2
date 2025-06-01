// "use client"

// import { useDashboardContext } from "@/context/DashboardContext"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import HODDashboard from "@/components/HODDashboard"

// export default function Dashboard() {
//   const { userData, roleData, currentRole, setCurrentRole } = useDashboardContext()

//   // Check if user has HOD role
//   const hasHODRole = roleData?.some((role) => role.role_name === "HOD")
//   const hasFacultyRole = roleData?.some((role) => role.role_name === "Faculty")

//   const handleRoleChange = (roleName: string) => {
//     const selectedRole = roleData.find((role) => role.role_name === roleName)
//     if (selectedRole) {
//       setCurrentRole(selectedRole)
//     }
//   }

//   // If user only has HOD role, show HOD dashboard
//   if (hasHODRole && !hasFacultyRole) {
//     return <HODDashboard />
//   }

//   // If user has Faculty role (with or without HOD), show Faculty dashboard
//   if (hasFacultyRole) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="bg-white border-b border-gray-200 px-8 py-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-4xl font-bold text-[#1A5CA1]">Dashboard</h1>
//             {roleData.length > 1 && (
//               <div className="relative">
//                 <Select value={currentRole?.role_name} onValueChange={handleRoleChange}>
//                   <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg">
//                     <SelectValue placeholder="Select Role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {roleData.map((role) => (
//                       <SelectItem key={role.id} value={role.role_name}>
//                         {role.role_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="px-8 py-8">
//           <div className="mb-8">
//             <h2 className="text-4xl font-bold text-[#1A5CA1] mb-2">Welcome {userData.name}</h2>
//             <p className="text-3xl text-gray-700 mb-1">
//               {currentRole?.role_name}, {currentRole?.departments?.name}
//             </p>
//             <p className="text-3xl text-gray-900 font-semibold uppercase tracking-wide">
//               {currentRole?.departments?.institutes?.name}
//             </p>
//           </div>

//           {/* Show HOD Dashboard if current role is HOD */}
//           {currentRole?.role_name === "HOD" && <HODDashboard />}

//           {/* Show Faculty content if current role is Faculty */}
//           {/* {currentRole?.role_name === "Faculty" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-xl font-semibold text-[#1A5CA1] mb-2">Lesson Plans</h3>
//                 <p className="text-gray-600">Create and manage your lesson plans</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-xl font-semibold text-[#1A5CA1] mb-2">Subjects</h3>
//                 <p className="text-gray-600">View your assigned subjects</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-xl font-semibold text-[#1A5CA1] mb-2">Reports</h3>
//                 <p className="text-gray-600">Generate and view reports</p>
//               </div> */}
//             {/* </div>
//           )} */}
//         </div>
//       </div>
//     )
//   }

//   // Fallback
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white border-b border-gray-200 px-8 py-6">
//         <h1 className="text-4xl font-bold text-[#1A5CA1]">Dashboard</h1>
//       </div>
//       <div className="px-8 py-8">
//         <p className="text-lg text-gray-600">No valid role found.</p>
//       </div>
//     </div>
//   )
// }
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