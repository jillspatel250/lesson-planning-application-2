import { DummyLecture } from "@/services/dummyTypes";

const AttendanceDetails = ({ lecture }: { lecture: DummyLecture }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 w-full">
      <div className="border-b pb-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Student Attendance
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
        <div className="space-y-4">
          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Lecture Date</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">{lecture.date}</p>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Lecture Details</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">{lecture.details}</p>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Course</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">
              {lecture.code} / {lecture.name}
            </p>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Planned Topic</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">
              {lecture.plannedTopic || "Planning not done"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Lecture Time</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">
              {lecture.fromTime}-{lecture.toTime}
            </p>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Faculty Name</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">{lecture.facultyName}</p>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Room</p>
            <p className="pl-4 pr-8">:</p>
            <p className="text-sm">{lecture.Room || "Lab"}</p>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold w-32">Actual Topic</p>
            <p className="pl-4 pr-8">:</p>
            <div className="flex-1">
              <select className="w-full border border-gray-300 rounded bg-white py-1 px-2 text-sm">
                <option>--Select Type--</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2">
          <p className="text-xs font-semibold">Remark:</p>
        </div>
        <textarea
          className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter remarks here..."
        ></textarea>{" "}
      </div>
    </div>
  );
};

export default AttendanceDetails;
