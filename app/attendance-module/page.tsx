// //@ts-nocheck
// "use client";
// import AttendanceDetails from "@/components/AttendanceDetails";
// import MarkAttendance from "@/components/MarkAttendance";
// import SubjectCard from "@/components/SubjectCard";
// import { lectures } from "@/services/lectureDummyData";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";

// const AttendanceModulePage = () => {
//   // Defensive: fallback to null if lectures[0] is undefined
//   const [selectedLecture, setSelectedLecture] = useState(lectures?.[0] ?? null);
//   const [showList, setShowList] = useState(true);
//   const [fillAttendance, setFillAttendance] = useState(false);

//   const handleBackClick = () => {
//     setShowList(true);
//     setFillAttendance(false);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-blue-800">
//           Attendance Module
//         </h1>
//         <div className="flex items-center">
//           <div className="px-4 py-2 bg-white border rounded-md shadow-sm">
//             <span className="text-sm font-medium text-blue-800">
//               Subject Teacher
//             </span>
//           </div>
//         </div>
//       </div>
//       <div className="mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <h2 className="text-xl font-medium text-blue-800 mb-2">
//             Welcome Dr. Parth Goel
//           </h2>
//           <p className="text-gray-600">
//             Faculty, Department of Computer Science and Engineering
//           </p>
//           <p className="text-gray-700 font-semibold uppercase mt-1">
//             DEVANG PATEL INSTITUTE OF ADVANCE TECHNOLOGY AND RESEARCH
//           </p>
//         </div>
//       </div>
//       {showList ? (
//         lectures && lectures.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//             {lectures.map((lecture) => (
//               <div key={lecture?._id ?? Math.random()} className="mb-4">
//                 <SubjectCard 
//                   lecture={lecture} 
//                   setLecture={setSelectedLecture} 
//                   setShowList={setShowList} 
//                   setFillAttendance={setFillAttendance} 
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div>No lectures available.</div>
//         )
//       ) : fillAttendance ? (
//         selectedLecture ? (
//           <>
//             <div className="mb-4">
//               <Button 
//                 onClick={handleBackClick} 
//                 variant="outline" 
//                 className="flex items-center gap-2"
//               >
//                 <ArrowLeft size={16} />
//                 Back to Subject List
//               </Button>
//             </div>
            
//             <div className="mt-4 mb-8">
//               <AttendanceDetails lecture={selectedLecture} />
//             </div>
            
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>
//               <MarkAttendance lecture={selectedLecture} />
//             </div>
//           </>
//         ) : (
//           <div>No lecture selected.</div>
//         )
//       ) : null}
//     </div>
//   );
// };

// export default AttendanceModulePage;
// app/attendance-module/page.tsx
export default function AttendanceModulePage() {
  return <div>Attendance module is not available.</div>;
}