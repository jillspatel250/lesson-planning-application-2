// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useMemo, useContext } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { EyeIcon, File } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { AuthContext } from "@/lib/AuthContext";

// type CIE = {
//   duration: number;
//   pedagogy: string[];
//   cieNumber: number;
//   probableDate: string;
//   unitsCovered: string;
//   bloomsTaxonomy: string;
//   marksDistribution: number;
// };

// type Form = {
//   subjectId: any;
//   facultyName: any;
//   subjectName: any;
//   subjectCode: any;
//   department: any;
//   id: string;
//   form_data: {
//     cie: CIE[];
//     generalDetails: {
//       department: string;
//       subjectName: string;
//       subjectCode: string;
//       facultyName: string;
//     };
//   };
// };

// type FormsTableProps = {
//   forms: Form[];
// };

// export default function FormsTable({ forms }: FormsTableProps) {
//   const { user } = useContext(AuthContext);

// //   const hodDepartment = user?.departments?.name || "";
// //   const isHod = user?.role === "hod";
// //   const isPrincipal = user?.role === "principal";
// //   const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
// //     null
// //   );

// //   const departments = useMemo(() => {
// //     return Array.from(
// //       new Set(forms.map((form) => form.form_data.generalDetails.department))
// //     );
// //   }, [forms]);


// //   const departmentForms = useMemo(() => {
// //     if (!isHod) return forms;
// //     return forms.filter(
// //       (form) => form.form_data.generalDetails.department === hodDepartment
// //     );
// //   }, [forms, isHod, hodDepartment]);


// //   const filteredForms = useMemo(() => {
// //     return departmentForms.map((form) => ({
// //       subjectName: form.form_data.generalDetails.subjectName,
// //       subjectCode: form.form_data.generalDetails.subjectCode,
// //       department: form.form_data.generalDetails.department,
// //       facultyName: form.form_data.generalDetails.facultyName,
// //       formId: form.id,
// //     })).filter((form) => 
// //       !selectedDepartment || selectedDepartment === "null" || form.department === selectedDepartment
// //     );
// //   }, [departmentForms, selectedDepartment]);

// //   if (user?.role !== "principal" && user?.role !== "hod") {
// //     return <div>You are not authorized to access this page</div>;
// //   }

//   return (
//     <div className="space-y-4">
//       {/* {
//         isPrincipal && (
//           <div>
//         <Select onValueChange={(value) => setSelectedDepartment(value || null)}>
//           <SelectTrigger className="flex float-right w-[300px] mt-3 mb-7">
//             <SelectValue placeholder="Select Department" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="null">All Departments</SelectItem>
//             {departments.map((dept) => (
//               <SelectItem key={dept} value={dept}>
//                 {dept}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         </div>
//       )} */}

//       <Table className="px-5">
//         <TableHeader>
//           <TableRow>
//             <TableHead
//               className="text-black font-bold text-lg"
//               style={{ width: "10%" }}
//             >
//               Faculty Name
//             </TableHead>
//             <TableHead
//               className="text-black font-bold text-lg"
//               style={{ width: "20%" }}
//             >
//               Subject Name
//             </TableHead>
//             <TableHead
//               className="text-black font-bold text-lg"
//               style={{ width: "10%" }}
//             >
//               Subject Code
//             </TableHead>
//             <TableHead
//               className="text-black font-bold text-lg"
//               style={{ width: "15%" }}
//             >
//               Department
//             </TableHead>
//             <TableHead
//               className="text-black font-bold text-lg"
//               style={{ width: "10%" }}
//             >
//               Action
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {/* {filteredForms.map((form) => (
//             <TableRow className="hover:bg-gray-200 text-lg" key={`${form.formId}`}>
//               <TableCell>{form.facultyName}</TableCell>
//               <TableCell>{form.subjectName}</TableCell>
//               <TableCell>{form.subjectCode}</TableCell>
//               <TableCell>{form.department.toLowerCase().split(" ").filter((word) => word !== "and" && word !== "of").map((word) => word.charAt(0).toUpperCase()).join("")}</TableCell>
//               <TableCell>
//                 <Link href={`/dashboard/utility/submitted-form/${form.formId}`}>
//                   <Button variant="outline">
//                     <EyeIcon className="w-4 h-4" />
//                       View LP
//                   </Button>
//                 </Link>
//                 <Link href={`/print/${form.formId}`} target="_blank">
//                   <Button variant="outline">
//                     <File className="w-4 h-4" />
//                     Print LP
//                   </Button>
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))} */}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }