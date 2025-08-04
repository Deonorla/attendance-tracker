import { useState, useEffect } from "react";
import Card from "../component/dashboard/Card";
import Header from "../component/Header/Header";
import { toast } from "sonner";
import { format, isToday } from "date-fns";
import AttendanceCalendar from "../component/dashboard/AttendanceCalender";
import API from "../api";
import type { ApiResponse } from "../../types";
import { isErrorWithResponse } from "../component/utils/errorUtils";

interface AttendanceData {
  date: Date;
  signIn?: {
    time: Date;
    location: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  };
  signOut?: {
    time: Date;
    location: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  };
  status: "present" | "partial" | "absent";
}

const Dashboard = () => {
  const [attendance, setAttendance] = useState<AttendanceData>({
    date: new Date(),
    status: "absent",
  });
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const now = new Date();
  const token = localStorage.getItem("token") || "";

  // Format date display
  const dayName = format(now, "EEEE");
  const date = format(now, "MMMM d, yyyy");
  const currentTime = format(now, "h:mm a");

  // Fetch today's attendance status
  const fetchAttendance = async () => {
    if (!token) {
      toast.error("Please log in");
      return;
    }
    setIsRefreshing(true);
    try {
      const response = await API.get<ApiResponse>("/attendance/history", {
        params: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      });

      const todayRecord = response.data.attendance?.find((record) =>
        isToday(new Date(record.date))
      );

      setAttendance({
        date: todayRecord ? new Date(todayRecord.date) : new Date(),
        signIn: todayRecord?.signIn
          ? {
              time: new Date(todayRecord.signIn.time),
              location: todayRecord.signIn.location,
            }
          : undefined,
        signOut: todayRecord?.signOut
          ? {
              time: new Date(todayRecord.signOut.time),
              location: todayRecord.signOut.location,
            }
          : undefined,
        status: todayRecord?.status || "absent",
      });
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      toast.error("Failed to load attendance data");
      setAttendance({
        date: new Date(),
        status: "absent",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { coords } = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      if (!coords.latitude || !coords.longitude) {
        throw new Error("Invalid coordinates received");
      }

      await API.post("/attendance/sign-in", {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });

      toast.success("Signed in successfully");
      await fetchAttendance();
    } catch (error: unknown) {
      let errorMessage = "Sign in failed";
      if (isErrorWithResponse(error)) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { coords } = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      await API.post("/attendance/sign-out", {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });

      toast.success("Signed out successfully");
      await fetchAttendance();
    } catch (error: unknown) {
      let errorMessage = "Sign out failed";
      if (isErrorWithResponse(error)) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#141414]">
      <Header />

      <div className="mx-4 sm:mx-8 mt-8 flex flex-col mb-4">
        <h2 className="text-white text-xl lg:text-2xl font-bold mt-4">
          Dashboard
        </h2>
        <p className="mt-2 text-sm text-n-2 mb-6 lg:mb-8">
          {`${dayName}, ${date}`}
        </p>

        <button
          onClick={fetchAttendance}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg mb-4 self-end"
        >
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </button>

        <div className="flex items-center mb-4">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              attendance.status === "present"
                ? "bg-green-500"
                : attendance.status === "partial"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-white">
            {attendance.status === "present"
              ? "Present"
              : attendance.status === "partial"
              ? "Partially Present"
              : "Absent"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            title="Sign-In"
            status={attendance.signIn ? "Signed In" : "Not signed in"}
            statusColor={attendance.signIn ? "green" : "red"}
            time={
              attendance.signIn
                ? format(attendance.signIn.time, "h:mm a")
                : "--:--"
            }
            action="Sign In"
            onAction={handleSignIn}
            disabled={!!attendance.signIn}
            loading={loading && !attendance.signOut}
          />

          <Card
            title="Sign-Out"
            status={
              attendance.signOut
                ? "Signed Out"
                : attendance.signIn
                ? "Pending"
                : "Not available"
            }
            statusColor={
              attendance.signOut
                ? "green"
                : attendance.signIn
                ? "yellow"
                : "gray"
            }
            time={
              attendance.signOut
                ? format(attendance.signOut.time, "h:mm a")
                : "--:--"
            }
            action="Sign Out"
            onAction={handleSignOut}
            disabled={!attendance.signIn || !!attendance.signOut}
            loading={loading && !!attendance.signIn}
          />
        </div>

        <div className="mt-8 border border-n-1/10 rounded-lg p-4">
          <h3 className="text-white text-lg font-semibold mb-2">
            Today's Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-n-2 text-sm">Status:</p>
              <p className="text-white capitalize">
                {attendance.status === "present"
                  ? "Completed"
                  : attendance.status === "partial"
                  ? "In Progress"
                  : "Not Started"}
              </p>
            </div>
            <div>
              <p className="text-n-2 text-sm">Current Time:</p>
              <p className="text-white">{currentTime}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AttendanceCalendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
