import { useState, useEffect } from "react";
import {
  format,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDay,
} from "date-fns";

interface AttendanceRecord {
  date: Date;
  signedIn: boolean;
  signedOut: boolean;
}

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  // Get properly aligned days for the calendar view
  const getCalendarDays = () => {
    if (viewMode === "week") {
      const start = startOfWeek(currentMonth);
      const end = endOfWeek(currentMonth);
      return eachDayOfInterval({ start, end });
    } else {
      // For month view, we need to include days from previous/next month to fill the grid
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      return eachDayOfInterval({ start: startDate, end: endDate });
    }
  };

  // Check attendance status for a day
  const getAttendanceStatus = (day: Date) => {
    const record = attendanceData.find((item) => isSameDay(item.date, day));
    if (!record) return "absent";
    if (record.signedIn && record.signedOut) return "present";
    if (record.signedIn) return "partial";
    return "absent";
  };

  // Navigation handlers
  const prevPeriod = () =>
    setCurrentMonth(
      viewMode === "month"
        ? subMonths(currentMonth, 1)
        : addDays(currentMonth, -7)
    );
  const nextPeriod = () =>
    setCurrentMonth(
      viewMode === "month"
        ? addMonths(currentMonth, 1)
        : addDays(currentMonth, 7)
    );
  const goToToday = () => setCurrentMonth(new Date());

  // Mock data - replace with your API data
  useEffect(() => {
    // This would be your API call in production
    const mockData: AttendanceRecord[] = [
      { date: new Date(2023, 7, 1), signedIn: true, signedOut: true }, // August 1
      { date: new Date(2023, 7, 3), signedIn: true, signedOut: true }, // August 3 (today)
      { date: new Date(2023, 7, 5), signedIn: true, signedOut: false }, // August 5 (partial)
    ];
    setAttendanceData(mockData);
  }, []);

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg border border-n-1/10 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">
          {format(
            currentMonth,
            viewMode === "month" ? "MMMM yyyy" : "MMMM do, yyyy"
          )}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
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
            onClick={goToToday}
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

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-n-2 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {getCalendarDays().map((day) => {
          const status = getAttendanceStatus(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const dayNumber = format(day, "d");

          return (
            <div
              key={day.toString()}
              className={`min-h-12 rounded flex flex-col items-center justify-center text-xs p-1
                ${isCurrentMonth ? "text-white" : "text-n-2 opacity-50"}
                ${isToday ? "ring-2 ring-blue-500" : ""}
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
              <span>{dayNumber}</span>
              {status === "present" && (
                <span className="text-[8px] mt-1">✓✓</span>
              )}
              {status === "partial" && (
                <span className="text-[8px] mt-1">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
