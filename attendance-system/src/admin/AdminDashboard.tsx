import { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import API from "../api";

interface StaffAttendance {
  _id: string;
  name: string;
  email: string;
  attendance: {
    date: Date;
    signIn?: { time: Date; location: { latitude: number; longitude: number } };
    signOut?: { time: Date; location: { latitude: number; longitude: number } };
    status: "present" | "partial" | "absent";
  }[];
}

const AdminDashboard = () => {
  const [staffData, setStaffData] = useState<StaffAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Calculate date range based on view mode and current date
  const dateRange = useMemo(() => {
    return viewMode === "week"
      ? {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
        }
      : {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        };
  }, [viewMode, currentDate]);

  // Fetch all staff attendance data
  const fetchStaffAttendance = async () => {
    setLoading(true);
    try {
      const response = await API.get<StaffAttendance[]>("/admin/attendance", {
        params: {
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString(),
        },
      });
      setStaffData(response.data);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
      setStaffData([]); // Ensure staffData is reset on error
    } finally {
      setLoading(false);
    }
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "week" | "month") => {
    setViewMode(mode);
  };

  // Handle date change
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Handle "Today" button click
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    fetchStaffAttendance();
  }, [dateRange]);

  return (
    <div className="p-6 bg-[#141414] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Staff Attendance Dashboard</h1>

      {/* Controls */}
      <div className="bg-[#1E1E1E] p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="font-medium ">View:</label>
            <select
              value={viewMode}
              onChange={(e) =>
                handleViewModeChange(e.target.value as "week" | "month")
              }
              className="border text-n-2 rounded px-3 py-1 mr-2"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium">Date:</label>
            <input
              type="date"
              value={format(dateRange.start, "yyyy-MM-dd")}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              className="border text-n-2 rounded px-3 py-1"
            />
          </div>

          <button
            onClick={handleTodayClick}
            className="ml-auto px-4 py-2 bg-n-1/20 hover:bg-n-1/10 text-white text-xs rounded-lg cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-[#1E1E1E] rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1E1E1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-n-2">
                    Staff
                  </th>
                  {eachDayOfInterval({
                    start: dateRange.start,
                    end: dateRange.end,
                  }).map((day) => (
                    <th
                      key={day.toString()}
                      className="px-4 py-3 text-center text-xs font-medium text-n-2 uppercase tracking-wider"
                    >
                      {format(day, "EEE")}
                      <br />
                      {format(day, "MM/dd")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#1e1e1e] divide-y divide-gray-200">
                {staffData.length > 0 ? (
                  staffData.map((staff) => (
                    <tr key={staff._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-n-2">{staff.name}</div>
                        <div className="text-sm text-n-2">{staff.email}</div>
                      </td>
                      {eachDayOfInterval({
                        start: dateRange.start,
                        end: dateRange.end,
                      }).map((day) => {
                        const record = staff.attendance.find((a) =>
                          isSameDay(new Date(a.date), day)
                        );

                        return (
                          <td
                            key={`${staff._id}-${day.toString()}`}
                            className={`px-4 py-4 border border-solid border-n-2/10 text-center ${
                              record?.status === "present"
                                ? "bg-[#111E18]"
                                : record?.status === "partial"
                                ? "bg-[#382612]"
                                : "bg-[#1e1e1e]/40"
                            }`}
                          >
                            {record ? (
                              <div className="space-y-1">
                                <div className="text-sm text-n-2">
                                  {record.signIn &&
                                    format(
                                      new Date(record.signIn.time),
                                      "HH:mm"
                                    )}
                                </div>
                                <div className="text-sm text-n-2">
                                  {record.signOut &&
                                    format(
                                      new Date(record.signOut.time),
                                      "HH:mm"
                                    )}
                                </div>
                                <div
                                  className={`text-xs font-medium ${
                                    record.status === "present"
                                      ? "text-[#3DB569]"
                                      : record.status === "partial"
                                      ? "text-[#F59E0D]"
                                      : "text-white"
                                  }`}
                                >
                                  {record.status}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={
                        eachDayOfInterval({
                          start: dateRange.start,
                          end: dateRange.end,
                        }).length + 1
                      }
                      className="py-4 text-center text-n-2"
                    >
                      No attendance data found for the selected period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
