"use client";

import ViewTimeTable from "@/components/ViewTimeTable";

const TimeTablePage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-800">Time Table</h1>
        <div className="flex items-center">
          <div className="px-4 py-2 bg-white border rounded-md shadow-sm">
            <span className="text-sm font-medium text-blue-800">
              Subject Teacher
            </span>
          </div>
        </div>
      </div>

      <ViewTimeTable />
    </div>
  );
};

export default TimeTablePage;
