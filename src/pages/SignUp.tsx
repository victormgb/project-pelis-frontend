import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectError, selectIsLoading, signup } from "../redux/auth/authSlice";
// import { useAuthStore } from "../store/authStore";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const { signup, isLoading, error } = useAuthStore();

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    try {
      const result = await dispatch(signup({username, email, password})) as any;
      console.log("result", result);
      if(!result.error) {
        navigate("/");
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    const usernameRegex = /^[a-zA-Z0-9]*$/;

    if (usernameRegex.test(newValue) || newValue === '') {
      setUsername(newValue);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/background_banner.jpg')",
      }}
    >
      <div className="max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto mt-8">
        <h1 className="text-3xl font-medium text-white mb-7">Sign Up</h1>

        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="username"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@gmail.com"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e50914] text-white py-2 rounded text-base hover:opacity-90 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-10 text-[#737373] text-sm">
          <p>
            Already have an account?
            <span
              onClick={() => navigate("/signin")}
              className="text-white font-medium cursor-pointer ml-2 hover:underline"
            >
              Sign In Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
