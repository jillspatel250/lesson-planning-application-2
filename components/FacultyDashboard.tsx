// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableHead, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
// import { useDashboardContext } from "@/context/DashboardContext"
// import { BookOpen, Calendar, Clock } from "lucide-react"
// import { Button } from "./ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import Link from "next/link"

// type FacultySubject = {
//   id: string
//   user_id: string
//   role_name: string
//   depart_id: string
//   subject_id: string
//   academic_year: string
//   division: string
//   subjects: {
//     id: string
//     code: string
//     name: string
//     semester: number
//     lecture_hours: number
//     lab_hours: number
//     abbreviation_name: string
//     credits: number
//     is_practical: boolean
//     is_theory: boolean
//   } | null
//   departments: {
//     id: string
//     name: string
//     abbreviation_depart: string
//     institutes: {
//       id: string
//       name: string
//       abbreviation_insti: string
//     } | null
//   } | null
// }

// export default function FacultyDashboard() {
//   const { userData, currentRole } = useDashboardContext()
//   const [subjects, setSubjects] = useState<FacultySubject[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const getSubjectData = async () => {
//       try {
//         setIsLoading(true)
//         // For now, we'll use mock data instead of the actual API call
//         // const data = await fetchFacultySubjects(userData.id)

//         // Mock data with at least one subject
//         const mockData = [
//           {
//             id: "1",
//             user_id: userData.id,
//             role_name: "Faculty",
//             depart_id: currentRole?.depart_id || "",
//             subject_id: "fe66b762-e3d1-4be9-b2ce-3273fd1cbda1",
//             academic_year: "2025",
//             division: "Division 1",
//             subjects: {
//               id: "fe66b762-e3d1-4be9-b2ce-3273fd1cbda1",
//               code: "CEU102",
//               name: "Programming in C++",
//               semester: 2,
//               lecture_hours: 3,
//               lab_hours: 2,
//               abbreviation_name: "C++",
//               credits: 4,
//               is_practical: false,
//               is_theory: true,
//             },
//             departments: currentRole?.departments || null,
//           },
//         ]

//         setSubjects(mockData)
//       } catch (error) {
//         console.error("Error fetching faculty subjects:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (userData.id) {
//       getSubjectData()
//     }
//   }, [userData.id, currentRole])

//   // Filter out subjects where subjects is null
//   const validSubjects = subjects.filter((subject) => subject.subjects !== null)

//   return (
//     <div>
//       <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
//         <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">Faculty Dashboard</p>
//         <div>
//           <span className="font-medium">Department: {currentRole?.departments?.name || "Not assigned"}</span>
//         </div>
//       </div>

//       <div className="mt-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
//               <BookOpen className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{validSubjects.length}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{validSubjects[0]?.academic_year || "2025"}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Total Teaching Hours</CardTitle>
//               <Clock className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {validSubjects.reduce((total, subject) => {
//                   if (!subject.subjects) return total
//                   return total + (subject.subjects.lecture_hours + subject.subjects.lab_hours)
//                 }, 0)}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="border rounded-lg border-black p-3">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">My Subjects</h2>
//             <Link href="/dashboard/lesson-plans/create">
//               <Button className="bg-[#1A5CA1] hover:bg-[#154A80]">Create Lesson Plan</Button>
//             </Link>
//           </div>
//           <hr className="border-1 border-black mb-4" />

//           {isLoading ? (
//             <div className="text-center py-4">Loading subjects...</div>
//           ) : validSubjects.length === 0 ? (
//             <div className="text-center py-4">No subjects assigned yet.</div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Subject Code</TableHead>
//                   <TableHead>Subject Name</TableHead>
//                   <TableHead>Semester</TableHead>
//                   <TableHead>Division</TableHead>
//                   <TableHead>Hours (L-P)</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {validSubjects.map((item) => (
//                   <TableRow key={item.id}>
//                     <TableCell className="font-medium">{item.subjects?.code}</TableCell>
//                     <TableCell>{item.subjects?.name}</TableCell>
//                     <TableCell>{item.subjects?.semester}</TableCell>
//                     <TableCell>{item.division}</TableCell>
//                     <TableCell>{`${item.subjects?.lecture_hours}-${item.subjects?.lab_hours}`}</TableCell>
//                     <TableCell>
//                       <Link href="/dashboard/lesson-plans">
//                         <Button size="sm" className="bg-[#1A5CA1] hover:bg-[#154A80]">
//                           View Lesson Plans
//                         </Button>
//                       </Link>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RoleDataItem } from "@/context/DashboardContext";
import { useMemo } from "react";

export default function FacultyDashboard() {
  const { userData, roleData, currentRole, setCurrentRole } =
    useDashboardContext();

  const uniqueRoles = useMemo(() => {
    const unique = new Map<string, RoleDataItem>();
    roleData.forEach((role) => {
      if (!unique.has(role.role_name)) {
        unique.set(role.role_name, role);
      }
    });
    return Array.from(unique.values());
  }, [roleData]);

  const handleRoleChange = (roleName: string) => {
    const selectedRole = roleData.find((role) => role.role_name === roleName);
    if (selectedRole) {
      setCurrentRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen pt-3 px-5">
      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
          {currentRole.role_name} Dashboard
        </p>
        <div>
          <Select
            onValueChange={handleRoleChange}
            value={currentRole.role_name}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={currentRole.role_name} />
            </SelectTrigger>
            <SelectContent>
              {uniqueRoles.map((role, idx) => (
                <SelectItem value={role.role_name} key={idx}>
                  {role.role_name === "Faculty"
                    ? "Subject Teacher"
                    : role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-5 pl-2">
        <h2 className="text-3xl font-bold text-[#1A5CA1] mb-2">
          Welcome {userData.name}
        </h2>
        <p className="text-xl text-gray-700 mb-1">
          Subject Teacher, {currentRole?.departments?.name || "Department"}
        </p>
        <p className="text-xl text-gray-900 font-semibold uppercase tracking-wide">
          {currentRole?.departments?.institutes?.name || "Institute"}
        </p>
      </div>
    </div>
  );
}
