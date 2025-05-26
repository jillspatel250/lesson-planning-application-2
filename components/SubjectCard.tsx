import { DummyLecture } from "@/services/dummyTypes";
import { Edit, Eye } from "lucide-react";
import Image from "next/image";

interface SubjectCardProps {
  lecture: DummyLecture;
  setLecture: (lecture: DummyLecture) => void;
  setShowList: (show: boolean) => void;
  setFillAttendance?: (fill: boolean) => void;
}

const SubjectCard = ({ lecture, setLecture, setShowList, setFillAttendance }: SubjectCardProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-[20px] border-2 w-[340px] h-[239px]">
      <div className="flex flex-row gap-2 justify-between">
        <div>
            <h2 className="text-xl text-primary-blue font-bold">{lecture.name}</h2>
        </div>
        <div className="w-[74px] h-[29px] bg-primary-blue font-semibold text-xs text-white rounded-full flex items-center justify-center">
            <p>Sem {lecture.sem}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex h-[29px] border-2 rounded-full w-[82px] justify-center items-center">
          <p className="text-xs font-semibold">{lecture.code}</p>
        </div>
        <div className={`flex h-[29px] rounded-full w-[82px] justify-center items-center ${lecture.status === "Submitted" ? "bg-[#1aa1643f] text-[#1AA164]" : "bg-[#a11a1a42] text-[#a11a1a]"}`}>
          <p className="text-xs font-semibold">{lecture.status}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col h-[68px] w-[68px] border-2 rounded-lg">
          <div className="flex justify-center items-center border-b-2 h-1/2 w-full gap-0.5">
            <Image src="/calendar.png" alt="calendar image" height={14} width={14} className="" />
            <p className="text-xs font-semibold">Date</p>
          </div>
          <div className="flex justify-center items-center h-1/2 w-full">
            <p className="text-xs font-semibold">{lecture.date}</p>
          </div>
        </div>
        <div className="flex flex-col h-[68px] w-[138px] border-2 rounded-lg">
          <div className="flex justify-center items-center border-b-2 h-1/2 w-full gap-0.5">
            <Image src="/clock.png" alt="clock image" height={14} width={14} className="" />
            <p className="text-xs font-semibold">Time</p>
          </div>
          <div className="flex justify-center items-center h-1/2 w-full">
            <p className="text-xs font-semibold">{lecture.fromTime} to {lecture.toTime}</p>
          </div>
        </div>
      </div>      <div className="flex gap-2">
        <div className="flex border-2 rounded-lg h-10 w-36 justify-center items-center gap-1.5 cursor-pointer">
          <Eye className="h-5 w-5" />
          <p className="text-xs font-semibold">View Attendance</p>
        </div>
        <button 
          className="flex border-2 rounded-lg h-10 w-36 justify-center items-center gap-1.5 cursor-pointer hover:bg-gray-50"
          onClick={() => { 
            setLecture(lecture); 
            setShowList(false); 
            if (setFillAttendance) {
              setFillAttendance(true);
            }
          }}
        >
          <Edit className="h-3.5 w-3.5" />
          <p className="text-xs font-semibold">Fill Attendance</p>
        </button>
      </div>
    </div>
  )
}

export default SubjectCard
