import { useState, useEffect } from "react";
import Card from "../component/dashboard/Card";
import Header from "../component/Header/Header";
import { toast } from "sonner";
import { format, isToday } from "date-fns";
import AttendanceCalendar from "../component/dashboard/AttendanceCalender";

interface AttendanceData {
  signedIn: boolean;
  signedOut: boolean;
  signInTime: Date | null;
  signOutTime: Date | null;
}

const Dashboard = () => {
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const now = new Date();

  // Format date display
  const dayName = format(now, "EEEE");
  const date = format(now, "MMMM d, yyyy");
  const currentTime = format(now, "h:mm a");

  // Fetch today's attendance status
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Replace with actual API call
        // const response = await API.get('/attendance/today');
        const mockData: AttendanceData = {
          signedIn: false,
          signedOut: false,
          signInTime: null,
          signOutTime: null,
        };
        setAttendance(mockData);
      } catch (error) {
        toast.error("Failed to load attendance data");
      }
    };
    fetchAttendance();
  }, []);

  const handleSignIn = async () => {
    if (!attendance) return;

    setLoading(true);
    try {
      // Replace with actual API call
      // await API.post('/attendance/signin', { location });
      setTimeout(() => {
        setAttendance({
          signedIn: true,
          signedOut: false,
          signInTime: new Date(),
          signOutTime: null,
        });
        toast.success("Signed in successfully");
      }, 1000);
    } catch (error) {
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!attendance) return;

    setLoading(true);
    try {
      // Replace with actual API call
      // await API.post('/attendance/signout');
      setTimeout(() => {
        setAttendance({
          ...attendance,
          signedOut: true,
          signOutTime: new Date(),
        });
        toast.success("Signed out successfully");
      }, 1000);
    } catch (error) {
      toast.error("Sign out failed");
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

        {attendance && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                title="Sign-In"
                status={attendance.signedIn ? "Signed In" : "Not signed in"}
                statusColor={attendance.signedIn ? "green" : "red"}
                time={
                  attendance.signInTime
                    ? format(attendance.signInTime, "h:mm a")
                    : "--:--"
                }
                action="Sign In"
                onAction={handleSignIn}
                disabled={attendance.signedIn}
                loading={loading && !attendance.signedOut}
              />

              <Card
                title="Sign-Out"
                status={
                  attendance.signedOut
                    ? "Signed Out"
                    : attendance.signedIn
                    ? "Pending"
                    : "Not available"
                }
                statusColor={
                  attendance.signedOut
                    ? "green"
                    : attendance.signedIn
                    ? "yellow"
                    : "gray"
                }
                time={
                  attendance.signOutTime
                    ? format(attendance.signOutTime, "h:mm a")
                    : "--:--"
                }
                action="Sign Out"
                onAction={handleSignOut}
                disabled={!attendance.signedIn || attendance.signedOut}
                loading={loading && attendance.signedIn}
              />
            </div>

            {/* Attendance Summary */}
            <div className="mt-8 border border-n-1/10 rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold mb-2">
                Today's Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-n-2 text-sm">Status:</p>
                  <p className="text-white">
                    {attendance.signedOut
                      ? "Completed"
                      : attendance.signedIn
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
