"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, EyeOff, Eye, LoaderCircle } from "lucide-react";
import { login } from "./action";
import { toast } from "sonner";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      // Clear any existing cookies to help with the 431 error
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      const result = await login(formData);
      if (result?.success) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("431")) {
        toast.error("Login failed: Header too large. Please clear your browser cookies and try again.");
      } else {
        toast.error("Invalid Email or Password");
      }
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-3 flex justify-between items-center">
        <div className="h-20 relative w-[340px]">
          <Image
            src="/charusat.jpg"
            alt="Charotar University of Science and Technology"
            fill
            className="object-contain object-left"
          />
        </div>
        <div className="h-26 relative w-[120px]">
          <Image
            src="/depstar.png"
            alt="DEPSTAR"
            fill
            className="object-contain object-right"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-top justify-around px-24 pt-5">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start max-w-xl">
          <div className="relative w-full h-[650px]">
            <Image
              src="/login-page.png"
              alt="Classroom illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="w-full mt-5">
            <h3 className="text-4xl font-bold text-[#010922] pt-5 mb-6">
              Sign In
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-6 pt-3">
                <label
                  htmlFor="email"
                  className="block text-2xl font-medium text-[#010922] mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-white border border-[#d9d9d9] text-[#010922] text-lg rounded-lg focus:ring-[#1a5ca1] focus:border-[#1a5ca1] block w-full pl-12 p-4"
                    placeholder="your.email@charusat.ac.in"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-2xl font-medium text-[#010922]"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/reset-password"
                    className="text-[#1a5ca1] text-lg hover:underline font-semibold"
                  >
                    Forgot Password ?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="bg-white border border-[#d9d9d9] text-[#010922] text-lg rounded-lg focus:ring-[#1a5ca1] focus:border-[#1a5ca1] block w-full pl-12 p-4"
                    placeholder={showPassword ? "password" : "********"}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? (
                      <Eye
                        className="h-6 w-6 text-gray-400 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <EyeOff
                        className="h-6 w-6 text-gray-400 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center h-12 bg-[#1a5ca1] hover:bg-[#154e8a] text-white font-bold py-4 px-4 rounded-lg text-xl cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex justify-between items-center gap-x-3">
                    <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                    <p className="text-sm">Signing...</p>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
