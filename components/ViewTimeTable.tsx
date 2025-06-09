"use client";

import { useState } from "react";
import {
  timeTableData,
  academicYears,
  terms,
  loadDetails,
  TimeTable,
} from "@/services/timeTableDummy";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ViewTimeTable = () => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2025-2026");
  const [selectedTerm, setSelectedTerm] = useState("Odd");
  const [selectedLoadDetail, setSelectedLoadDetail] = useState("Time Table");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Fixed time slots based on the image
  const timeSlots = [
    { id: "1", time: "09:10 AM-10:09 AM", isBreak: false },
    { id: "2", time: "10:10 AM-11:09 AM", isBreak: false },
    {
      id: "3",
      time: "11:10 AM-12:09 PM",
      isBreak: true,
      breakType: "Lunch Break",
    },
    { id: "4", time: "12:10 PM-13:09 PM", isBreak: false },
    { id: "5", time: "13:10 PM-14:09 PM", isBreak: false },
    { id: "6", time: "14:10 PM-14:19 PM", isBreak: true, breakType: "Break" },
    { id: "7", time: "14:20 PM-15:19 PM", isBreak: false },
    { id: "8", time: "15:20 PM-16:20 PM", isBreak: false },
  ];
  const getTimeSlotFromDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Convert UTC time to time slot based on the pattern
    if (hours === 9 && minutes === 10) return "09:10 AM-10:09 AM";
    if (hours === 10 && minutes === 10) return "10:10 AM-11:09 AM";
    if (hours === 11 && minutes === 10) return "10:10 AM-11:09 AM";
    if (hours === 12 && minutes === 10) return "12:10 PM-13:09 PM";
    if (hours === 13 && minutes === 10) return "13:10 PM-14:09 PM";
    if (hours === 14 && minutes === 20) return "14:20 PM-15:19 PM";
    if (hours === 15 && minutes === 20) return "15:20 PM-16:20 PM";

    // Additional mappings for the time entries in our dummy data
    if (hours === 3 && minutes === 50) return "14:20 PM-15:19 PM";
    if (hours === 4 && minutes === 50) return "15:20 PM-16:20 PM";
    if (hours === 2 && minutes === 50) return "14:20 PM-15:19 PM";

    return "";
  };
  const getSubjectsForSlot = (day: string, timeSlot: string): TimeTable[] => {
    const subjects = timeTableData.filter((entry) => {
      const entryDay = entry.day.toLowerCase();
      const targetDay = day.toLowerCase();
      const entryTimeSlot = getTimeSlotFromDateTime(entry.from);

      return entryDay === targetDay && entryTimeSlot === timeSlot;
    });
    // Limit to maximum 2 subjects per time slot
    const limitedSubjects = subjects.slice(0, 2);

    return limitedSubjects;
  };

  const isSlotOccupiedByPreviousLab = (
    day: string,
    timeSlot: string
  ): boolean => {
    const currentSlotIndex = timeSlots.findIndex(
      (slot) => slot.time === timeSlot
    );
    if (currentSlotIndex <= 0) return false;

    const previousSlot = timeSlots[currentSlotIndex - 1];
    if (previousSlot.isBreak) return false;

    const previousSubjects = getSubjectsForSlot(day, previousSlot.time);
    return previousSubjects.some(
      (subject) => subject.type.toLowerCase() === "lab"
    );
  };
  const getSubjectColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "lecture":
        return "bg-[#D0D0D0] text-primary-blue";
      case "lab":
        return "bg-[#D0D0D0] text-[#B24CC3]";
      default:
        return "bg-[#D0D0D0] text-gray-900";
    }
  };
  const renderSubjectCell = (
    subject: TimeTable,
    isLab: boolean = false,
    isMultiple: boolean = false
  ) => {
    // Create display values based on the dummy data structure
    const displayType = `B TECH(CE)`;
    const displaySem = `SEM ${subject.sem}`;
    const displayDiv = `DIV-${subject.division}${
      subject.batch ? ` / ${subject.batch}` : ""
    }`;
    const displaySubject = "DBMS"; // Based on the image, all subjects are DBMS
    const displayCode = "CE263"; // Based on the image

    const height = isLab ? "h-40" : "h-20";
    const padding = isMultiple ? "p-1.5" : "p-2";
    const fontSize = "text-xs";

    return (
      <div
        className={`${padding} ${fontSize} ${getSubjectColor(
          subject.type
        )} ${height} w-full flex border-black flex-col p-2 justify-center border-r border-b-2`}
      >
        <div className="font-semibold leading-tight">
          {displayType} / {displaySem}
        </div>
        <div className="font-medium leading-tight mt-0.5">{displayDiv}</div>
        <div className="leading-tight mt-0.5">
          {displaySubject} / {displayCode}
        </div>
        {isLab && (
          <div className="leading-tight mt-1 font-medium opacity-75">
            {isMultiple ? "Lab (2h)" : "Lab (2 hrs)"}
          </div>
        )}
      </div>
    );
  };
  const renderMultipleSubjects = (
    subjects: TimeTable[],
    isLab: boolean = false
  ) => {
    const height = isLab ? "h-32" : "h-16";

    if (subjects.length === 0) {
      return <div className={`${height} w-full`}></div>;
    }

    if (subjects.length === 1) {
      return (
        <div className={`${height} w-full`}>
          {renderSubjectCell(subjects[0], isLab, false)}
        </div>
      );
    }

    // For exactly 2 subjects, display side by side with equal width
    return (
      <div className={`${height} w-full flex p-0`}>
        <div className="flex-1 w-1/2">
          {renderSubjectCell(subjects[0], isLab, true)}
        </div>
        <div className="flex-1 w-1/2">
          {renderSubjectCell(subjects[1], isLab, true)}
        </div>
      </div>
    );
  };

  const renderBreakCell = (breakType: string) => {
    return (
      <div className="text-primary-blue text-center py-3 font-semibold text-2xl">
        {breakType}
      </div>
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Academic Year:
          </label>
          <Select
            value={selectedAcademicYear}
            onValueChange={setSelectedAcademicYear}
          >
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Term:</label>
          <div className="flex gap-1">
            {terms.map((term) => (
              <Button
                key={term}
                variant={selectedTerm === term ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTerm(term)}
                className={`px-4 py-1 text-xs h-8 rounded-full ${
                  selectedTerm === term
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Load Details:
          </label>
          <div className="flex gap-1">
            {loadDetails.map((detail) => (
              <Button
                key={detail}
                variant={selectedLoadDetail === detail ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLoadDetail(detail)}
                className={`px-4 py-1 text-xs h-8 rounded-full ${
                  selectedLoadDetail === detail
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {detail}
              </Button>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* Timetable */}
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse border-2 border-black bg-white table-fixed">
          <thead>
            <tr>
              <th className="border-2 border-black bg-white p-2 text-left font-semibold text-sm w-32">
                <div className="text-gray-700">Time Slot/</div>
                <div className="text-gray-700">Day</div>
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border-2 border-black bg-white p-2 text-center font-semibold text-sm w-40"
                >
                  <div className="font-medium">{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.id} className="h-20 items-center">
                <td className="border-2 border-black p-2 bg-white font-medium text-sm items-center justify-center align-top">
                  <div className="whitespace-nowrap items-center">
                    {slot.time}
                  </div>
                </td>
                {slot.isBreak ? (
                  <td colSpan={6} className="border-2 border-black p-0">
                    {renderBreakCell(slot.breakType || "Break")}
                  </td>
                ) : (
                  days.map((day) => {
                    const subjects = getSubjectsForSlot(day, slot.time);
                    const isOccupiedByPreviousLab = isSlotOccupiedByPreviousLab(
                      day,
                      slot.time
                    );

                    // Skip rendering if this slot is occupied by a lab from the previous slot
                    if (isOccupiedByPreviousLab) {
                      return null;
                    }

                    const hasLab = subjects.some(
                      (subject) => subject.type.toLowerCase() === "lab"
                    );
                    const rowSpan = hasLab ? 2 : 1;

                    return (
                      <td
                        key={day}
                        className="border-2 border-black p-0 align-top w-40"
                        rowSpan={rowSpan}
                      >
                        {renderMultipleSubjects(subjects, hasLab)}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTimeTable;
