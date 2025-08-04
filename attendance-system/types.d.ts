export interface User {
  name: string;
  email: string;
  token: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export interface AttendanceRecord {
  date: string | Date;
  signIn?: {
    time: string | Date;
    location: AttendanceLocation;
  };
  signOut?: {
    time: string | Date;
    location: AttendanceLocation;
  };
  status?: "present" | "partial" | "absent";
}

export interface ApiResponse {
  success: boolean;
  attendance: AttendanceRecord[] | null;
}
