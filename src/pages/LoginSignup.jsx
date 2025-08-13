import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Login from "../assets/undraw_online-learning_tgmv.svg";
import Logo from '../assets/Logo.png';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-8">
          <img
            src={Login}
            alt="SkillSwap Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          {/* Logo + Toggle */}
          <div className="flex justify-between items-center mb-6">
            <img src={Logo} alt="SkillSwap Logo" className="w-30 h-8" />
            <div className="flex space-x-4 text-sm font-medium">
              <button
                className={`pb-1 border-b-2 ${
                  isLogin ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"
                }`}
                onClick={() => setIsLogin(true)}
              >
                LOGIN
              </button>
              <button
                className={`pb-1 border-b-2 ${
                  !isLogin ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"
                }`}
                onClick={() => setIsLogin(false)}
              >
                SIGN UP
              </button>
            </div>
          </div>

          {/* Form */}
          <h2 className="text-xl font-semibold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
          <form className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-900 transition"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="flex space-x-4">
            <button className="flex items-center justify-center w-1/2 border rounded-lg py-2 hover:bg-gray-50 transition">
              <FcGoogle className="text-lg mr-2" /> Google
            </button>
            <button className="flex items-center justify-center w-1/2 border rounded-lg py-2 hover:bg-gray-50 transition">
              <FaGithub className="text-lg mr-2" /> GitHub
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-sm text-gray-500 text-center mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-indigo-500 font-medium hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
