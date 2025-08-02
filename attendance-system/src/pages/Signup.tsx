import API from "../api";
import { useNavigate } from "react-router-dom";
import UniversalButton from "../component/button/UniversalButton";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { getLocation } from "../component/utils/utils";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const [locationError, setLocationError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLocationError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      toast.info("Detecting your location...");

      // Get location (GPS or IP fallback)
      const location = await getLocation();
      console.log("Location obtained:", location);

      // Prepare signup data
      const signupData = {
        ...formData,
        location,
      };

      const response = await API.post("/auth/register", signupData);

      if (response.data.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("location")) {
          setLocationError(error.message);
        } else {
          const axiosError = error as AxiosError<{ message?: string }>;
          toast.error(
            axiosError.response?.data?.message ||
              error.message ||
              "Signup failed"
          );
        }
      } else {
        toast.error("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="  flex  flex-col  w-[90%] md:w-[70%] lg:w-[50%]  p-4 z-1  h-fit mb-5  border border-n-1/10 rounded-3xl  xl:w-[30%] ">
        <h1
          className={` text-[1.5rem] mb-6 font-bold  text-center mt-32 xl:mt-8`}
        >
          {" "}
          Create an account on
          <span className="bg-gradient-to-r from-linear-1  to-linear-2  text-[transparent] bg-clip-text">
            {" "}
            Attendy
          </span>
        </h1>
        <p className=" mt-2 text-sm text-color-7 max-w-3xl mx-auto mb-6 lg:mb-8">
          Attendance system with geolocation validation
        </p>
        <div className=" flex flex-col mt-2">
          <div className="flex-col  flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Full Name
            </p>
            <div className=" my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                name="name"
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input full name"
                type="text"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
          </div>
          <div className="flex-col  flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Email
            </p>
            <div className=" my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                name="email"
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input email"
                type="text"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
          </div>
          <div className="flex-col  flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Password
            </p>
            <div className=" my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                name="password"
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input password"
                type="password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
          </div>
          <div className="flex-col  flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Confirm password
            </p>
            <div className=" my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                name="confirmPassword"
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input password"
                type="password"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
            </div>
          </div>
          <div className="flex w-full justify-center items-center">
            <UniversalButton
              onClick={handleSubmit}
              text={loading ? "Signing up..." : "Sign up"}
              disabled={loading}
            />
          </div>
          <div className="mt-8">
            <p className="text-[.7rem] lg:text-[.82rem] text-center text-color-7 my-[.2rem]">
              Already have an account ?{"    "}
              <span
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-linear-1  to-linear-2  text-[transparent] bg-clip-text hover:underline cursor-pointer lg:text-[.82rem] text-[.7rem]"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
