import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniversalButton from "../component/button/UniversalButton";
import { toast } from "sonner";
import API from "../api";
import { getLocation } from "../component/utils/utils";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    // Basic validation
    if (!credentials.email || !credentials.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      toast.info("Detecting your location...");

      // Get location (GPS or IP fallback)
      const location = await getLocation();
      console.log("Location obtained:", location);

      // Verify location accuracy
      // if (location.accuracy > 50) {
      //   throw new Error(
      //     "Location accuracy too low. Please be within your office proximity."
      //   );
      // }

      const loginData = {
        ...credentials,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
        },
      };

      // console.log("loginData", loginData);

      const response = await API.post("/auth/login", loginData);

      if (response.data.success) {
        // Save token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      type ErrorWithResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as ErrorWithResponse).response === "object" &&
        (error as ErrorWithResponse).response !== null &&
        (error as ErrorWithResponse).response !== undefined &&
        "data" in ((error as ErrorWithResponse).response as object)
      ) {
        toast.error(
          (error as ErrorWithResponse).response?.data?.message ||
            (error as ErrorWithResponse).message ||
            "Login failed"
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied. Please enable location services.";
      case error.POSITION_UNAVAILABLE:
        return "Location information unavailable. Check your network connection.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "Error getting location: " + error.message;
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col w-[90%] md:w-[70%] lg:w-[50%] p-4 z-1 h-fit mb-5 border border-n-1/10 rounded-3xl xl:w-[30%]">
        <h1 className="text-[1.5rem] mb-6 font-bold text-center mt-32 xl:mt-8">
          Login to
          <span className="bg-gradient-to-r from-linear-1 to-linear-2 text-transparent bg-clip-text">
            {" "}
            Attendy
          </span>
        </h1>
        <p className="mt-2 text-sm text-color-7 max-w-3xl mx-auto mb-6 lg:mb-8">
          Attendance system with geolocation validation
        </p>
        <div className="flex flex-col mt-2">
          <div className="flex-col flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Email
            </p>
            <div className="my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b] bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                name="email"
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input email"
                type="email"
                onChange={handleChange}
                value={credentials.email}
              />
            </div>
          </div>
          <div className="flex-col flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Password
            </p>
            <div className="my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b] bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                name="password"
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input password"
                type="password"
                onChange={handleChange}
                value={credentials.password}
              />
            </div>
          </div>

          <div className="flex w-full justify-center items-center">
            <UniversalButton
              text={loading ? "Signing in..." : "Sign in"}
              onClick={handleLogin}
              disabled={loading}
              className="mt-8"
            />
          </div>
          <div className="mt-8">
            <p className="text-[.7rem] lg:text-[.82rem] text-center text-color-7 my-[.2rem]">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-linear-1 to-linear-2 text-transparent bg-clip-text hover:underline cursor-pointer lg:text-[.82rem] text-[.7rem]"
              >
                Sign up
              </span>
            </p>
          </div>
          <div className="text-xs text-color-7 mt-4 text-center">
            Location access is required to verify office presence
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
