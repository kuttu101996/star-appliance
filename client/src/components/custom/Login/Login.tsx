// import React from 'react'
import "./Login.css";
import logo from "/logo-removebg.png";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";

const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const loginLoading = useSelector((state: RootState) => state.auth.loading);

  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    // try {
    if (!mobile && !password) {
      return toast({
        variant: "destructive",
        title: "Empty Credentials",
        description: "Your login credentials cannot be empty.",
      });
    } else if (!mobile) {
      toast({
        variant: "destructive",
        title: "Empty Credential",
        description: "Please enter your registered Mobile.",
      });
    } else if (!password) {
      toast({
        variant: "destructive",
        title: "Empty Credential",
        description: "Please enter your password.",
      });
    }

    const loginData = { mobile: mobile, password };

    try {
      const resultAction = await dispatch(loginUser(loginData));

      if (loginUser.fulfilled.match(resultAction)) {
        return toast({
          className: "bg-blue-500 text-white border-0",
          title: "Login Successful",
        });
      } else if (loginUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload
          ? (resultAction.payload as string) // This is where 'User not found' comes from if you use `rejectWithValue`
          : resultAction.error.message; // Fallback in case the rejection was from an uncaught error

        toast({
          title: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error in creating service request:", error);
    }

    // const response = await axios.post(
    //   `http://localhost:1300/user/login`,
    //   loginData,
    //   { headers: { "Content-Type": "application/json" } }
    // );

    //   if (response.status === 200) {
    //     // console.log(response.data);
    //     dispatch(setToken(response.data.token)); // Store token in Redux

    //     // Store the token in sessionStorage
    //     sessionStorage.setItem("token", response.data.token);
    //     sessionStorage.setItem("user", JSON.stringify(response.data.result));
    //     console.log(response.data.result);

    //     toast({
    //       className: "bg-blue-500 text-gray-100",
    //       title: response.data.message,
    //     });

    //     setTimeout(() => {
    //       // if (response.data.result.userType === "ADMIN") navigate("/admin");
    //       // else
    //       navigate("/");
    //     }, 4000);
    //   } else {
    //     console.log(response.data);
    //   }
    // } catch (error: any) {
    //   console.log(error.response?.data);
    //   toast({
    //     variant: "destructive",
    //     title: "Login Failed",
    //     description: error.response?.data?.message,
    //   });
    // }
  };

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        navigate("/");
      }, 4000);
    }
  }, [token, user]);

  return (
    <div className="login-bg">
      <div className="login-main flex flex-col items-center justify-center w-full h-screen text-gray-700">
        <div className="h-[85%] w-full flex items-center justify-center">
          <div className="lg:w-7/12 w-full flex items-center justify-center">
            <div className="back-drop px-4 py-8 lg:p-8 min-w-[80%] md:min-w-[500px] lg:min-w-[500px] lg:max-w-[350px] min-h-[350px] max-h-[350px]">
              <div className="w-60 lg:w-96 flex justify-between gap-2 lg:gap-0 mb-8">
                <div>
                  <h2 className="text-gray-900 text-2xl lg:text-3xl m-o p-0 font-black">
                    Sign in
                  </h2>
                  <h2 className="text-gray-800 m-o p-0 text-sm">
                    to access aplication
                  </h2>
                </div>
                <div>
                  <div className="logo-wrapper w-20 lg:w-24">
                    <img src={logo} alt="Logo" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="mobile"
                      id="loginCred"
                      placeholder="Email address or mobile number"
                      value={mobile}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMobile(e.target.value)
                      }
                      className="rounded px-2 py-1 w-60 lg:w-96 bg-transparent border-b border-[#408dfb] font-black focus:outline-none tracking-wider"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      className="rounded px-2 py-1 w-60 lg:w-96 bg-transparent border-b border-[#408dfb] font-black focus:outline-none tracking-wider"
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleLogin}
                      className="flex items-center justify-center min-h-8 text-gray-100 bg-[#408dfb] w-60 lg:w-96 font-black rounded py-1 outline-none focus-within:ring-1 ring-white tracking-wider"
                    >
                      {loginLoading ? (
                        <LoaderCircle width={18} className="spinner" />
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-60 lg:w-96 text-right mt-2">
                <span className="text-xs cursor-pointer hover:underline hover:text-blue-600 tracking-wide">
                  forget password?
                </span>
              </div>
            </div>
          </div>
          <div className="lg:w-5/12 lg:flex hidden"></div>
        </div>
        <div className="w-full text-center text-gray-100">
          © 2024, Star Appliances. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
