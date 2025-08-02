import { useState } from "react";
import {
  format,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

interface AttendanceRecord {
  date: Date;
  signedIn: boolean;
  signedOut: boolean;
}

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("month");

  // Mock data - replace with your API data
  const attendanceData: AttendanceRecord[] = [
    { date: new Date(2023, 5, 1), signedIn: true, signedOut: true },
    { date: new Date(2023, 5, 2), signedIn: true, signedOut: false },
    { date: new Date(), signedIn: true, signedOut: true }, // Today
  ];

  // Get days for current view
  const getDays = () => {
    const start =
      viewMode === "month"
        ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        : new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            currentMonth.getDate() - currentMonth.getDay()
          );

    const end =
      viewMode === "month"
        ? new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        : new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            currentMonth.getDate() + (6 - currentMonth.getDay())
          );

    return eachDayOfInterval({ start, end });
  };

  // Check attendance status for a day
  const getAttendanceStatus = (day: Date) => {
    const record = attendanceData.find((item) => isSameDay(item.date, day));
    if (!record) return "absent"; // No record
    if (record.signedIn && record.signedOut) return "present";
    if (record.signedIn) return "partial";
    return "absent";
  };

  // Navigation handlers
  const prevPeriod = () =>
    setCurrentMonth(
      viewMode === "month"
        ? subMonths(currentMonth, 1)
        : subMonths(currentMonth, 0)
    );
  const nextPeriod = () =>
    setCurrentMonth(
      viewMode === "month"
        ? addMonths(currentMonth, 1)
        : addMonths(currentMonth, 0)
    );
  const toggleViewMode = () =>
    setViewMode(viewMode === "month" ? "week" : "month");

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg border border-n-1/10 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">
          {format(
            currentMonth,
            viewMode === "month" ? "MMMM yyyy" : "MMM d, yyyy"
          )}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 text-xs bg-n-1/10 text-white rounded"
          >
            {viewMode === "month" ? "Week View" : "Month View"}
          </button>
          <button
            onClick={prevPeriod}
            className="px-3 py-1 text-xs bg-n-1/10 text-white rounded"
          >
            &lt;
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-xs bg-n-1/10 text-white rounded"
          >
            Today
          </button>
          <button
            onClick={nextPeriod}
            className="px-3 py-1 text-xs bg-n-1/10 text-white rounded"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-n-2 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getDays().map((day) => {
          const status = getAttendanceStatus(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`h-12 rounded flex flex-col items-center justify-center text-xs
                ${isCurrentMonth ? "text-white" : "text-n-2"}
                ${isToday ? "border border-blue-500" : ""}
                ${
                  status === "present"
                    ? "bg-green-900"
                    : status === "partial"
                    ? "bg-yellow-900"
                    : status === "absent"
                    ? "bg-red-900"
                    : "bg-[#2A2A2A]"
                }`}
            >
              <span>{format(day, "d")}</span>
              {status === "present" && <span className="text-[8px]">✓✓</span>}
              {status === "partial" && <span className="text-[8px]">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
